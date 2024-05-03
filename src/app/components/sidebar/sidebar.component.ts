import { Component, inject } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Observable, combineLatest, map, of, switchMap, take } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public items$: Observable<MenuItem[]>;

  protected userService: UserService = inject(UserService);
  protected router: Router = inject(Router);

  constructor() {
    this.items$ = this.createMenuItems();
  }

  protected createMenuItems(): Observable<MenuItem[]> {
    return this.userService.getUser().pipe(
      map((user: User | null) => !!user),
      switchMap((isLoggedIn: boolean) =>
        combineLatest([of(isLoggedIn), this.userService.isModerator()])
      ),
      map(([isLoggedIn, isModerator]: [boolean, boolean]) => {
        return [
          {
            label: 'Landing Page',
            routerLink: ['/'],
            routerLinkActiveOptions: { exact: true },
            icon: PrimeIcons.HOME,
          },
          {
            label: 'Login Page',
            routerLink: ['/', 'login'],
            routerLinkActiveOptions: { exact: true },
            icon: PrimeIcons.SIGN_IN,
            visible: !isLoggedIn,
          },
          {
            label: 'Races List Page',
            routerLink: ['/', 'races'],
            routerLinkActiveOptions: { exact: true },
            visible: true,
            icon: PrimeIcons.CAR,
            disabled: !isLoggedIn,
          },
          {
            label: 'Drivers List Page',
            routerLink: ['/', 'drivers'],
            routerLinkActiveOptions: { exact: true },
            icon: PrimeIcons.USERS,
            visible: true,
            disabled: !isModerator,
          },
          {
            label: 'Logout',
            icon: PrimeIcons.SIGN_OUT,
            command: () => {
              this.onLogoutPressed();
            },
            visible: isLoggedIn,
          },
        ];
      })
    );
  }

  protected onLogoutPressed(): void {
    this.userService
      .signOut()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
