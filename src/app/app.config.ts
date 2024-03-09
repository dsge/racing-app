import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
};

export const APP_SUPABASE_URL: string = 'https://xaduoizfbpolquwpmpbk.supabase.co';
export const APP_SUPABASE_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZHVvaXpmYnBvbHF1d3BtcGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzIyMjYsImV4cCI6MjAyNTI0ODIyNn0.RCKq4ycB4lCMwzjz6PvuONImyply89k3e9PwNlymQBI';
