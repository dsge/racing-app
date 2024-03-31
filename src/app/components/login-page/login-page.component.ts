import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthError } from '@supabase/supabase-js';
import { finalize, take } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CardModule, FormsModule, ButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  public inputs: {
    email: string,
    password: string
  } = {
      email: '',
      password: ''
    };
  public loading: boolean = false;

  protected apiService: ApiService = inject(ApiService);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected router: Router = inject(Router);

  public loginWithEmail(): void {
    this.loading = true;
    this.apiService.signInWithPassword({
      email: this.inputs.email,
      password: this.inputs.password,
    }).pipe(
      take(1),
      finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe(() => {
      this.router.navigate(['/races']);
    })
  }

  public signOut(): void {
    this.apiService.signOut()
      .pipe(take(1)).subscribe((results: {
        error: AuthError | null;
      }) => {
        console.log('results', results)
      })
  }
}
