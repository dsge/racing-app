import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Race } from '../models/race.model';
import { Observable, combineLatest, from, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { UserService } from './user.service';
import { DriverService } from './driver.service';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class UserVoteService {
  protected apiService: ApiService = inject(ApiService);
  protected userService: UserService = inject(UserService);
  protected driverService: DriverService = inject(DriverService);

  public getUserVotes(race: Race): Observable<UserVote[]> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of([]);
        }
        return from(
          this.apiService.getSupabaseClient()
            .from('user_votes')
            .select('*')
            .eq('user_uuid', user.id)
            .eq('race_id', race.id)
            .returns<UserVoteRecord[]>()
        )
          .pipe(
            map((res: PostgrestSingleResponse<UserVoteRecord[]>) => res.data ?? []),
            switchMap((userVoteRecords: UserVoteRecord[]) => this.userVoteRecordsToUserVotes(userVoteRecords))
          )
      })
    );
  }

  public setUserVotes(race: Race, votes: UserVote[]): Observable<PostgrestSingleResponse<unknown> | null> {
    return this.userService.getUser().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return of(null);
        }
        return this.removePreviousVotes(race, user).pipe(
            switchMap(() => from(
                this.apiService.getSupabaseClient()
                  .from('user_votes')
                  .insert(this.raceAndVotesToRecords(race, votes, user))
                  .returns()
              )
            )
          )
      })
    );
  }

  protected removePreviousVotes(race: Race, user: User): Observable<PostgrestSingleResponse<unknown>> {
    return from(
      this.apiService.getSupabaseClient()
        .from('user_votes')
        .delete()
        .eq('user_uuid', user.id)
        .eq('race_id', race.id)
    );
  }

  protected raceAndVotesToRecords(race: Race, votes: UserVote[], user: User): UserVoteRecord[] {
    return votes.map((vote: UserVote) => {
      return {
        user_uuid: user.id,
        race_id: race.id,
        driver_id: vote.driver.id,
        driver_final_position: vote.driver_final_position
      }
    })
  }

  protected userVoteRecordsToUserVotes(voteRecords: UserVoteRecord[]): Observable<UserVote[]> {
    if (!voteRecords.length) {
      return of([]);
    }
    return combineLatest(voteRecords.map((voteRecord: UserVoteRecord) => this.userVoteRecordToUserVote(voteRecord))).pipe(
      map((userVotes: (UserVote | undefined)[]) => userVotes.filter((userVote: UserVote | undefined) => !!userVote) as UserVote[] ),
      take(1),
    )
  }

  protected userVoteRecordToUserVote(voteRecord: UserVoteRecord): Observable<UserVote | undefined> {
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
          user_uuid: voteRecord.user_uuid,
          driver: driver
        }
      })
    );
  }
}
