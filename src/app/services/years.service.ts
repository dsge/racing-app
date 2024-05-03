import { Injectable } from '@angular/core';
import { getYearsListStartingFrom } from '../utils/years';
import { getYear } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class YearsService {
  /**
   * @returns a list of numbers representing years, starting from `firstYear` up until the current year, e.g. [2023, 2024]
   */
  public getYears(now: Date = new Date()): number[] {
    return getYearsListStartingFrom(2023, now);
  }

  public getYearsDescending(now: Date = new Date()): number[] {
    return this.getYears(now).reverse();
  }

  public getCurrentYear(now: Date = new Date()): number {
    return getYear(now);
  }
}
