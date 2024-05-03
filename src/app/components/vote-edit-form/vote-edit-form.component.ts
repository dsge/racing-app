import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserVote } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { VoteEditInputRowComponent } from '../vote-edit-input-row/vote-edit-input-row.component';

@Component({
  selector: 'app-vote-edit-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonModule, VoteEditInputRowComponent],
  templateUrl: './vote-edit-form.component.html',
  styleUrl: './vote-edit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteEditFormComponent {
  @Output() newVote: EventEmitter<UserVote> = new EventEmitter<UserVote>();
  @Output() formSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Input() userVotes: UserVote[] | null = null;
  @Input() allDriverOptions: SelectItem<Driver>[] | null = null;
  @Input() filteredDriverOptions: SelectItem<Driver>[] | null = null;
  @Input() saving: boolean = false;
  @Input() is_sprint_race: boolean = false;

  public getDriverVotedForPosition(position: number): Driver | null {
    const vote: UserVote | undefined = this.userVotes?.find((vote: UserVote) => vote.driver_final_position === position);
    return vote?.driver ?? null;
  }

  public getDriverVotedForFastestLap(): Driver | null {
    const vote: UserVote | undefined = this.userVotes?.find((vote: UserVote) => vote.is_fastest_lap_vote === true);
    return vote?.driver ?? null;
  }

  public voteDriverForPosition(position: number, driver: Driver | null): void {
    if (driver) {
      return this.emitNewVote({
        driver: driver,
        driver_final_position: position
      });
    }
  }

  public voteDriverForFastestLap(driver: Driver | null): void {
    if (driver) {
      return this.emitNewVote({
        driver: driver,
        is_fastest_lap_vote: true
      });
    }
  }

  /**
   * returns a list of numbers starting from 1 up to the number of drivers ( max: 10 for normal races, 8 for sprint races )
   */
  public getPositions(): number[] {
    const maxPositions: number = this.is_sprint_race ? 8 : 10;
    const numberOfPositions: number = (this.allDriverOptions ?? []).length < maxPositions ? (this.allDriverOptions ?? []).length: maxPositions;
    return Array.from({length: numberOfPositions}, (_: unknown, i: number) => i + 1);
  }

  public onSubmitButtonClick(): void {
    this.formSubmit.emit();
  }

  protected emitNewVote(newVote: UserVote): void {
    this.newVote.emit(newVote)
  }
}
