import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Driver } from '../../models/driver.model';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-vote-edit-input-row',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  templateUrl: './vote-edit-input-row.component.html',
  styleUrl: './vote-edit-input-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteEditInputRowComponent {
  @Output() valueChange: EventEmitter<Driver | null> = new EventEmitter<Driver | null>();
  @Input() value: Driver | null = null;
  @Input() dropdownOptions: SelectItem<Driver>[] | null = [];
  @Input() position: number | null = null;
}
