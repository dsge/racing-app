import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-results-page-contents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page-contents.component.html',
  styleUrl: './results-page-contents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPageContentsComponent {
  @Input() model: Race | null = null;

}
