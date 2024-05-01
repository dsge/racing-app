import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { take, finalize, Observable, map, Subject } from 'rxjs';
import { Race } from '../../models/race.model';
import { VoteEditModalComponent } from '../vote-edit-modal/vote-edit-modal.component';
import { ActivatedRoute, Data } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-race-results-page',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './race-results-page.component.html',
  styleUrl: './race-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceResultsPageComponent {

  public model$: Observable<Race>;
  protected dialogService: ModalService = inject(ModalService);
  protected userService: UserService = inject(UserService);
  protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected refreshTrigger$: Subject<void> = new Subject<void>();

  constructor() {
    this.model$ = this.activatedRoute.data.pipe(map((data: Data) => data['race']));
  }

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public openEditFinalResultsDialog(model: Race): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(
      VoteEditModalComponent,
      {
        header: 'Edit Final Results',
        data: {
          race: model,
          editingFinalResults: true
        }
      }
    );
    dialogRef.onClose.pipe(take(1), finalize(() => { this.refreshTrigger$.next() })).subscribe();
  }
}
