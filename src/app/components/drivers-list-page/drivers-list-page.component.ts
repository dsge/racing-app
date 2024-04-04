import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { DriversListTableComponent } from '../drivers-list-table/drivers-list-table.component';
import { YearsService } from '../../services/years.service';

@Component({
  selector: 'app-drivers-list-page',
  standalone: true,
  imports: [TabViewModule, CommonModule, DriversListTableComponent],
  templateUrl: './drivers-list-page.component.html',
  styleUrl: './drivers-list-page.component.scss'
})
export class DriversListPageComponent {

  public tabs: {title: string, year: number}[];
  protected yearsService: YearsService = inject(YearsService);

  constructor() {
    this.tabs = this.yearsService.getYears().reverse().map((year: number) => ({ title: year + '', year: year }))
  }
}
