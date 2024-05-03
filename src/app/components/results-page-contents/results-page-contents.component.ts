import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Race, RaceScoreScreenVotes } from '../../models/race.model';
import { Observable, combineLatest, map } from 'rxjs';
import { UserVote, UserVoteRecord } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';
import { TableModule } from 'primeng/table';
import { UserVotesTableContents } from '../../models/results-page.model';
import {
  driverIdToDriver,
  raceAndScooreScreenVotesToUserVotesTableContents,
} from '../../utils/user-votes-table-contents.util';

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
    return driverIdToDriver(
      rows.find((row: UserVoteRecord) =>
        position !== 'fastest-lap'
          ? row.driver_final_position === position
          : row.is_fastest_lap_vote
      )?.driver_id,
      this.drivers
    );
  }

  protected createUserVotesTableContents(
    race$: Observable<Race>,
    raceScoreScreenVotes$: Observable<RaceScoreScreenVotes>
  ): Observable<UserVotesTableContents> {
    return combineLatest([race$, raceScoreScreenVotes$]).pipe(
      map(([race, raceScoreScreenVotes]: [Race, RaceScoreScreenVotes]) =>
        raceAndScooreScreenVotesToUserVotesTableContents(
          race,
          raceScoreScreenVotes,
          this.drivers
        )
      )
    );
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
