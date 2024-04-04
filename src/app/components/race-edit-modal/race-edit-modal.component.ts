import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Race } from '../../models/race.model';
import { RaceService } from '../../services/race.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../services/toast.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Observable, take, tap, finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { YearsService } from '../../services/years.service';
import { SelectItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';



@Component({
  selector: 'app-race-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, DropdownModule, CalendarModule],
  templateUrl: './race-edit-modal.component.html',
  styleUrl: './race-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceEditModalComponent {
  public loading: boolean = false;
  public isNewModel: boolean = true;
  public yearOptions: SelectItem<number>[];
  protected data: {
    model: Race | null,
  };
  protected raceService: RaceService = inject(RaceService);
  protected dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected toastService: ToastService = inject(ToastService);
  protected yearsService: YearsService = inject(YearsService);

  constructor(dialogService: DialogService) {
    this.data = {...(dialogService.getInstance(this.dialogRef).data)};
    this.yearOptions = this.yearsService.getYears().map((year: number) => ({
      label: year + '',
      value: year
    }))
  }

  public ngOnInit(): void {
    if (!this.data.model) {
      this.data.model = {
        race_name: '',
        drivers_from_year: undefined as unknown as number,
        race_start_date: '',
        race_end_date: '',
        voting_end_time: '',
      };
      this.isNewModel = true;
    } else {
      this.isNewModel = false;
    }
  }

  public onSubmit(): void {
    let observable: Observable<PostgrestSingleResponse<null>>;
    if (this.isNewModel) {
      observable = this.raceService.createRace(this.data.model!)
    } else {
      observable = this.raceService.updateRace(this.data.model!)
    }
    observable.pipe(
      take(1),
      tap(() => { this.loading = true; }),
      finalize(() => { this.loading = false; })
    ).subscribe((res: PostgrestSingleResponse<null>) => {
      if (res.error) {
        this.toastService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: `Reason: ${res.error.message || 'Unknown'}`
        });
      } else {
        this.dialogRef.close({ success: true })
      }
    });
  }
}
