import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RaceListItemComponent } from '../race-list-item/race-list-item.component';
import { CommonModule } from '@angular/common';
import { Race } from '../../models/race.model';
import { Observable, map, of } from 'rxjs';
import { isBefore } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';

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
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
      voting_end_time: '2024-03-04 10:10:13'
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

  constructor() {
    this.currentRaceModels$ = this.models$.pipe(
      map((models: Race[]) => models.filter((model: Race) => !this.calculateHasVotingEnded(model)))
    )
    this.olderRaceModels$ = this.models$.pipe(
      map((models: Race[]) => models.filter((model: Race) => this.calculateHasVotingEnded(model)))
    )
  }

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public toggleShowOlderRaces(event: Event): void {
    event.preventDefault();
    this.showOlderRaces = !this.showOlderRaces;
  }

  public hasVotingEnded(race: Race): Observable<boolean> {
    return of(this.calculateHasVotingEnded(race));
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return of(this.calculateHasUserVoted(race));
  }

  protected calculateHasUserVoted(race: Race): boolean {
    return Math.round((Math.random() * 1000)) % 2 == 0;
  }

  protected calculateHasVotingEnded(race: Race): boolean {
    return isBefore(new Date(race.voting_end_time || race.race_start_date), new Date());
  }
}
