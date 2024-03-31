import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Driver } from '../models/driver.model';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  protected readonly apiService: ApiService = inject(ApiService);
  protected readonly supabaseTableName: string = 'drivers';

  constructor() {
    this.getDriversForYear(2023).subscribe((drivers: Driver[]) => {
      console.log('DRIVERS', drivers)
    });
  }

  /**
   * @returns a list of numbers representing years, starting from 2023 up until the current year, e.g. [2023, 2024]
   */
  public getYears(): number[] {
    const firstYear: number = 2023;
    const ret: number[] = [];
    let currentYear: number = (new Date()).getFullYear();
    if (currentYear <= firstYear) {
      currentYear = firstYear;
    }
    if (currentYear >= firstYear) {
      for (let year: number = firstYear; year <= currentYear; year++) {
        ret.push(year);
      }
    }
    return ret;
  }

  public getDriversForYear(year: number): Observable<Driver[]> {
    return from(this.apiService.getSupabaseClient().from(this.supabaseTableName).select().match({'year_of_racing': year + ''}).returns<Driver[]>())
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((res: any) => (res.data as Driver[]))
      )
  }
}
