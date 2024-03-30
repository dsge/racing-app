import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RaceListPageComponent } from './components/race-list-page/race-list-page.component';
import { DriversListPageComponent } from './components/drivers-list-page/drivers-list-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'races',
    component: RaceListPageComponent
  },
  {
    path: 'drivers',
    component: DriversListPageComponent
  }
];
