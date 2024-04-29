import { TestBed } from '@angular/core/testing';

import { UserVoteService } from './user-vote.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';
import { ReplaySubject, of, take } from 'rxjs';
import { UserService } from './user.service';
import { Race } from '../models/race.model';
import { UserVote } from '../models/user-vote.model';
import { User } from '@supabase/supabase-js';
import { DriverService } from './driver.service';
import { Driver } from '../models/driver.model';

describe('UserVoteService', () => {
  let service: UserVoteService;
  let supabaseApiResponse$: ReplaySubject<Response>;
  let userService: UserService;
  let driverService: DriverService;

  beforeEach(() => {
    supabaseApiResponse$ = new ReplaySubject<Response>(1);
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient(supabaseApiResponse$)
      ]
    });
    service = TestBed.inject(UserVoteService);
    userService = TestBed.inject(UserService);
    driverService = TestBed.inject(DriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserVotes', () => {
    it('should return an empty array when no user is logged in', (done: DoneFn) => {
      userService.getUser = jasmine.createSpy().and.returnValue(of(null));
      service.getUserVotes({} as Race).pipe(take(1)).subscribe((votes: UserVote[]) => {
        expect(votes.length).toBe(0);
        done();
      });
    });

    it('should return a list of votes when the user has voted for a race', (done: DoneFn) => {
      userService.getUser = jasmine.createSpy().and.returnValue(of({id: 'fakeuserid11'} as User));
      driverService.getDriverById = jasmine.createSpy().and.returnValue(of({  } as Driver));
      service.getUserVotes({id: 555} as Race).pipe(take(1)).subscribe((votes: UserVote[]) => {
        expect(votes.length).toBe(2);
        done();
      });
      supabaseApiResponse$.next(Response.json([
        {
          driver_id: 5
        },
        {
          driver_id: 77
        }
      ]));
    })

    it('should return an empty list when the api returns an error object', (done: DoneFn) => {
      userService.getUser = jasmine.createSpy().and.returnValue(of({id: 'fakeuserid11'} as User));
      driverService.getDriverById = jasmine.createSpy().and.returnValue(of({  } as Driver));
      service.getUserVotes({id: 555} as Race).pipe(take(1)).subscribe((votes: UserVote[]) => {
        expect(votes.length).toBe(0);
        done();
      });
      supabaseApiResponse$.next(Response.json({ error: {} }, { status: 400 }));
    })
  })
});
