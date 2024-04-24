import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Race } from '../../models/race.model';
import { RaceListItemComponent } from '../race-list-item/race-list-item.component';
import { CommonModule } from '@angular/common';
import { RaceService } from '../../services/race.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-race-list-section',
  standalone: true,
  imports: [RaceListItemComponent, CommonModule],
  templateUrl: './race-list-section.component.html',
  styleUrl: './race-list-section.component.scss'
})
export class RaceListSectionComponent implements OnInit {
  @Output() itemsVisibleToggled: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modelEdit: EventEmitter<void> = new EventEmitter<void>();
  @Input() title: string = '';
  @Input() models: Race[] | null = null;
  @Input() itemsCanBeHidden: boolean = true;
  @Input() itemsVisibleByDefault: boolean = true;
  public itemsVisible: boolean = false;
  public raceService: RaceService = inject(RaceService);

  public ngOnInit(): void {
    if (this.itemsCanBeHidden) {
      this.setItemsVisibility(!!this.itemsVisibleByDefault);
    } else {
      this.setItemsVisibility(true);
    }
  }

  public toggleItemsVisible(event: Event): void {
    event.preventDefault();
    this.setItemsVisibility(!this.itemsVisible, true);
  }

  public hasVotingEnded(race: Race): boolean {
    return this.raceService.hasVotingEnded(race);
  }

  public hasUserVoted(race: Race): Observable<boolean> {
    return this.raceService.hasUserVoted(race);
  }

  public onModelEdit(): void {
    this.modelEdit.emit();
  }

  protected setItemsVisibility(value: boolean, emit: boolean = false): void {
    this.itemsVisible = value;
    if (emit) {
      this.itemsVisibleToggled.emit(value);
    }
  }
}
