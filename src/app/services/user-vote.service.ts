import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Race } from '../models/race.model';
import { Observable, from, map, of, switchMap, take } from 'rxjs';
import { PostgrestSingleResponse, User } from '@supabase/supabase-js';
import { UserVote } from '../models/user-vote.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserVoteService {
  protected apiService: ApiService = inject(ApiService);
  protected userService: UserService = inject(UserService);

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
            .returns<UserVote[]>()
        )
          .pipe(
            map((res: PostgrestSingleResponse<UserVote[]>) => res.data ?? []),
          )
      })
    );
  }

  public setUserVotes(race: Race, votes: UserVote[]): Observable<PostgrestSingleResponse<null>> {
    console.log('SetUserVotes', race, votes);
    return of();
  }
}
