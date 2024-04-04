import { Injectable, inject } from '@angular/core';
import { format, formatDistance, formatISO, isBefore, parse, parseISO } from 'date-fns';
import { Race } from '../models/race.model';
import { Observable, from, map, of } from 'rxjs';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  protected apiService: ApiService = inject(ApiService);

  public getRaces(): Observable<Race[]> {
    return from(this.apiService.getSupabaseClient().from('races').select().returns<Race[]>())
      .pipe(
        map((res: { data: Race[] | null }) => res.data ?? [])
      )
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(Math.round((Math.random() * 1000)) % 2 == 0);
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
    return ret;
  }
}
