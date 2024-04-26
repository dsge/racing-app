import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient()
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
