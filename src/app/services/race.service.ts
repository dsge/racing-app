import { Injectable, inject } from '@angular/core';
import { format, formatISO, isBefore, parseISO } from 'date-fns';
import { Race } from '../models/race.model';
import { Observable, combineLatest, from, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  protected apiService: ApiService = inject(ApiService);
  protected userService: UserService = inject(UserService);

  public getRaces(): Observable<Race[]> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of([]);
        }
        return from(this.apiService.getSupabaseClient().from('races').select().returns<Race[]>())
          .pipe(
            map((res: PostgrestSingleResponse<Race[]>) => res.data ?? []),
            switchMap((models: Race[]) => combineLatest(
              models.map((model: Race) => this.getUserHasVoted(model, user).pipe(
                map((currentUserHasVoted: boolean) => ({...model, current_user_has_voted: currentUserHasVoted}))
              ))
            ))
          )
      })
    );
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(race.current_user_has_voted ?? false);
  }

  public hasVotingEnded(race: Race): boolean {
    return isBefore(this.getVotingEndTime(race), new Date());
  }

  public getVotingEndTime(race: Race): Date {
    return parseISO(race.voting_end_time || race.race_start_date);
  }

  public createRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('races').insert(this.stringifyRaceFieldsIfNeeded(model)));
  }

  public updateRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('races').update(this.stringifyRaceFieldsIfNeeded(model)).eq('id', model.id));
  }

  public deleteRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('races').delete().eq('id', model.id));
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
    console.log('SAVING...', ret)
    return ret;
  }

  protected getUserHasVoted(race: Race, user: User): Observable<boolean> {
    return from(
            this.apiService.getSupabaseClient()
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
