import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { from } from 'rxjs';
import { APP_SUPABASE_URL, APP_SUPABASE_KEY } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY);
    from(this.supabaseClient.from('races').select().returns<object>()).subscribe((value: unknown) => {
      console.log('races', value)
    })
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
