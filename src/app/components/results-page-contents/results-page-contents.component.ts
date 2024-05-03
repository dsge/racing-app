import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Race,
  RaceScoreScreenVote,
  RaceScoreScreenVotes,
} from '../../models/race.model';
import { Observable, combineLatest, map } from 'rxjs';
import { UserVote, UserVoteRecord } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';
import { TableModule } from 'primeng/table';
import {
  UserVotesTableContents,
  VoteTableColumn,
  VoteTableRow,
} from '../../models/results-page.model';

@Component({
  selector: 'app-results-page-contents',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './results-page-contents.component.html',
  styleUrl: './results-page-contents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsPageContentsComponent implements OnInit {
  @Input() race$: Observable<Race> | null = null;
  @Input() raceScoreScreenVotes$: Observable<RaceScoreScreenVotes> | null =
    null;
  @Input() drivers: Driver[] = [];

  /**
   * "Final Results" table data
   */
  public raceFinalResults$!: Observable<UserVote[] | undefined>;
  /**
   * "User Votes" table data
   */
  public userVotesTableContents$!: Observable<UserVotesTableContents>;

  public ngOnInit(): void {
    if (!this.race$ || !this.raceScoreScreenVotes$) {
      return;
    }
    this.raceFinalResults$ = this.raceScoreScreenVotes$.pipe(
      map((raceScoreScreenVotes: RaceScoreScreenVotes) =>
        raceScoreScreenVotes.raceFinalResults?.length
          ? raceScoreScreenVotes.raceFinalResults
          : undefined
      ),
      map((finalResults: UserVote[] | undefined) =>
        finalResults?.sort((a: UserVote, b: UserVote) =>
          this.sortByFinalPosition(a, b)
        )
      )
    );

    this.userVotesTableContents$ = this.createUserVotesTableContents(
      this.race$,
      this.raceScoreScreenVotes$
    );
  }

  public getDriverForPosition(
    position: number | 'fastest-lap',
    rows: UserVoteRecord[]
  ): Driver | undefined {
    return this.driverIdToDriver(
      rows.find((row: UserVoteRecord) =>
        position !== 'fastest-lap'
          ? row.driver_final_position === position
          : row.is_fastest_lap_vote
      )?.driver_id
    );
  }

  public isCorrectVote(
    position: number | 'fastest-lap',
    driver: Driver | undefined,
    raceFinalResults?: UserVote[] | null
  ): boolean {
    if (!driver || !raceFinalResults) {
      return false;
    }
    return !!raceFinalResults.find(
      (userVote: UserVote) =>
        userVote.driver.id === driver.id &&
        (position !== 'fastest-lap'
          ? userVote.driver_final_position === position
          : userVote.is_fastest_lap_vote)
    );
  }

  /**
   * returns a list of numbers starting from 1 up to `numberOfPositions`
   */
  protected calculatePositions(numberOfPositions: number): number[] {
    return Array.from(
      { length: numberOfPositions },
      (_: unknown, i: number) => i + 1
    );
  }

  protected createUserVotesTableContents(
    race$: Observable<Race>,
    raceScoreScreenVotes$: Observable<RaceScoreScreenVotes>
  ): Observable<UserVotesTableContents> {
    return combineLatest([race$, raceScoreScreenVotes$]).pipe(
      map(([race, raceScoreScreenVotes]: [Race, RaceScoreScreenVotes]) => ({
        race: race,
        tableColumns: this.raceToTableColumns(race),
        tableRows: this.getTableRows(
          raceScoreScreenVotes,
          this.raceToTableColumns(race)
        ),
      }))
    );
  }

  protected raceToTableColumns(race: Race): VoteTableColumn[] {
    if (race.is_sprint_race) {
      return this.calculatePositions(8).map((position: number) => ({
        title: `${position}`,
        driver_position_to_display: position,
      }));
    } else {
      const ret: VoteTableColumn[] = this.calculatePositions(10).map(
        (position: number) => ({
          title: `${position}`,
          driver_position_to_display: position,
        })
      );
      ret.push({
        title: 'Fastest Lap',
        is_fastest_lap_column: true,
      });
      return ret;
    }
  }

  protected getTableRows(
    raceScoreScreenVotes: RaceScoreScreenVotes,
    tableColumns: VoteTableColumn[]
  ): VoteTableRow[] {
    const finalResults: UserVote[] | undefined =
      raceScoreScreenVotes.raceFinalResults;
    const haveFinalResults: boolean = !!finalResults?.length;
    return raceScoreScreenVotes.userVotes.map(
      (rowData: RaceScoreScreenVote) => {
        return {
          user: rowData.user,
          votes: tableColumns.map((tableColumn: VoteTableColumn) => {
            const voteRecord: UserVoteRecord | undefined = rowData.votes.find(
              (record: UserVoteRecord) => {
                if (tableColumn.is_fastest_lap_column) {
                  return record.is_fastest_lap_vote === true;
                } else {
                  return (
                    record.driver_final_position ===
                    tableColumn.driver_position_to_display
                  );
                }
              }
            );
            if (!voteRecord) {
              return null;
            }
            const driver: Driver | undefined = this.driverIdToDriver(
              voteRecord.driver_id
            );
            const correct: boolean =
              haveFinalResults &&
              this.isCorrectVote(
                voteRecord.driver_final_position ?? -2,
                driver,
                finalResults
              );

            return {
              vote: voteRecord,
              driver: driver,
              correct: haveFinalResults && correct,
              incorrect: haveFinalResults && !correct,
              unknown: !haveFinalResults,
            };
          }),
        };
      }
    );
  }

  protected driverIdToDriver(
    driver_id: number | undefined
  ): Driver | undefined {
    return this.drivers.find((driver: Driver) => driver.id === driver_id);
  }

  protected sortByFinalPosition(a: UserVote, b: UserVote): number {
    if (a.is_fastest_lap_vote) {
      return 1;
    }
    return a.driver_final_position! > b.driver_final_position!
      ? 1
      : a.driver_final_position! < b.driver_final_position!
      ? -1
      : 0;
  }
}
