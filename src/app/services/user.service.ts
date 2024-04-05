import { Injectable, inject } from '@angular/core';
import { AuthChangeEvent, AuthError, AuthTokenResponsePassword, Session, SignInWithPasswordCredentials, Subscription, User } from '@supabase/supabase-js';
import { Observable, from, map, Subscriber, switchMap, of, shareReplay } from 'rxjs';
import { SupabaseAuthStateChangeEvent } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected readonly supabaseAuthStateChange$: Observable<SupabaseAuthStateChangeEvent>;
  protected readonly isModerator$: Observable<boolean>;
  protected readonly apiService: ApiService = inject(ApiService);

  constructor() {
    this.supabaseAuthStateChange$ = this.createSupabaseAuthChangeEventSubject();
    this.isModerator$ = this.createIsModeratorObservable();
  }

  public signInWithPassword(credentials: SignInWithPasswordCredentials): Observable<AuthTokenResponsePassword> {
    return from(this.apiService.getSupabaseClient().auth.signInWithPassword(credentials));
  }

  /**
   * @returns the currently logged in user or null
   */
  public getUser(): Observable<User | null> {
    return this.supabaseAuthStateChange$.pipe(
      map(({ session }: SupabaseAuthStateChangeEvent) => session?.user ?? null)
    );
  }
  /**
   * @returns true if the currently logged in user has moderator permissions, false otherwise
   */
  public isModerator(): Observable<boolean> {
    return this.isModerator$;
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.apiService.getSupabaseClient().auth.signOut())
  }

  protected createIsModeratorObservable(): Observable<boolean> {
    return this.getUser().pipe(
      switchMap((user: User | null) => {
        if (!user) {
          return of(false);
        }
        return from(this.apiService.getSupabaseClient().from('user_profiles').select('id, is_moderator').match({'is_moderator': true, 'id': user.id}).returns<{is_moderator: boolean}[]>())
          .pipe(
            map((res: { data: {is_moderator: boolean}[] | null }) => res.data?.[0]?.is_moderator ?? false)
          )
      }),
      shareReplay(1)
    );
  }

  protected createSupabaseAuthChangeEventSubject(): Observable<SupabaseAuthStateChangeEvent> {
    return new Observable<SupabaseAuthStateChangeEvent>((subscriber: Subscriber<SupabaseAuthStateChangeEvent>) => {
      const { data }: { data: { subscription: Subscription; } } =
        this.apiService.getSupabaseClient().auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
          subscriber.next({ event, session });
        });
      return () => {
        data.subscription.unsubscribe();
      }
    }).pipe(shareReplay(1));
  }
}
