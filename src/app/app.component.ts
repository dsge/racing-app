import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { APP_SUPABASE_KEY, APP_SUPABASE_URL } from './app.config';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'racing-app';

  constructor() {
    const supabase: SupabaseClient = createClient(APP_SUPABASE_URL, APP_SUPABASE_KEY);
    from(supabase.from('races').select().returns<object>()).subscribe((value: unknown) => {
      console.log('races', value)
    })
  }
}
