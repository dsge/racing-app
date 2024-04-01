import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Race } from '../../models/race.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-race-list-item',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './race-list-item.component.html',
  styleUrl: './race-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceListItemComponent {
  @Input() public model: Race | null = null;
}
