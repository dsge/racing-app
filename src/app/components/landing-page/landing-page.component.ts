import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { from, take } from 'rxjs';
import { OAuthResponse } from '@supabase/supabase-js';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  protected apiService: ApiService = inject(ApiService);

  public async loginWithFacebook() {
    from(this.apiService.getSupabaseClient().auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        skipBrowserRedirect: true
      }
    })).pipe(take(1)).subscribe((results: OAuthResponse ) => {
      console.log('fb login results', results)
      if (results.data.url) {
        window.open(results.data.url, '_blank');
      }
    })
  }
}
