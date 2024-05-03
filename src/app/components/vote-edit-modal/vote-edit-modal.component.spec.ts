import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteEditModalComponent } from './vote-edit-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DriverService } from '../../services/driver.service';
import { of } from 'rxjs';
import { UserVoteService } from '../../services/user-vote.service';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { ModalService } from '../../services/modal.service';

describe('VoteEditModalComponent', () => {
  let component: VoteEditModalComponent;
  let fixture: ComponentFixture<VoteEditModalComponent>;
  let driverService: DriverService;
  let userVoteService: UserVoteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteEditModalComponent],
      providers: [
        {
          provide: ModalService,
          useValue: {
            getInstance: jasmine
              .createSpy()
              .and.returnValue({ data: { race: { drivers_from_year: 1 } } }),
          },
        },
        {
          provide: DynamicDialogRef,
          useValue: jasmine.createSpyObj('', ['close']),
        },
        provideMockSupabaseClient(),
      ],
    }).compileComponents();

    driverService = TestBed.inject(DriverService);
    driverService.getDriversForYear = jasmine
      .createSpy()
      .and.returnValue(of([]));
    userVoteService = TestBed.inject(UserVoteService);
    userVoteService.getUserVotes = jasmine.createSpy().and.returnValue(of([]));

    fixture = TestBed.createComponent(VoteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
