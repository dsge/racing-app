import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take, tap, finalize } from 'rxjs';
import { Race } from '../../models/race.model';
import { ToastService } from '../../services/toast.service';
import { YearsService } from '../../services/years.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { UserVoteService } from '../../services/user-vote.service';

@Component({
  selector: 'app-vote-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, DropdownModule],
  templateUrl: './vote-edit-modal.component.html',
  styleUrl: './vote-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteEditModalComponent {
  public loadingModels: boolean = false;
  public saving: boolean = false;
  public isNewModel: boolean = true;
  public yearOptions: SelectItem<number>[];
  protected data: {
    race: Race,
  };
  protected userVoteService: UserVoteService = inject(UserVoteService);
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

  public onSubmit(): void {
    this.userVoteService.setUserVotes(this.data.race!, []).pipe(
      take(1),
      tap(() => { this.saving = true; }),
      finalize(() => { this.saving = false; })
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
