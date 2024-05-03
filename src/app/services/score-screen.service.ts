import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';
import { UserVoteService } from './user-vote.service';
import { Race, RaceScoreScreenVote, RaceScoreScreenVotes, UserProfile } from '../models/race.model';
import { UserVote, UserVoteRecord } from '../models/user-vote.model';
import { Observable, combineLatest, from, map, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreScreenService {
  protected supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT);
  protected userVoteService: UserVoteService = inject(UserVoteService);

  /**
   * Who voted for what, and what was the final result?
   */
  public getRaceScoreScreenVotes(race: Race): Observable<RaceScoreScreenVotes> {
    return from(this.supabaseClient
      .from('user_votes')
      .select()
      .eq('race_id', race.id)
      .returns<UserVoteRecord[]>()
    ).pipe(
      map((res: { data: UserVoteRecord[] | null }) => res.data ?? undefined),
      take(1),
      switchMap((records: UserVoteRecord[] | undefined) => this.userVoteRecordsToRaceScoreScreenVotes(race, records))
    )
  }

  protected userVoteRecordsToRaceScoreScreenVotes(race: Race, records?: UserVoteRecord[]): Observable<RaceScoreScreenVotes> {
    if (!records?.length) {
      return of({
        userVotes: []
      });
    }

    const uniqueUserIds: string[] = records
      .map((record: UserVoteRecord) => record.user_uuid!)
      .filter((userId: string | undefined) => !!userId)
      .filter((userId: string, index: number, self: string[]) => self.indexOf(userId) == index);

    const allUserVotes$: Observable<RaceScoreScreenVote[]> = combineLatest(uniqueUserIds.map((userId: string) => {
        return this.userIdToUserProfile(userId).pipe(
          take(1),
          map((userProfile: UserProfile | undefined) => {
            return {
              user: userProfile,
              votes: records.filter((record: UserVoteRecord) => record.user_uuid === userId)
            }
          })
        )
      })
    )
    return combineLatest([
      this.userVoteService.getRaceFinalResults(race),
      allUserVotes$
    ]).pipe(
      take(1),
      map(([finalResults, allUserVotes]: [UserVote[], RaceScoreScreenVote[]]) => {
        return {
          raceFinalResults: finalResults,
          userVotes: allUserVotes
        }
      })
    )
  }

  protected userIdToUserProfile(userId: string): Observable<UserProfile | undefined> {
    return from(this.supabaseClient
      .from('user_profiles')
      .select()
      .eq('id', userId)
      .returns<UserProfile[]>()
    ).pipe(
      map((res: { data: UserProfile[] | null }) => res.data?.[0] ?? undefined)
    );
  }
}
