import { Injectable, inject } from '@angular/core';
import { format, formatISO, isBefore, parseISO, sub } from 'date-fns';
import { Race } from '../models/race.model';
import { Observable, combineLatest, from, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, SupabaseClient, User } from '@supabase/supabase-js';
import { UserService } from './user.service';
import { YearsService } from './years.service';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  protected supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT);
  protected userService: UserService = inject(UserService);
  protected yearsService: YearsService = inject(YearsService);

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(race.current_user_has_voted ?? false);
  }

  public hasVotingEnded(race: Race, now: Date = new Date()): boolean {
    const pastOneMonthDate: Date = sub(now, { months: 1 });
    return isBefore(this.getVotingEndTime(race), now) || isBefore(this.getRaceEndDate(race), pastOneMonthDate);
  }

  public getVotingEndTime(race: Race): Date {
    return parseISO(race.voting_end_time || race.race_start_date);
  }

  public getRaceEndDate(race: Race): Date {
    return parseISO(race.race_end_date);
  }

  public createRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('races').insert(this.stringifyRaceFieldsIfNeeded(model)));
  }

  public updateRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('races').update(this.stringifyRaceFieldsIfNeeded(model)).eq('id', model.id));
  }

  public deleteRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('races').delete().eq('id', model.id));
  }

  public getOngoingRaces(now: Date = new Date()): Observable<Race[]> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    return this.addCurrentUserHasVotedField(
      from(this.supabaseClient
          .from('races')
          .select()
          .lte('race_start_date', todaysDate)
          .gte('race_end_date', todaysDate)
          .returns<Race[]>()
        )
        .pipe(
          map((res: PostgrestSingleResponse<Race[]>) => res.data ?? [])
        )
    );
  }

  public getUpcomingRaces(now: Date = new Date()): Observable<Race[]> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    return from(this.supabaseClient
        .from('races')
        .select()
        .gt('race_start_date', todaysDate)
        .returns<Race[]>()
      )
      .pipe(
        map((res: PostgrestSingleResponse<Race[]>) => res.data ?? [])
      );
  }

  public getRecentRaces(now: Date = new Date()): Observable<Race[]> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    const pastOneMonthDate: string = format(sub(now, { months: 1 }), 'yyyy-MM-dd');
    return from(this.supabaseClient
        .from('races')
        .select()
        .gt('race_end_date', pastOneMonthDate)
        .lt('race_end_date', todaysDate)
        .returns<Race[]>()
      )
      .pipe(
        map((res: PostgrestSingleResponse<Race[]>) => res.data ?? [])
      );
  }

  public getRacesByYear(year: number, now: Date = new Date()): Observable<Race[]> {
    const currentYear: number = this.yearsService.getCurrentYear(now);
    const pastOneMonthDate: string = format(sub(now, { months: 1 }), 'yyyy-MM-dd');
    const startOfYear: string = `${year}-01-01`;
    const endOfYear: string = `${year}-12-31`;
    let endDate: string;
    if (year === currentYear) {
      endDate = pastOneMonthDate;
    } else {
      endDate = endOfYear;
    }

    return from(this.supabaseClient
      .from('races')
      .select()
      .gte('race_end_date', startOfYear)
      .lte('race_end_date', endDate)
      .returns<Race[]>()
    ).pipe(
      map((res: PostgrestSingleResponse<Race[]>) => res.data ?? [])
    );
  }

  protected getRaces(): Observable<Race[]> {
    return this.addCurrentUserHasVotedField(
      from(this.supabaseClient.from('races').select().returns<Race[]>())
        .pipe(
          map((res: PostgrestSingleResponse<Race[]>) => res.data ?? [])
        )
    );
  }

  protected addCurrentUserHasVotedField(models$: Observable<Race[]>): Observable<Race[]> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of([]);
        }
        return models$
          .pipe(
            switchMap((models: Race[]) => combineLatest(
              models.map((model: Race) => this.getUserHasVoted(model, user).pipe(
                map((currentUserHasVoted: boolean) => ({...model, current_user_has_voted: currentUserHasVoted}))
              ))
            ))
          )
      })
    );
  }

  protected stringifyRaceFieldsIfNeeded(race: Race): Race {
    const ret: Race = {...race};
    const dateFormat: string = 'yyyy-MM-dd';
    if (ret.race_start_date as unknown as object instanceof Date) {
      ret.race_start_date = format(ret.race_start_date as unknown as Date, dateFormat);
    }
    if (ret.race_end_date as unknown as object instanceof Date) {
      ret.race_end_date = format(ret.race_end_date as unknown as Date, dateFormat);
    }
    if (ret.voting_end_time as unknown as object instanceof Date) {
      ret.voting_end_time = formatISO(ret.voting_end_time as unknown as Date);
    }
    if (Object.hasOwn(ret, 'current_user_has_voted')) {
      delete ret.current_user_has_voted;
    }
    return ret;
  }

  protected getUserHasVoted(race: Race, user: User): Observable<boolean> {
    return from(
            this.supabaseClient
              .from('user_votes')
              .select('*', { count: 'exact', head: true })
              .eq('user_uuid', user.id)
              .eq('race_id', race.id)
              .returns<null>()
            )
          .pipe(
            map((res: PostgrestSingleResponse<null>) => !!res.count),
          )
  }
}
