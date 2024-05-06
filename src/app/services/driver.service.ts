import { Injectable, inject } from '@angular/core';
import { Driver } from '../models/driver.model';
import { Observable, map } from 'rxjs';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  protected readonly apiService: ApiService = inject(ApiService);

  public getDriversForYear(year: number): Observable<Driver[]> {
    return this.apiService
      .getDriversForYear(year)
      .pipe(map((res: { data: Driver[] | null }) => res.data ?? []));
  }

  public getDriverById(id: number): Observable<Driver | undefined> {
    return this.apiService
      .getDriverById(id)
      .pipe(
        map((res: { data: Driver[] | null }) => res.data?.[0] ?? undefined)
      );
  }

  public createDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.createDriver(model);
  }

  public updateDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.updateDriver(model);
  }

  public deleteDriver(
    model: Driver
  ): Observable<PostgrestSingleResponse<null>> {
    return this.apiService.deleteDriver(model);
  }
}
