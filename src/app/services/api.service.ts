import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected supabaseClient?: SupabaseClient;

  public getSupabaseClient(): SupabaseClient {
    if (!this.supabaseClient) {
      this.supabaseClient = createClient(environment.APP_SUPABASE_URL, environment.APP_SUPABASE_KEY);
    }
    return this.supabaseClient;
  }
}
