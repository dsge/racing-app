import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceListItemComponent } from '../race-list-item/race-list-item.component';
import { CommonModule } from '@angular/common';
import { Race } from '../../models/race.model';
import { Observable, Subject, finalize, map, startWith, switchMap, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';
import { RaceEditModalComponent } from '../race-edit-modal/race-edit-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-race-list-page',
  standalone: true,
  imports: [RaceListItemComponent, CommonModule, ButtonModule],
  providers: [DialogService],
  templateUrl: './race-list-page.component.html',
  styleUrl: './race-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListPageComponent {
  public currentRaceModels$: Observable<Race[]>;
  public olderRaceModels$: Observable<Race[]>;
  public showOlderRaces: boolean = true;

  protected models$: Observable<Race[]>;

  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);
  protected dialogService: DialogService = inject(DialogService);
  protected refreshTrigger$: Subject<void> = new Subject<void>();

  constructor() {
    this.models$ = this.refreshTrigger$.pipe(
      startWith(null),
      switchMap(() => this.raceService.getRaces())
    );
    this.currentRaceModels$ = this.models$.pipe(
      map((models: Race[]) => models.filter((model: Race) => !this.raceService.hasVotingEnded(model)))
    )
    this.olderRaceModels$ = this.models$.pipe(
      map((models: Race[]) => models.filter((model: Race) => this.raceService.hasVotingEnded(model)))
    )

  }

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public toggleShowOlderRaces(event: Event): void {
    event.preventDefault();
    this.showOlderRaces = !this.showOlderRaces;
  }

  public hasVotingEnded(race: Race): boolean {
    return this.raceService.hasVotingEnded(race);
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return this.raceService.hasUserVoted(race);
  }

  public onModelEdit(): void {
    this.refreshTrigger$.next();
  }

  public onNewRaceButtonClick(): void {
    this.openDialog('Add new Race');
  }

  protected openDialog(headerText: string = '', model?: Race): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(
      RaceEditModalComponent,
      {
        header: headerText,
        data: {
          model: model
        }
      }
    );
    dialogRef.onClose.pipe(take(1), finalize(() => { this.refreshTrigger$.next() })).subscribe();
  }
}
