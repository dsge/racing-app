import { Injectable, inject } from '@angular/core';
import {
  AuthError,
  AuthTokenResponsePassword,
  PostgrestSingleResponse,
  SignInWithPasswordCredentials,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';
import { Race, UserProfile } from '../models/race.model';
import { Observable, from } from 'rxjs';
import { UserVoteRecord } from '../models/user-vote.model';
import { Driver } from '../models/driver.model';
import { format, getYear, sub } from 'date-fns';

/**
 * Contains all the Supabase raw API calls
 *
 * This allows for easy mocking and testing in other services and components
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT);

  public getFinalResultsForRace(
    race: Race
  ): Observable<PostgrestSingleResponse<UserVoteRecord[]>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .select('*')
        .eq('is_final_result', true)
        .eq('race_id', race.id)
        .returns<UserVoteRecord[]>()
    );
  }

  public deleteFinalResultsFromRace(
    race: Race
  ): Observable<PostgrestSingleResponse<unknown>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .delete()
        .eq('race_id', race.id)
        .eq('is_final_result', true)
    );
  }

  public insertFinalResultsForRace(
    race: Race,
    votes: UserVoteRecord[]
  ): Observable<PostgrestSingleResponse<unknown>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .insert(
          votes.map((vote: UserVoteRecord) => ({
            race_id: race.id,
            ...vote,
            is_final_result: true,
          }))
        )
        .returns()
    );
  }

  public getUserVotesForRace(
    race: Race,
    user: User
  ): Observable<PostgrestSingleResponse<UserVoteRecord[]>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('is_final_result', false)
        .eq('race_id', race.id)
        .returns<UserVoteRecord[]>()
    );
  }

  public deleteUserVotesFromRace(
    race: Race,
    user: User
  ): Observable<PostgrestSingleResponse<unknown>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .delete()
        .eq('user_uuid', user.id)
        .eq('race_id', race.id)
        .eq('is_final_result', false)
    );
  }

  public insertUserVotesForRace(
    race: Race,
    votes: UserVoteRecord[]
  ): Observable<PostgrestSingleResponse<unknown>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .insert(
          votes.map((vote: UserVoteRecord) => ({
            race_id: race.id,
            ...vote,
            is_final_result: false,
          }))
        )
        .returns()
    );
  }

  public getDriversForYear(
    year: number
  ): Observable<PostgrestSingleResponse<Driver[]>> {
    return from(
      this.supabaseClient
        .from('drivers')
        .select()
        .match({ year_of_racing: year + '' })
        .order('full_name', { ascending: true })
        .returns<Driver[]>()
    );
  }

  public getDriverById(
    id: number
  ): Observable<PostgrestSingleResponse<Driver[]>> {
    return from(
      this.supabaseClient
        .from('drivers')
        .select()
        .match({ id: id })
        .returns<Driver[]>()
    );
  }

  public createDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('drivers').insert(model));
  }

  public updateDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseClient.from('drivers').update(model).eq('id', model.id)
    );
  }

  public deleteDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseClient.from('drivers').delete().eq('id', model.id)
    );
  }

  public createRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('races').insert(model));
  }

  public updateRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(
      this.supabaseClient.from('races').update(model).eq('id', model.id)
    );
  }

  public deleteRace(model: Race): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('races').delete().eq('id', model.id));
  }

  public getRaceById(
    id: number | string
  ): Observable<PostgrestSingleResponse<Race[]>> {
    return from(
      this.supabaseClient
        .from('races')
        .select()
        .match({ id: id })
        .returns<Race[]>()
    );
  }

  public getOngoingRaces(
    now: Date = new Date()
  ): Observable<PostgrestSingleResponse<Race[]>> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    return from(
      this.supabaseClient
        .from('races')
        .select()
        .lte('race_start_date', todaysDate)
        .gte('race_end_date', todaysDate)
        .order('race_end_date', { ascending: true })
        .returns<Race[]>()
    );
  }

  public getUpcomingRaces(
    now: Date = new Date()
  ): Observable<PostgrestSingleResponse<Race[]>> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    return from(
      this.supabaseClient
        .from('races')
        .select()
        .gt('race_start_date', todaysDate)
        .order('race_end_date', { ascending: true })
        .returns<Race[]>()
    );
  }

  public getRecentRaces(
    now: Date = new Date()
  ): Observable<PostgrestSingleResponse<Race[]>> {
    const todaysDate: string = format(now, 'yyyy-MM-dd');
    const pastOneMonthDate: string = format(
      sub(now, { months: 1 }),
      'yyyy-MM-dd'
    );
    return from(
      this.supabaseClient
        .from('races')
        .select()
        .gt('race_end_date', pastOneMonthDate)
        .lt('race_end_date', todaysDate)
        .order('race_end_date', { ascending: true })
        .returns<Race[]>()
    );
  }

  public getRacesByYear(
    year: number,
    now: Date = new Date()
  ): Observable<PostgrestSingleResponse<Race[]>> {
    const currentYear: number = getYear(now);
    const pastOneMonthDate: string = format(
      sub(now, { months: 1 }),
      'yyyy-MM-dd'
    );
    const startOfYear: string = `${year}-01-01`;
    const endOfYear: string = `${year}-12-31`;
    let endDate: string;
    if (year === currentYear) {
      endDate = pastOneMonthDate;
    } else {
      endDate = endOfYear;
    }
    return from(
      this.supabaseClient
        .from('races')
        .select()
        .gte('race_end_date', startOfYear)
        .lte('race_end_date', endDate)
        .order('race_end_date', { ascending: true })
        .returns<Race[]>()
    );
  }

  public getUserHasVoted(
    race: Race,
    user: User
  ): Observable<PostgrestSingleResponse<UserVoteRecord[]>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_uuid', user.id)
        .eq('race_id', race.id)
        .eq('is_final_result', false)
        .returns<UserVoteRecord[]>()
    );
  }

  public getRaceScoreScreenVotes(
    race: Race
  ): Observable<PostgrestSingleResponse<UserVoteRecord[]>> {
    return from(
      this.supabaseClient
        .from('user_votes')
        .select()
        .eq('race_id', race.id)
        .eq('is_final_result', false)
        .returns<UserVoteRecord[]>()
    );
  }

  public userIdToUserProfile(
    userId: string
  ): Observable<PostgrestSingleResponse<UserProfile[]>> {
    return from(
      this.supabaseClient
        .from('user_profiles')
        .select()
        .eq('id', userId)
        .returns<UserProfile[]>()
    );
  }

  public isModerator(
    user: User
  ): Observable<PostgrestSingleResponse<{ is_moderator: boolean }[]>> {
    return from(
      this.supabaseClient
        .from('user_profiles')
        .select('id, is_moderator')
        .match({ is_moderator: true, id: user.id })
        .returns<{ is_moderator: boolean }[]>()
    );
  }
  public signInWithPassword(
    credentials: SignInWithPasswordCredentials
  ): Observable<AuthTokenResponsePassword> {
    return from(this.supabaseClient.auth.signInWithPassword(credentials));
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabaseClient.auth.signOut());
  }
}
