import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Race } from '../../models/race.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';


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
  @Input() public currentUserVoted: boolean | null = false;
  @Input() public votingEnded: boolean | null = true;

  protected userService: UserService = inject(UserService);
  protected raceService: RaceService = inject(RaceService);

  public currentUserIsModerator(): Observable<boolean> {
    return this.userService.isModerator();
  }

  public getVotingEndTime(race: Race): Date {
    return this.raceService.getVotingEndTime(race);
  }
}
