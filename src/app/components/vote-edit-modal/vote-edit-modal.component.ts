import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take, tap, finalize, Observable, shareReplay, map, combineLatest, BehaviorSubject, switchMap } from 'rxjs';
import { Race } from '../../models/race.model';
import { ToastService } from '../../services/toast.service';
import { YearsService } from '../../services/years.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UserVoteService } from '../../services/user-vote.service';
import { UserVote } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { VoteEditInputRowComponent } from '../vote-edit-input-row/vote-edit-input-row.component';

@Component({
  selector: 'app-vote-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, ProgressSpinnerModule, VoteEditInputRowComponent],
  templateUrl: './vote-edit-modal.component.html',
  styleUrl: './vote-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteEditModalComponent {
  public loadingCurrentUserVotes: boolean = true;
  public loadingPossibleDrivers: boolean = true;
  public loadingModels: boolean = true;
  public saving: boolean = false;
  public isNewModel: boolean = true;
  public yearOptions: SelectItem<number>[];

  public userVotes$: Observable<UserVote[]>;
  public possibleDrivers$: Observable<Driver[]>;
  public driverOptions$: Observable<SelectItem<Driver>[]>;


  protected data: {
    race: Race,
  };
  protected userVoteService: UserVoteService = inject(UserVoteService);
  protected dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected toastService: ToastService = inject(ToastService);
  protected yearsService: YearsService = inject(YearsService);
  protected driverService: DriverService = inject(DriverService);
  protected newUserVotes$: BehaviorSubject<UserVote[]> = new BehaviorSubject<UserVote[]>([]);

  constructor(dialogService: DialogService) {
    this.data = {...(dialogService.getInstance(this.dialogRef).data)};
    this.yearOptions = this.yearsService.getYears().map((year: number) => ({
      label: year + '',
      value: year
    }))

    this.userVotes$ = this.createUserVotes();
    this.possibleDrivers$ = this.driverService.getDriversForYear(this.data.race.drivers_from_year).pipe(
      take(1),
      tap(() => { this.loadingPossibleDrivers = false; }),
      shareReplay(1)
    );
    this.driverOptions$ = this.createDriverOptions(this.possibleDrivers$, this.userVotes$);
  }

  public getDriverVotedForPosition(position: number): Observable<Driver | null> {
    return this.userVotes$.pipe(
      map((votes: UserVote[]) => votes.find((vote: UserVote) => vote.driver_final_position === position)),
      map((vote: UserVote | undefined) => vote?.driver ?? null),
    )
  }

  public voteDriverForPosition(position: number, driver: Driver | null): void {
    if (!driver) {
      return;
    }
    const newVote: UserVote = {
      driver: driver,
      driver_final_position: position
    };
    const newUserVotes: UserVote[] = this.newUserVotes$.value.filter((oldVote: UserVote) => oldVote.driver_final_position !== position);
    newUserVotes.push(newVote);
    this.newUserVotes$.next(newUserVotes);
  }

  /**
   * returns a list of numbers starting from 1 up to the number of drivers ( max: 10 )
   */
  public getPositions(drivers: Driver[]): number[] {
    const numberOfPositions: number = drivers.length < 10 ? drivers.length: 10;
    return Array.from({length: numberOfPositions}, (_: unknown, i: number) => i + 1);
  }

  public onSubmit(): void {
    this.userVotes$.pipe(
      switchMap((userVotes: UserVote[]): Observable<PostgrestSingleResponse<unknown> | null> =>
        this.userVoteService.setUserVotes(this.data.race!, userVotes)
      ),
      take(1),
      tap(() => { this.saving = true; }),
      finalize(() => { this.saving = false; })
    ).subscribe((res: PostgrestSingleResponse<unknown> | null) => {
      if (res?.error) {
        this.toastService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: `Reason: ${res.error.message || 'Unknown'}`
        });
      } else {
        this.dialogRef.close({ success: true })
      }
    })
  }

  protected createUserVotes(): Observable<UserVote[]> {
    return combineLatest([
      this.userVoteService.getUserVotes(this.data.race).pipe(tap(() => { this.loadingCurrentUserVotes = false; })),
      this.newUserVotes$
    ]).pipe(
      map(([savedUserVotes, newUserVotes]: [UserVote[], UserVote[]]) => {
        const ret: UserVote[] = [];
        for (let driver_final_position: number = 1; driver_final_position <= 10; driver_final_position++) {
          const newVote: UserVote | undefined = newUserVotes.find((vote: UserVote) => vote.driver_final_position === driver_final_position);
          if (newVote) {
            ret.push(newVote);
          } else {
            const savedVote: UserVote | undefined = savedUserVotes.find((vote: UserVote) => vote.driver_final_position === driver_final_position)
            if (savedVote) {
              ret.push(savedVote);
            }
          }
        }
        return ret;
      }),
      shareReplay(1)
    );
  }

  protected createDriverOptions(possibleDrivers$: Observable<Driver[]>, userVotes$: Observable<UserVote[]>): Observable<SelectItem<Driver>[]> {
    return combineLatest([possibleDrivers$, userVotes$]).pipe(
      map(([drivers, userVotes]: [Driver[], UserVote[]]) => drivers.map((driver: Driver) => {
          return {
            label: driver.full_name,
            disabled: !!userVotes.find((userVote: UserVote) => userVote.driver.id === driver.id),
            value: driver
          } as SelectItem<Driver>
        }
      )

      )
    );
  }
}
