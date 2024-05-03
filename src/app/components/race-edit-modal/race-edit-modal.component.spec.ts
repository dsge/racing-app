import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEditModalComponent } from './race-edit-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { ModalService } from '../../services/modal.service';

describe('RaceEditModalComponent', () => {
  let component: RaceEditModalComponent;
  let fixture: ComponentFixture<RaceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceEditModalComponent],
      providers: [
        {
          provide: ModalService,
          useValue: {
            getInstance: jasmine.createSpy().and.returnValue({ data: {} }),
          },
        },
        {
          provide: DynamicDialogRef,
          useValue: jasmine.createSpyObj('', ['close']),
        },
        provideMockSupabaseClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
