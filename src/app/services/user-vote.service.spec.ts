import { TestBed } from '@angular/core/testing';

import { UserVoteService } from './user-vote.service';

describe('UserVoteService', () => {
  let service: UserVoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
