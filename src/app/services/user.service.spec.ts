import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';
import {
  AuthChangeEvent,
  Session,
  Subscription,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';
import { ReplaySubject, take } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let supabaseClient: SupabaseClient;
  let supabaseApiResponse$: ReplaySubject<Response>;

  beforeEach(() => {
    supabaseApiResponse$ = new ReplaySubject<Response>(1);
    TestBed.configureTestingModule({
      providers: [provideMockSupabaseClient(supabaseApiResponse$)],
    });
    service = TestBed.inject(UserService);
    supabaseClient = TestBed.inject(SUPABASE_CLIENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signInWithPassword', () => {
    it('should call supabase signInWithPassword', () => {
      supabaseClient.auth.signInWithPassword = jasmine
        .createSpy()
        .and.resolveTo(null);
      service.signInWithPassword({
        email: 'foo',
        password: 'bar',
      });
      expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut', () => {
      supabaseClient.auth.signOut = jasmine.createSpy().and.resolveTo(null);
      service.signOut();
      expect(supabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    describe('internal unsub', () => {
      let authStateChangeSubscription: Subscription;
      beforeEach(() => {
        supabaseClient = TestBed.inject(SUPABASE_CLIENT);
        authStateChangeSubscription = {
          unsubscribe: jasmine.createSpy(),
        } as unknown as Subscription;
        supabaseClient.auth.onAuthStateChange = jasmine
          .createSpy()
          .and.callThrough()
          .and.returnValue({
            data: {
              subscription: authStateChangeSubscription,
            },
          });
        service = TestBed.inject(UserService);
      });
      it('should unsubscrube from the internal supabase auth change event after a user subscription suceeds', () => {
        service.getUser().subscribe().unsubscribe();
        expect(authStateChangeSubscription.unsubscribe).toHaveBeenCalledTimes(
          1
        );
      });
    });

    describe('user', () => {
      let authStateChangeCallback: (
        event: AuthChangeEvent,
        session: Session | null
      ) => void | Promise<void>;
      beforeEach(() => {
        supabaseClient = TestBed.inject(SUPABASE_CLIENT);
        supabaseClient.auth.onAuthStateChange = jasmine
          .createSpy()
          .and.callFake(
            (
              callback: (
                event: AuthChangeEvent,
                session: Session | null
              ) => void | Promise<void>
            ) => {
              authStateChangeCallback = callback;
              return { data: {} };
            }
          );
        service = TestBed.inject(UserService);
      });
      it('should return the currently logged in user', (done: DoneFn) => {
        const fakeUser: User = {} as User;
        service
          .getUser()
          .pipe(take(1))
          .subscribe((user: User | null) => {
            expect(user).toEqual(fakeUser);
            done();
          });
        authStateChangeCallback('SIGNED_IN', { user: fakeUser } as Session);
      });
      it('should return null when no user is logged in', (done: DoneFn) => {
        service
          .getUser()
          .pipe(take(1))
          .subscribe((user: User | null) => {
            expect(user).toBeNull();
            done();
          });
        authStateChangeCallback('SIGNED_OUT', null);
      });
    });

    describe('isModerator()', () => {
      let authStateChangeCallback: (
        event: AuthChangeEvent,
        session: Session | null
      ) => void | Promise<void>;
      beforeEach(() => {
        supabaseClient = TestBed.inject(SUPABASE_CLIENT);
        supabaseClient.auth.onAuthStateChange = jasmine
          .createSpy()
          .and.callFake(
            (
              callback: (
                event: AuthChangeEvent,
                session: Session | null
              ) => void | Promise<void>
            ) => {
              authStateChangeCallback = callback;
              return { data: {} };
            }
          );
        service = TestBed.inject(UserService);
      });
      it('should return false when no user is logged in', (done: DoneFn) => {
        service
          .isModerator()
          .pipe(take(1))
          .subscribe((isModerator: boolean) => {
            expect(isModerator).toBeFalse();
            done();
          });
        authStateChangeCallback('SIGNED_OUT', null);
      });
      it('should return false when a user is not a moderator', (done: DoneFn) => {
        service
          .isModerator()
          .pipe(take(1))
          .subscribe((isModerator: boolean) => {
            expect(isModerator).toBeFalse();
            done();
          });
        supabaseApiResponse$.next(
          new Response(
            JSON.stringify({
              data: [
                {
                  is_moderator: false,
                },
              ],
            })
          )
        );
        authStateChangeCallback('SIGNED_IN', {
          user: { id: 'foo' } as User,
        } as Session);
      });
    });
  });
});
