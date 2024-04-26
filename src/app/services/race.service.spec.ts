import { TestBed } from '@angular/core/testing';

import { RaceService } from './race.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';
import { ReplaySubject, take } from 'rxjs';
import { Race } from '../models/race.model';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

describe('RaceService', () => {
  let service: RaceService;
  let supabaseApiResponse$: ReplaySubject<Response>;

  beforeEach(() => {
    supabaseApiResponse$ = new ReplaySubject<Response>(1);
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient(supabaseApiResponse$)
      ]
    });
    service = TestBed.inject(RaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete the race', (done: DoneFn) => {
    service.deleteRace({ id: 5 } as Race).pipe(take(1)).subscribe((res: PostgrestSingleResponse<null>) => {
      expect(res.data).toBeDefined();
      done();
    });
    supabaseApiResponse$.next(new Response());
  });
});
