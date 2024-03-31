import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Driver } from '../models/driver.model';
import { Observable, from, map } from 'rxjs';
import { getYearsListStartingFrom } from '../utils/years';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  protected readonly apiService: ApiService = inject(ApiService);

  public getYears(): number[] {
    return getYearsListStartingFrom(2023);
  }

  public getDriversForYear(year: number): Observable<Driver[]> {
    return from(this.apiService.getSupabaseClient().from('drivers').select().match({'year_of_racing': year + ''}).returns<Driver[]>())
      .pipe(
        map((res: { data: Driver[] | null }) => res.data ?? [])
      )
  }

  public createDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('drivers').insert(model));
  }

  public updateDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('drivers').update(model).eq('id', model.id));
  }

  public deleteDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.apiService.getSupabaseClient().from('drivers').delete().eq('id', model.id));
  }
}
