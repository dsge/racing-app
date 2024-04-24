import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEditModalComponent } from './race-edit-modal.component';
import { provideMockApiService } from '../../services/testing/provide-mock-api.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('RaceEditModalComponent', () => {
  let component: RaceEditModalComponent;
  let fixture: ComponentFixture<RaceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceEditModalComponent],
      providers: [
        { provide: DialogService, useValue: { getInstance: jasmine.createSpy().and.returnValue({ data: {} }) } },
        { provide: DynamicDialogRef, useValue: jasmine.createSpyObj('', ['close']) },
        provideMockApiService()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
