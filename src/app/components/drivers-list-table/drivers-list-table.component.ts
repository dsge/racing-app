import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { DriverService } from '../../services/driver.service';
import { TableModule } from 'primeng/table';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  Observable,
  Subject,
  finalize,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Driver } from '../../models/driver.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DriverEditModalComponent } from '../driver-edit-modal/driver-edit-modal.component';
import { ModalService } from '../../services/modal.service';
import { AppConfirmationService } from '../../services/confirmation.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-drivers-list-table',
  standalone: true,
  imports: [TableModule, CommonModule, ConfirmPopupModule, ButtonModule],
  providers: [
    { provide: ConfirmationService, useExisting: AppConfirmationService },
  ],
  templateUrl: './drivers-list-table.component.html',
  styleUrl: './drivers-list-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversListTableComponent implements OnInit {
  @Input() public year: number | null = null;

  public drivers$: Observable<Driver[]> = of([]);
  public loading: boolean = false;

  protected driverService: DriverService = inject(DriverService);
  protected confirmationService: AppConfirmationService = inject(
    AppConfirmationService
  );
  protected modalService: ModalService = inject(ModalService);
  protected refreshTrigger: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    if (this.year) {
      this.drivers$ = this.refreshTrigger.pipe(
        startWith(null),
        tap(() => {
          this.loading = true;
        }),
        switchMap(() =>
          this.driverService.getDriversForYear(this.year!).pipe(
            take(1),
            finalize(() => {
              this.loading = false;
            })
          )
        )
      );
    }
  }

  public onDeleteDriverButtonClick(event: Event, driver: Driver): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.driverService
          .deleteDriver(driver)
          .pipe(
            take(1),
            tap(() => {
              this.loading = true;
            }),
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe(() => {
            this.refreshTrigger.next();
          });
      },
      reject: () => {},
    });
  }

  public onNewDriverButtonClick(): void {
    this.openDialog('Add new Driver');
  }

  public onEditDriverClick(driver: Driver): void {
    this.openDialog('Edit Driver', driver);
  }

  protected openDialog(headerText: string, driver?: Driver): void {
    const dialogRef: DynamicDialogRef = this.modalService.open(
      DriverEditModalComponent,
      {
        header: headerText,
        data: {
          year: this.year,
          model: driver,
        },
      }
    );
    dialogRef.onClose
      .pipe(
        take(1),
        finalize(() => {
          this.refreshTrigger.next();
        })
      )
      .subscribe();
  }
}
