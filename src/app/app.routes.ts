import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RaceListPageComponent } from './components/race-list-page/race-list-page.component';
import { DriversListPageComponent } from './components/drivers-list-page/drivers-list-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
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
