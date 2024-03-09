import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public items: MenuItem[] = [
    {
      label: 'Landing Page',
      routerLink: '/'
    },
    {
      label: 'Races List Page',
      routerLink: '/races'
    },
    {
      label: 'Drivers List Page',
      routerLink: '/drivers'
    }
  ];
}
