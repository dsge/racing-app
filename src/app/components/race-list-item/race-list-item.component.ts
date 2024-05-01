import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Race } from '../../models/race.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Observable, finalize, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';
import { RaceEditModalComponent } from '../race-edit-modal/race-edit-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { formatDistance } from 'date-fns';
import { RouterModule } from '@angular/router';
import { VoteEditModalComponent } from '../vote-edit-modal/vote-edit-modal.component';
import { BadgeModule } from 'primeng/badge';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-race-list-item',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule, BadgeModule],
  templateUrl: './race-list-item.component.html',
  styleUrl: './race-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListItemComponent {
  @Output() public modelEdit: EventEmitter<Race | null> = new EventEmitter<Race | null>();
  @Input() public model: Race | null = null;
  @Input() public currentUserVoted: boolean | null = false;
  @Input() public votingEnded: boolean | null = true;

  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);
  protected dialogService: ModalService = inject(ModalService);

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public getVotingEndTime(race: Race): Date {
    return this.raceService.getVotingEndTime(race);
  }

  public formatDistance(date: Date): string {
    return formatDistance(date, new Date(), {
      addSuffix: true
    });
  }

  public onEditRaceClick(model: Race): void {
    this.openRaceEditDialog('Edit Race', model);
  }

  public onUserVoteAddButtonClick(model: Race): void {
    this.openUserVoteEditDialog('Add Votes', model);
  }

  public onUserVoteEditButtonClick(model: Race): void {
    this.openUserVoteEditDialog('Edit Votes', model);
  }

  protected openRaceEditDialog(headerText: string = '', model?: Race): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(
      RaceEditModalComponent,
      {
        header: headerText,
        data: {
          model: model
        }
      }
    );
    dialogRef.onClose.pipe(take(1), finalize(() => { this.modelEdit.emit(model ?? null) })).subscribe();
  }

  protected openUserVoteEditDialog(headerText: string = '', model?: Race): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(
      VoteEditModalComponent,
      {
        header: headerText,
        data: {
          race: model
        }
      }
    );
    dialogRef.onClose.pipe(take(1), finalize(() => { this.modelEdit.emit(model ?? null) })).subscribe();
  }
}
