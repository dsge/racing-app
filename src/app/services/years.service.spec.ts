import { TestBed } from '@angular/core/testing';

import { YearsService } from './years.service';

describe('YearsService', () => {
  let service: YearsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getYears', () => {
    it('should return the correct years in 2025', () => {
      expect(service.getYears(new Date(2025, 6, 6))).toEqual([
        2023, 2024, 2025,
      ]);
    });
  });

  describe('getYearsDescending', () => {
    it('should return the correct years in 2026', () => {
      expect(service.getYearsDescending(new Date(2026, 6, 6))).toEqual([
        2026, 2025, 2024, 2023,
      ]);
    });
  });

  describe('getCurrentYear', () => {
    it('should return the correct year in 2027', () => {
      expect(service.getCurrentYear()).toBeDefined();
      expect(service.getCurrentYear(new Date(2027, 6, 6))).toEqual(2027);
    });
  });
});
