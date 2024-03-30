import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthError, AuthTokenResponsePassword } from '@supabase/supabase-js';
import { from, take } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  protected apiService: ApiService = inject(ApiService);

  public loginWithEmail(): void {
    from(this.apiService.getSupabaseClient().auth.signInWithPassword({
      email: 'asd@asd.asd',
      password: 'asdasd',
    })).pipe(take(1)).subscribe((results: AuthTokenResponsePassword ) => {
      console.log('login results', results)
    })
  }

  public signOut(): void {
    from(this.apiService.getSupabaseClient().auth.signOut())
    .pipe(take(1)).subscribe((results: {
      error: AuthError | null;
    }) => {
      console.log('login results', results)
    })
  }
}
