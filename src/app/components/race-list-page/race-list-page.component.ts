import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Race } from '../../models/race.model';
import { BehaviorSubject, Observable, Subject, finalize, startWith, switchMap, take } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';
import { RaceEditModalComponent } from '../race-edit-modal/race-edit-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RaceListSectionComponent } from '../race-list-section/race-list-section.component';
import { YearsService } from '../../services/years.service';

@Component({
  selector: 'app-race-list-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, RaceListSectionComponent],
  providers: [DialogService],
  templateUrl: './race-list-page.component.html',
  styleUrl: './race-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListPageComponent {
  /**
   * Race(s) that are currently happening
   */
  public ongoingRaceModels$: Observable<Race[]>;
  /**
   * All Races that will happen in the future
   */
  public upcomingRaceModels$: Observable<Race[]>;
  /**
   * Races that happened in the last 1 month
   */
  public recentRaceModels$: Observable<Race[]>;
  /**
   * Races that happened more than 1 month ago ( grouped by years )
   */
  protected olderRacesByYear: Record<number, Observable<Race[]>> = {};
  protected olderRacesByYearOpened: Record<number, Subject<void>> = {};

  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);
  protected dialogService: DialogService = inject(DialogService);
  protected yearsService: YearsService = inject(YearsService);
  protected years?: number[];
  protected refreshTrigger$: BehaviorSubject<null> = new BehaviorSubject<null>(null);

  constructor() {
    this.ongoingRaceModels$ = this.refreshTrigger$.pipe(
      switchMap(() => this.raceService.getOngoingRaces())
    );

    this.upcomingRaceModels$ = this.refreshTrigger$.pipe(
      switchMap(() => this.raceService.getUpcomingRaces())
    );

    this.recentRaceModels$ = this.refreshTrigger$.pipe(
      switchMap(() => this.raceService.getRecentRaces())
    );
  }
  /**
   * Races that happened during a particular year
   *
   * For the current year it returns only the Races that are older than 1 month
   */
  public getOlderRacesByYear(year: number): Observable<Race[]> {
    if (!this.olderRacesByYear[year]) {
      const openTrigger$: Subject<void> = new Subject();
      this.olderRacesByYearOpened[year] = openTrigger$;
      this.olderRacesByYear[year] = openTrigger$.pipe(
        take(1),
        switchMap(() => this.refreshTrigger$),
        switchMap(() => this.raceService.getRacesByYear(year)),
        startWith([])
      );
    }
    return this.olderRacesByYear[year];
  }

  public onOlderRacesItemsVisibleToggled(year: number): void {
    if (this.olderRacesByYearOpened[year]) {
      const openTrigger$: Subject<void> = this.olderRacesByYearOpened[year];
      openTrigger$.next();
    }
  }

  public getYears(): number[] {
    if (!this.years) {
      this.years = this.yearsService.getYearsDescending();
    }
    return this.years;
  }

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public onModelEdit(): void {
    this.refreshTrigger$.next(null);
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
    dialogRef.onClose.pipe(take(1), finalize(() => { this.refreshTrigger$.next(null) })).subscribe();
  }
}
