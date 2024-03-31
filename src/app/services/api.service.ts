import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { APP_SUPABASE_URL, APP_SUPABASE_KEY } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY);
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
