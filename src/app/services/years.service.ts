import { Injectable } from '@angular/core';
import { getYearsListStartingFrom } from '../utils/years';

@Injectable({
  providedIn: 'root'
})
export class YearsService {
  /**
   * @returns a list of numbers representing years, starting from `firstYear` up until the current year, e.g. [2023, 2024]
   */
  public getYears(): number[] {
    return getYearsListStartingFrom(2023);
  }
}
