import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { TableModule } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Observable, finalize, of, take, tap } from 'rxjs';
import { Driver } from '../../models/driver.model';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-drivers-list-table',
  standalone: true,
  imports: [TableModule, CommonModule, ConfirmPopupModule, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './drivers-list-table.component.html',
  styleUrl: './drivers-list-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriversListTableComponent implements OnInit {
  @Input() public year: number | null = null;

  public drivers$: Observable<Driver[]> = of([]);
  public loading: boolean = false;

  protected driverService: DriverService = inject(DriverService);
  protected confirmationService: ConfirmationService = inject(ConfirmationService);

  public ngOnInit(): void {
    if (this.year) {
      this.drivers$ = this.driverService.getDriversForYear(this.year)
        .pipe(
          take(1),
          tap(() => {
            this.loading = true;
          }),
          finalize(() => {
            this.loading = false;
          })
        );
    }
  }

  public confirm2(event: Event): void {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

        },
        reject: () => {

        }
    });
}
}
