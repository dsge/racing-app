import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { SUPABASE_CLIENT } from './tokens/supabase-client';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: SUPABASE_CLIENT,
      useFactory: (): SupabaseClient => createClient(environment.APP_SUPABASE_URL, environment.APP_SUPABASE_KEY)
    }
  ]
};
