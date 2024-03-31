import { Injectable } from '@angular/core';
import { AuthChangeEvent, AuthError, AuthTokenResponsePassword, createClient, Session, SignInWithPasswordCredentials, SupabaseClient, User } from '@supabase/supabase-js'
import { from, map, Observable, shareReplay, Subject } from 'rxjs';
import { APP_SUPABASE_URL, APP_SUPABASE_KEY } from '../app.config';
import { SupabaseAuthStateChangeEvent } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly supabaseClient: SupabaseClient;
  protected readonly supabaseAuthStateChange: Observable<SupabaseAuthStateChangeEvent>;

  constructor() {
    this.supabaseClient = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY);
    this.supabaseAuthStateChange = this.createSupabaseAuthChangeEventSubject();
    /*from(this.supabaseClient.from('races').select().returns<object>()).subscribe((value: unknown) => {
      console.log('races', value)
    })*/


  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }

  public signInWithPassword(credentials: SignInWithPasswordCredentials): Observable<AuthTokenResponsePassword> {
    return from(this.getSupabaseClient().auth.signInWithPassword(credentials));
  }

  /**
   * @returns the currently logged in user or null
   */
  public getUser(): Observable<User | null> {
    return this.supabaseAuthStateChange.pipe(
      map(({session}: SupabaseAuthStateChangeEvent) => session?.user ?? null)
    );
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.getSupabaseClient().auth.signOut())
  }

  protected createSupabaseAuthChangeEventSubject(): Observable<SupabaseAuthStateChangeEvent> {
    const ret: Subject<SupabaseAuthStateChangeEvent> = new Subject<SupabaseAuthStateChangeEvent>();
    /*const { data } = */this.supabaseClient.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      /*if (event === 'INITIAL_SESSION') {
        // handle initial session
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
      } else if (event === 'SIGNED_OUT') {
        // handle sign out event
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }*/
      ret.next({ event, session});
    })
    // const supabaseUnsubscribe: () => void = data.subscription.unsubscribe;

    return ret.pipe((shareReplay(1)));
  }
}
