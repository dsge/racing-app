import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ApiService } from '../../services/api.service';
import { Observable, map, take } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public items$: Observable<MenuItem[]>;

  protected apiService: ApiService = inject(ApiService);
  protected router: Router = inject(Router);

  constructor() {
    this.items$ = this.createMenuItems();
  }

  protected createMenuItems(): Observable<MenuItem[]> {
    return this.apiService.getUser().pipe(
      map((user: User | null) => !!user),
      map((isLoggedIn: boolean) => {
        return [
          {
            label: 'Landing Page',
            routerLink: '/',
          },{
            label: 'Login Page',
            routerLink: '/login',
            visible: !isLoggedIn
          },
          {
            label: 'Races List Page',
            routerLink: '/races',
            visible: true,
            disabled: !isLoggedIn
          },
          {
            label: 'Drivers List Page',
            routerLink: '/drivers',
            visible: true,
            disabled: !isLoggedIn
          },
          {
            label: 'Logout',
            command: () => {
              this.onLogoutPressed();
            },
            visible: isLoggedIn
          }
        ];
      })
    );
  }

  protected onLogoutPressed(): void {
    this.apiService.signOut().pipe(take(1)).subscribe(() => {
      this.router.navigate(['/login']);
    })
  }
}
