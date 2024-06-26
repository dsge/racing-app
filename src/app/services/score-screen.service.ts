import { Injectable, inject } from '@angular/core';
import { UserVoteService } from './user-vote.service';
import {
  Race,
  RaceScoreScreenVote,
  RaceScoreScreenVotes,
  UserProfile,
} from '../models/race.model';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { Observable, combineLatest, map, of, switchMap, take } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreScreenService {
  protected userVoteService: UserVoteService = inject(UserVoteService);
  protected apiService: ApiService = inject(ApiService);

  /**
   * Who voted for what, and what was the final result?
   */
  public getRaceScoreScreenVotes(race: Race): Observable<RaceScoreScreenVotes> {
    return this.apiService.getRaceScoreScreenVotes(race).pipe(
      map((res: { data: UserVoteRecord[] | null }) => res.data ?? undefined),
      take(1),
      switchMap((records: UserVoteRecord[] | undefined) =>
        this.userVoteRecordsToRaceScoreScreenVotes(race, records)
      )
    );
  }

  protected userVoteRecordsToRaceScoreScreenVotes(
    race: Race,
    records?: UserVoteRecord[]
  ): Observable<RaceScoreScreenVotes> {
    if (!records?.length) {
      return of({
        userVotes: [],
      });
    }

    const uniqueUserIds: string[] = records
      .map((record: UserVoteRecord) => record.user_uuid!)
      .filter((userId: string | undefined) => !!userId)
      .filter(
        (userId: string, index: number, self: string[]) =>
          self.indexOf(userId) == index
      );

    const allUserVotes$: Observable<RaceScoreScreenVote[]> = combineLatest(
      uniqueUserIds.map((userId: string) => {
        return this.userIdToUserProfile(userId).pipe(
          take(1),
          map((userProfile: UserProfile | undefined) => {
            return {
              user: userProfile,
              votes: records.filter(
                (record: UserVoteRecord) => record.user_uuid === userId
              ),
            };
          })
        );
      })
    );
    return combineLatest([
      this.userVoteService.getRaceFinalResults(race),
      allUserVotes$,
    ]).pipe(
      take(1),
      map(
        ([finalResults, allUserVotes]: [UserVote[], RaceScoreScreenVote[]]) => {
          return {
            raceFinalResults: finalResults,
            userVotes: allUserVotes,
          };
        }
      )
    );
  }

  protected userIdToUserProfile(
    userId: string
  ): Observable<UserProfile | undefined> {
    return this.apiService
      .userIdToUserProfile(userId)
      .pipe(
        map((res: { data: UserProfile[] | null }) => res.data?.[0] ?? undefined)
      );
  }
}
