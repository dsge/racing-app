import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { finalize, take } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

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

  protected userService: UserService = inject(UserService);
  protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected router: Router = inject(Router);
  protected toastService: ToastService = inject(ToastService);

  public loginWithEmail(): void {
    this.loading = true;
    this.userService.signInWithPassword({
      email: this.inputs.email,
      password: this.inputs.password,
    }).pipe(
      take(1),
      finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe((result: AuthTokenResponsePassword) => {
      if (!result.error) {
        // successful login
        this.router.navigate(['/races']);
      } else {
        // failed login
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login Failed'
        });
      }
    })
  }

  public signOut(): void {
    this.userService.signOut().pipe(take(1)).subscribe()
  }
}
