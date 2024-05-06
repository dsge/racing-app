import { Injectable, inject } from '@angular/core';
import { format, formatISO, isBefore, parseISO, sub } from 'date-fns';
import { Race } from '../models/race.model';
import { Observable, combineLatest, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { UserService } from './user.service';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { UserVoteService } from './user-vote.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  protected userService: UserService = inject(UserService);
  protected userVoteService: UserVoteService = inject(UserVoteService);
  protected apiService: ApiService = inject(ApiService);

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(race.current_user_has_voted ?? false);
  }

  public hasVotingEnded(race: Race, now: Date = new Date()): boolean {
    const pastOneMonthDate: Date = sub(now, { months: 1 });
    return (
      isBefore(this.getVotingEndTime(race), now) ||
      isBefore(this.getRaceEndDate(race), pastOneMonthDate)
    );
  }

  public getVotingEndTime(race: Race): Date {
    return parseISO(race.voting_end_time || race.race_start_date);
  }

  public getRaceEndDate(race: Race): Date {
    return parseISO(race.race_end_date);
  }

  public createRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.createRace(this.stringifyRaceFieldsIfNeeded(model));
  }

  public updateRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.updateRace(this.stringifyRaceFieldsIfNeeded(model));
  }

  public deleteRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.createRace(model);
  }

  public getRaceById(id: number | string): Observable<Race | undefined> {
    return this.apiService
      .getRaceById(id)
      .pipe(map((res: { data: Race[] | null }) => res.data?.[0] ?? undefined));
  }

  public setRaceFinalResults(
    model: Race,
    finalResults: UserVote[]
  ): Observable<PostgrestSingleResponse<unknown> | null> {
    return this.userVoteService.setRaceFinalResults(model, finalResults);
  }

  public getRaceFinalResults(model: Race): Observable<UserVote[]> {
    return this.userVoteService.getRaceFinalResults(model);
  }

  public getOngoingRaces(now: Date = new Date()): Observable<Race[]> {
    return this.addCurrentUserHasVotedField(
      this.apiService
        .getOngoingRaces(now)
        .pipe(map((res: PostgrestSingleResponse<Race[]>) => res.data ?? []))
    );
  }

  public getUpcomingRaces(now: Date = new Date()): Observable<Race[]> {
    return this.addCurrentUserHasVotedField(
      this.apiService
        .getUpcomingRaces(now)
        .pipe(map((res: PostgrestSingleResponse<Race[]>) => res.data ?? []))
    );
  }

  public getRecentRaces(now: Date = new Date()): Observable<Race[]> {
    return this.apiService
      .getRecentRaces(now)
      .pipe(map((res: PostgrestSingleResponse<Race[]>) => res.data ?? []));
  }

  public getRacesByYear(
    year: number,
    now: Date = new Date()
  ): Observable<Race[]> {
    return this.apiService
      .getRacesByYear(year, now)
      .pipe(map((res: PostgrestSingleResponse<Race[]>) => res.data ?? []));
  }

  protected addCurrentUserHasVotedField(
    models$: Observable<Race[]>
  ): Observable<Race[]> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of([]);
        }
        return models$.pipe(
          switchMap((models: Race[]) =>
            combineLatest(
              models.map((model: Race) =>
                this.getUserHasVoted(model, user).pipe(
                  map((currentUserHasVoted: boolean) => ({
                    ...model,
                    current_user_has_voted: currentUserHasVoted,
                  }))
                )
              )
            )
          )
        );
      })
    );
  }

  protected stringifyRaceFieldsIfNeeded(race: Race): Race {
    const ret: Race = { ...race };
    const dateFormat: string = 'yyyy-MM-dd';
    if ((ret.race_start_date as unknown as object) instanceof Date) {
      ret.race_start_date = format(
        ret.race_start_date as unknown as Date,
        dateFormat
      );
    }
    if ((ret.race_end_date as unknown as object) instanceof Date) {
      ret.race_end_date = format(
        ret.race_end_date as unknown as Date,
        dateFormat
      );
    }
    if ((ret.voting_end_time as unknown as object) instanceof Date) {
      ret.voting_end_time = formatISO(ret.voting_end_time as unknown as Date);
    }
    if (Object.hasOwn(ret, 'current_user_has_voted')) {
      delete ret.current_user_has_voted;
    }
    return ret;
  }

  protected getUserHasVoted(race: Race, user: User): Observable<boolean> {
    return this.apiService
      .getUserHasVoted(race, user)
      .pipe(map((res: PostgrestSingleResponse<unknown>) => !!res.count));
  }
}
