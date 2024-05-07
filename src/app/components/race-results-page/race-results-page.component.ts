import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  take,
  finalize,
  Observable,
  map,
  Subject,
  switchMap,
  BehaviorSubject,
  tap,
  startWith,
  shareReplay,
} from 'rxjs';
import { Race, RaceScoreScreenVotes } from '../../models/race.model';
import { VoteEditModalComponent } from '../vote-edit-modal/vote-edit-modal.component';
import { ActivatedRoute, Data } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';
import { BadgeModule } from 'primeng/badge';
import { RaceService } from '../../services/race.service';
import { ResultsPageContentsComponent } from '../results-page-contents/results-page-contents.component';
import { ScoreScreenService } from '../../services/score-screen.service';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-race-results-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BadgeModule,
    ResultsPageContentsComponent,
  ],
  templateUrl: './race-results-page.component.html',
  styleUrl: './race-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceResultsPageComponent {
  public race$: Observable<Race>;
  public raceScoreScreenVotes$: Observable<RaceScoreScreenVotes>;
  public drivers$: Observable<Driver[]>;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  protected dialogService: ModalService = inject(ModalService);
  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);
  protected driverService: DriverService = inject(DriverService);
  protected scoreScreenService: ScoreScreenService = inject(ScoreScreenService);
  protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected refreshTrigger$: Subject<void> = new Subject<void>();

  constructor() {
    this.race$ = this.refreshTrigger$.pipe(
      startWith(null),
      switchMap(() =>
        this.activatedRoute.data.pipe(map((data: Data) => data['race']))
      )
    );
    this.raceScoreScreenVotes$ = this.race$.pipe(
      tap(() => {
        this.loading$.next(true);
      }),
      switchMap((race: Race) =>
        this.scoreScreenService.getRaceScoreScreenVotes(race).pipe(
          take(1),
          finalize(() => {
            this.loading$.next(false);
          })
        )
      ),
      shareReplay(1)
    );
    this.drivers$ = this.race$.pipe(
      switchMap((race: Race) =>
        this.driverService.getDriversForYear(race.drivers_from_year)
      )
    );
  }

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public hasVotingEnded(race: Race, now: Date = new Date()): boolean {
    return this.raceService.hasVotingEnded(race, now);
  }

  public openEditFinalResultsDialog(model: Race): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(
      VoteEditModalComponent,
      {
        header: 'Edit Final Results',
        data: {
          race: model,
          editingFinalResults: true,
        },
      }
    );
    dialogRef.onClose
      .pipe(
        take(1),
        finalize(() => {
          this.refreshTrigger$.next();
        })
      )
      .subscribe();
  }
}
