import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Driver } from '../../models/driver.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DriverService } from '../../services/driver.service';
import { Observable, finalize, take, tap } from 'rxjs';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-driver-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule],
  templateUrl: './driver-edit-modal.component.html',
  styleUrl: './driver-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverEditModalComponent implements OnInit {
  public loading: boolean = false;
  public isNewModel: boolean = true;
  protected data?: {
    year: number | null;
    model: Driver | null;
  };
  protected driverService: DriverService = inject(DriverService);
  protected dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected toastService: ToastService = inject(ToastService);
  protected dialogService: ModalService = inject(ModalService);

  public ngOnInit(): void {
    this.data = {
      ...(this.dialogService.getInstance(this.dialogRef)?.data ?? {}),
    };
    if (this.data?.year && !this.data.model) {
      this.data.model = {
        full_name: '',
        year_of_racing: this.data.year,
      };
      this.isNewModel = true;
    } else {
      this.isNewModel = false;
    }
  }

  public onSubmit(): void {
    let observable: Observable<PostgrestSingleResponse<null>>;
    if (this.isNewModel) {
      observable = this.driverService.createDriver(this.data!.model!);
    } else {
      observable = this.driverService.updateDriver(this.data!.model!);
    }
    observable
      .pipe(
        take(1),
        tap(() => {
          this.loading = true;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((res: PostgrestSingleResponse<null>) => {
        if (res.error) {
          this.toastService.add({
            severity: 'error',
            summary: 'Save failed',
            detail: `Reason: ${res.error.message || 'Unknown'}`,
          });
        } else {
          this.dialogRef.close({ success: true });
        }
      });
  }
}
