import { Injectable, inject } from '@angular/core';
import { Driver } from '../models/driver.model';
import { Observable, from, map } from 'rxjs';
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  protected readonly supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT);

  public getDriversForYear(year: number): Observable<Driver[]> {
    return from(this.supabaseClient.from('drivers').select().match({'year_of_racing': year + ''}).returns<Driver[]>())
      .pipe(
        map((res: { data: Driver[] | null }) => res.data ?? [])
      )
  }

  public getDriverById(id: number): Observable<Driver | undefined> {
    return from(this.supabaseClient.from('drivers').select().match({'id': id}).returns<Driver[]>())
      .pipe(
        map((res: { data: Driver[] | null }) => res.data?.[0] ?? undefined)
      )
  }

  public createDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('drivers').insert(model));
  }

  public updateDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('drivers').update(model).eq('id', model.id));
  }

  public deleteDriver(model: Driver): Observable<PostgrestSingleResponse<null>> {
    return from(this.supabaseClient.from('drivers').delete().eq('id', model.id));
  }
}
