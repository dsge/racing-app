import { TestBed } from '@angular/core/testing';

import { ScoreScreenService } from './score-screen.service';

describe('ScoreScreenService', () => {
  let service: ScoreScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
