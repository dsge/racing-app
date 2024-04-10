import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Race } from '../models/race.model';
import { Observable, of } from 'rxjs';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { UserVote } from '../models/user-vote.model';

@Injectable({
  providedIn: 'root'
})
export class UserVoteService {
  protected apiService: ApiService = inject(ApiService);

  public getUserVotes(race: Race): Observable<UserVote[]> {
    return of([]);
  }

  public setUserVotes(race: Race, votes: UserVote[]): Observable<PostgrestSingleResponse<null>> {
    console.log('SetUserVotes', race, votes);
    return of();
  }
}
