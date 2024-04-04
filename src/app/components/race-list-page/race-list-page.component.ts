import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceListItemComponent } from '../race-list-item/race-list-item.component';
import { CommonModule } from '@angular/common';
import { Race } from '../../models/race.model';
import { Observable, map, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';

@Component({
  selector: 'app-race-list-page',
  standalone: true,
  imports: [RaceListItemComponent, CommonModule, ButtonModule],
  templateUrl: './race-list-page.component.html',
  styleUrl: './race-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListPageComponent {
  public currentRaceModels$: Observable<Race[]>;
  public olderRaceModels$: Observable<Race[]>;
  public showOlderRaces: boolean = true;

  protected models$: Observable<Race[]> = of([
    {
      race_name: 'My Sample Race',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-02-05 20:10:10'
    },
    {
      race_name: 'My Other Sample Race',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-10-04 10:10:11'
    },
    {
      race_name: 'Lorem Ipsum Dolor',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-02-04 10:10:12'
    },
    {
      race_name: 'Sit Amet',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-02-04 10:10:13'
    },
    {
      race_name: 'Dolor Ipsum',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-10-04 10:10:13'
    },
    {
      race_name: 'Dolor Ipsum',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-10-04 10:10:13'
    },
    {
      race_name: 'Dolor Ipsum',
      drivers_from_year: 2024,
      race_end_date: '2024-02-07',
      race_start_date: '2024-02-06',
    },
    {
      race_name: 'Dolor Ipsum',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-04-04 10:10:13'
    }
  ]);

  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);

  constructor() {
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
}
