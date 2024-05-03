import { InjectionToken } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT: InjectionToken<SupabaseClient> =
  new InjectionToken<SupabaseClient>('SupabaseClient');
