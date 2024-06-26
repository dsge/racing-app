import { Injectable, inject } from '@angular/core';
import { Race } from '../models/race.model';
import { Observable, combineLatest, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { UserService } from './user.service';
import { DriverService } from './driver.service';
import { Driver } from '../models/driver.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserVoteService {
  protected userService: UserService = inject(UserService);
  protected driverService: DriverService = inject(DriverService);
  protected apiService: ApiService = inject(ApiService);

  public getUserVotes(
    race: Race,
    is_final_result: boolean = false
  ): Observable<UserVote[]> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of([]);
        }
        let observable$: Observable<PostgrestSingleResponse<UserVoteRecord[]>>;
        if (is_final_result) {
          observable$ = this.apiService.getFinalResultsForRace(race);
        } else {
          observable$ = this.apiService.getUserVotesForRace(race, user);
        }

        return observable$.pipe(
          map(
            (res: PostgrestSingleResponse<UserVoteRecord[]>) => res.data ?? []
          ),
          switchMap((userVoteRecords: UserVoteRecord[]) =>
            this.userVoteRecordsToUserVotes(userVoteRecords)
          )
        );
      })
    );
  }

  public setUserVotes(
    race: Race,
    votes: UserVote[],
    is_final_result: boolean = false
  ): Observable<PostgrestSingleResponse<unknown> | null> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of(null);
        }
        return this.removePreviousVotes(race, user, is_final_result).pipe(
          switchMap(() =>
            this.insertNewVotes(race, user, votes, is_final_result)
          )
        );
      })
    );
  }

  public setRaceFinalResults(
    model: Race,
    finalResults: UserVote[]
  ): Observable<PostgrestSingleResponse<unknown> | null> {
    return this.setUserVotes(model, finalResults, true);
  }

  public getRaceFinalResults(model: Race): Observable<UserVote[]> {
    return this.getUserVotes(model, true);
  }

  protected insertNewVotes(
    race: Race,
    user: User,
    votes: UserVote[],
    is_final_result: boolean = false
  ): Observable<PostgrestSingleResponse<unknown>> {
    const records: UserVoteRecord[] = this.raceAndVotesToRecords(
      race,
      votes,
      user,
      is_final_result
    );
    if (is_final_result) {
      return this.apiService.insertFinalResultsForRace(race, records);
    } else {
      return this.apiService.insertUserVotesForRace(race, records);
    }
  }

  protected removePreviousVotes(
    race: Race,
    user: User,
    is_final_result: boolean = false
  ): Observable<PostgrestSingleResponse<unknown>> {
    if (is_final_result) {
      return this.apiService.deleteFinalResultsFromRace(race);
    } else {
      return this.apiService.deleteUserVotesFromRace(race, user);
    }
  }

  protected raceAndVotesToRecords(
    race: Race,
    votes: UserVote[],
    user: User,
    is_final_result: boolean = false
  ): UserVoteRecord[] {
    return votes.map((vote: UserVote) => {
      return {
        user_uuid: user.id,
        race_id: race.id,
        driver_id: vote.driver.id,
        driver_final_position: vote.is_fastest_lap_vote
          ? -1
          : vote.driver_final_position,
        is_fastest_lap_vote: !!vote.is_fastest_lap_vote,
        is_final_result: !!is_final_result,
      };
    });
  }

  protected userVoteRecordsToUserVotes(
    voteRecords: UserVoteRecord[]
  ): Observable<UserVote[]> {
    if (!voteRecords.length) {
      return of([]);
    }
    return combineLatest(
      voteRecords.map((voteRecord: UserVoteRecord) =>
        this.userVoteRecordToUserVote(voteRecord)
      )
    ).pipe(
      map(
        (userVotes: (UserVote | undefined)[]) =>
          userVotes.filter(
            (userVote: UserVote | undefined) => !!userVote
          ) as UserVote[]
      ),
      take(1)
    );
  }

  protected userVoteRecordToUserVote(
    voteRecord: UserVoteRecord
  ): Observable<UserVote | undefined> {
    if (!voteRecord.driver_id) {
      return of(undefined);
    }
    return this.driverService.getDriverById(voteRecord.driver_id).pipe(
      map((driver: Driver | undefined) => {
        if (!driver) {
          return undefined;
        }
        return {
          id: voteRecord.id,
          driver_final_position: voteRecord.driver_final_position,
          is_fastest_lap_vote: voteRecord.is_fastest_lap_vote,
          user_uuid: voteRecord.user_uuid,
          driver: driver,
        };
      })
    );
  }
}
