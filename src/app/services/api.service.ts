import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.APP_SUPABASE_URL, environment.APP_SUPABASE_KEY);
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
