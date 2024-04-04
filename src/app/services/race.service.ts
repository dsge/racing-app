import { Injectable } from '@angular/core';
import { isBefore } from 'date-fns';
import { Race } from '../models/race.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor() {
    /*from(this.supabaseClient.from('races').select().returns<object>()).subscribe((value: unknown) => {
      console.log('races', value)
    })*/
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(Math.round((Math.random() * 1000)) % 2 == 0);
  }

  public hasVotingEnded(race: Race): boolean {
    return isBefore(this.getVotingEndTime(race), new Date());
  }

  public getVotingEndTime(race: Race): Date {
    return new Date(race.voting_end_time || race.race_start_date);
  }
}
