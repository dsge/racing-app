import { TestBed } from '@angular/core/testing';

import { ScoreScreenService } from './score-screen.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';

describe('ScoreScreenService', () => {
  let service: ScoreScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockSupabaseClient()],
    });
    service = TestBed.inject(ScoreScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
