import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';
import { ReplaySubject, take } from 'rxjs';
import { Race, UserProfile } from '../models/race.model';
import {
  PostgrestSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { UserVoteRecord } from '../models/user-vote.model';
import { Driver } from '../models/driver.model';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';

describe('ApiService', () => {
  let service: ApiService;
  let supabaseApiResponse$: ReplaySubject<Response>;
  let supabaseClient: SupabaseClient;

  beforeEach(() => {
    supabaseApiResponse$ = new ReplaySubject<Response>(1);
    TestBed.configureTestingModule({
      providers: [provideMockSupabaseClient(supabaseApiResponse$)],
    });
    service = TestBed.inject(ApiService);
    supabaseClient = TestBed.inject(SUPABASE_CLIENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFinalResultsForRace', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getFinalResultsForRace({ id: 55 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<UserVoteRecord[]>) => {
          expect(res.data?.length).toBe(2);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            race_id: 5,
          },
          {
            race_id: 77,
          },
        ])
      );
    });
  });

  describe('deleteFinalResultsFromRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .deleteFinalResultsFromRace({ id: 55 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('insertFinalResultsForRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .insertFinalResultsForRace({ id: 55 } as Race, [{}])
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('getUserVotesForRace', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getUserVotesForRace({ id: 55 } as Race, { id: 'aa144' } as User)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<UserVoteRecord[]>) => {
          expect(res.data?.length).toBe(2);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            race_id: 5,
          },
          {
            race_id: 77,
          },
        ])
      );
    });
  });

  describe('deleteUserVotesFromRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .deleteUserVotesFromRace({ id: 55 } as Race, { id: 'foo' } as User)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('insertUserVotesForRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .insertUserVotesForRace({ id: 55 } as Race, [{}])
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('getDriversForYear', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getDriversForYear(1999)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Driver[]>) => {
          expect(res.data?.length).toBe(2);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
          {
            id: 77,
          },
        ])
      );
    });
  });

  describe('getDriverById', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getDriverById(5)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Driver[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('createDriver', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .createDriver({ id: 55 } as Driver)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('updateDriver', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .updateDriver({ id: 55 } as Driver)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('deleteDriver', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .deleteDriver({ id: 55 } as Driver)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('createRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .createRace({ id: 55 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('updateRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .updateRace({ id: 55 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('deleteRace', () => {
    it('should succeed', (done: DoneFn) => {
      service
        .deleteRace({ id: 55 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<unknown>) => {
          expect(res.error).toBeFalsy();
          done();
        });
      supabaseApiResponse$.next(Response.json({}));
    });
  });

  describe('getRaceById', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getRaceById(5)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('getOngoingRaces', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getOngoingRaces()
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('getUpcomingRaces', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getUpcomingRaces()
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('getRecentRaces', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getRecentRaces()
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('getRacesByYear', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getRacesByYear(1999)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });

    it('should return some for the current year', (done: DoneFn) => {
      service
        .getRacesByYear(1999, new Date(1999, 5, 5))
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<Race[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('getUserHasVoted', () => {
    it('should return a count', (done: DoneFn) => {
      service
        .getUserHasVoted({ id: 22 } as Race, { id: 'aaaa11' } as User)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<UserVoteRecord[]>) => {
          expect(res.count).toBe(555);
          done();
        });
      supabaseApiResponse$.next(
        Response.json({}, { headers: { 'content-range': '0/555' } })
      );
    });
  });

  describe('getRaceScoreScreenVotes', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .getRaceScoreScreenVotes({ id: 22 } as Race)
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<UserVoteRecord[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('userIdToUserProfile', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .userIdToUserProfile('afwa2211')
        .pipe(take(1))
        .subscribe((res: PostgrestSingleResponse<UserProfile[]>) => {
          expect(res.data?.length).toBe(1);
          done();
        });
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
  });

  describe('isModerator', () => {
    it('should return some records', (done: DoneFn) => {
      service
        .isModerator({ id: 'asda' } as User)
        .pipe(take(1))
        .subscribe(
          (
            res: PostgrestSingleResponse<
              {
                is_moderator: boolean;
              }[]
            >
          ) => {
            expect(res.data?.length).toBe(1);
            done();
          }
        );
      supabaseApiResponse$.next(
        Response.json([
          {
            id: 5,
          },
        ])
      );
    });
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
});
