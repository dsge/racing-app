import { Component, inject } from '@angular/core';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-drivers-list-page',
  standalone: true,
  imports: [],
  templateUrl: './drivers-list-page.component.html',
  styleUrl: './drivers-list-page.component.scss'
})
export class DriversListPageComponent {

  protected driverService: DriverService = inject(DriverService);

  constructor() {
    console.log('years', this.driverService.getYears());
  }
}
