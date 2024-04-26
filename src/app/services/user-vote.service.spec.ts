import { TestBed } from '@angular/core/testing';

import { UserVoteService } from './user-vote.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';

describe('UserVoteService', () => {
  let service: UserVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient()
      ]
    });
    service = TestBed.inject(UserVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
