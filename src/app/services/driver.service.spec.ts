import { TestBed } from '@angular/core/testing';

import { DriverService } from './driver.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';

describe('DriverService', () => {
  let service: DriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient()
      ]
    });
    service = TestBed.inject(DriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
