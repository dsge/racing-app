import { Injectable, inject } from '@angular/core';
import { AuthChangeEvent, AuthError, AuthTokenResponsePassword, Session, SignInWithPasswordCredentials, Subscription, User } from '@supabase/supabase-js';
import { Observable, from, map, Subscriber } from 'rxjs';
import { SupabaseAuthStateChangeEvent } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected readonly supabaseAuthStateChange: Observable<SupabaseAuthStateChangeEvent>;
  protected readonly apiService: ApiService = inject(ApiService);

  constructor() {
    this.supabaseAuthStateChange = this.createSupabaseAuthChangeEventSubject();
  }

  public signInWithPassword(credentials: SignInWithPasswordCredentials): Observable<AuthTokenResponsePassword> {
    return from(this.apiService.getSupabaseClient().auth.signInWithPassword(credentials));
  }

  /**
   * @returns the currently logged in user or null
   */
  public getUser(): Observable<User | null> {
    return this.supabaseAuthStateChange.pipe(
      map(({ session }: SupabaseAuthStateChangeEvent) => session?.user ?? null)
    );
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.apiService.getSupabaseClient().auth.signOut())
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
    });
  }
}
