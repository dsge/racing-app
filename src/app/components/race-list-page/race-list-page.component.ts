import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RaceListItemComponent } from '../race-list-item/race-list-item.component';
import { CommonModule } from '@angular/common';
import { Race } from '../../models/race.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-race-list-page',
  standalone: true,
  imports: [RaceListItemComponent, CommonModule],
  templateUrl: './race-list-page.component.html',
  styleUrl: './race-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListPageComponent {
  public models$: Observable<Race[]> = of([
    {
      race_name: 'foo',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
    },
    {
      race_name: 'bar',
      drivers_from_year: 2024,
      race_end_date: '2024-10-05',
      race_start_date: '2024-10-06',
    }
  ]);
}
