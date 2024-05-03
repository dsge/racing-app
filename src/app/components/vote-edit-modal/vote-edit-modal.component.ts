import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  take,
  tap,
  finalize,
  Observable,
  shareReplay,
  map,
  combineLatest,
  BehaviorSubject,
  switchMap,
} from 'rxjs';
import { Race } from '../../models/race.model';
import { ToastService } from '../../services/toast.service';
import { YearsService } from '../../services/years.service';
import { CommonModule } from '@angular/common';
import { UserVoteService } from '../../services/user-vote.service';
import { UserVote } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VoteEditFormComponent } from '../vote-edit-form/vote-edit-form.component';
import { RaceService } from '../../services/race.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-vote-edit-modal',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, VoteEditFormComponent],
  templateUrl: './vote-edit-modal.component.html',
  styleUrl: './vote-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteEditModalComponent {
  public loadingCurrentUserVotes: boolean = true;
  public loadingPossibleDrivers: boolean = true;
  public saving: boolean = false;
  /**
   * All the currently displayed User Votes ( note: also contains unsaved votes after the user edited the form )
   */
  public userVotes$: Observable<UserVote[]>;
  /**
   * The Drivers the user can vote for ( the ones that have a vote ARE disabled )
   */
  public filteredDriverOptions$: Observable<SelectItem<Driver>[]>;
  /**
   * The Drivers the user can vote for ( the ones that have a vote ARE NOT disabled )
   */
  public allDriverOptions$: Observable<SelectItem<Driver>[]>;

  protected data: {
    race: Race;
    editingFinalResults: boolean;
  };
  protected userVoteService: UserVoteService = inject(UserVoteService);
  protected dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected toastService: ToastService = inject(ToastService);
  protected yearsService: YearsService = inject(YearsService);
  protected driverService: DriverService = inject(DriverService);
  protected raceService: RaceService = inject(RaceService);
  protected newUserVotes$: BehaviorSubject<UserVote[]> = new BehaviorSubject<
    UserVote[]
  >([]);

  constructor(dialogService: ModalService) {
    this.data = { ...dialogService.getInstance(this.dialogRef).data };

    this.userVotes$ = this.createUserVotes();
    const possibleDrivers$: Observable<Driver[]> = this.driverService
      .getDriversForYear(this.data.race.drivers_from_year)
      .pipe(
        take(1),
        tap(() => {
          this.loadingPossibleDrivers = false;
        }),
        shareReplay(1)
      );
    this.filteredDriverOptions$ = this.createFilteredDriverOptions(
      possibleDrivers$,
      this.userVotes$
    );
    this.allDriverOptions$ = this.createAllDriverOptions(possibleDrivers$);
  }

  public editingFinalResults(): boolean {
    return !!this.data?.editingFinalResults;
  }

  public onSubmit(): void {
    this.userVotes$
      .pipe(
        switchMap(
          (
            userVotes: UserVote[]
          ): Observable<PostgrestSingleResponse<unknown> | null> => {
            if (this.editingFinalResults()) {
              return this.raceService.setRaceFinalResults(
                this.data.race!,
                userVotes
              );
            } else {
              return this.userVoteService.setUserVotes(
                this.data.race!,
                userVotes
              );
            }
          }
        ),
        take(1),
        tap(() => {
          this.saving = true;
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((res: PostgrestSingleResponse<unknown> | null) => {
        if (res?.error) {
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

  public onNewVote(newVote: UserVote): void {
    let newUserVotes: UserVote[];
    if (newVote.is_fastest_lap_vote) {
      newUserVotes = this.newUserVotes$.value.filter(
        (oldVote: UserVote) => oldVote.is_fastest_lap_vote !== true
      );
    } else {
      newUserVotes = this.newUserVotes$.value.filter(
        (oldVote: UserVote) =>
          oldVote.driver_final_position !== newVote.driver_final_position
      );
    }
    newUserVotes.push(newVote);
    this.newUserVotes$.next(newUserVotes);
  }

  protected createUserVotes(): Observable<UserVote[]> {
    let savedVotesToEdit$: Observable<UserVote[]>;
    if (this.editingFinalResults()) {
      savedVotesToEdit$ = this.raceService.getRaceFinalResults(this.data.race);
    } else {
      savedVotesToEdit$ = this.userVoteService.getUserVotes(this.data.race);
    }

    return combineLatest([
      savedVotesToEdit$.pipe(
        tap(() => {
          this.loadingCurrentUserVotes = false;
        })
      ),
      this.newUserVotes$,
    ]).pipe(
      map(([savedUserVotes, newUserVotes]: [UserVote[], UserVote[]]) => {
        const votesToDisplay: UserVote[] = [];
        for (
          let driver_final_position: number = 1;
          driver_final_position <= 10;
          driver_final_position++
        ) {
          const vote: UserVote | undefined =
            this.findNormalVoteToDisplayByPosition(
              newUserVotes,
              savedUserVotes,
              driver_final_position
            );
          if (vote) {
            votesToDisplay.push(vote);
          }
        }
        const fastestLapVote: UserVote | undefined =
          this.findFastestLapVoteTiDisplay(newUserVotes, savedUserVotes);
        if (fastestLapVote) {
          votesToDisplay.push(fastestLapVote);
        }
        return votesToDisplay;
      }),
      shareReplay(1)
    );
  }

  protected findNormalVoteToDisplayByPosition(
    newVotes: UserVote[],
    oldVotes: UserVote[],
    driver_final_position: number
  ): UserVote | undefined {
    return (
      newVotes.find(
        (vote: UserVote) =>
          vote.driver_final_position === driver_final_position &&
          vote.is_fastest_lap_vote != true
      ) ||
      oldVotes.find(
        (vote: UserVote) =>
          vote.driver_final_position === driver_final_position &&
          vote.is_fastest_lap_vote != true
      )
    );
  }

  protected findFastestLapVoteTiDisplay(
    newVotes: UserVote[],
    oldVotes: UserVote[]
  ): UserVote | undefined {
    return (
      newVotes.find((vote: UserVote) => vote.is_fastest_lap_vote === true) ||
      oldVotes.find((vote: UserVote) => vote.is_fastest_lap_vote === true)
    );
  }

  protected createFilteredDriverOptions(
    possibleDrivers$: Observable<Driver[]>,
    userVotes$: Observable<UserVote[]>
  ): Observable<SelectItem<Driver>[]> {
    return combineLatest([possibleDrivers$, userVotes$]).pipe(
      map(([drivers, userVotes]: [Driver[], UserVote[]]) =>
        drivers.map(
          (driver: Driver) =>
            ({
              label: driver.full_name,
              disabled: !!userVotes.find(
                (userVote: UserVote) => userVote.driver.id === driver.id
              ),
              value: driver,
            } as SelectItem<Driver>)
        )
      )
    );
  }

  protected createAllDriverOptions(
    possibleDrivers$: Observable<Driver[]>
  ): Observable<SelectItem<Driver>[]> {
    return possibleDrivers$.pipe(
      map((drivers: Driver[]) =>
        drivers.map(
          (driver: Driver) =>
            ({
              label: driver.full_name,
              disabled: false,
              value: driver,
            } as SelectItem<Driver>)
        )
      )
    );
  }
}
