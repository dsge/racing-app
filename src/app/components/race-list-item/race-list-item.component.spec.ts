import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListItemComponent } from './race-list-item.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { UserService } from '../../services/user.service';
import { of, take } from 'rxjs';
import { Race } from '../../models/race.model';
import { ModalService } from '../../services/modal.service';

describe('RaceListItemComponent', () => {
  let component: RaceListItemComponent;
  let fixture: ComponentFixture<RaceListItemComponent>;
  let userService: UserService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListItemComponent],
      providers: [provideMockSupabaseClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceListItemComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    modalService = TestBed.inject(ModalService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('currentUserIsModerator', () => {
    it('should return true', (done: DoneFn) => {
      userService.isModerator = jasmine.createSpy().and.returnValue(of(true));
      component
        .currentUserIsModerator()
        .pipe(take(1))
        .subscribe((isModerator: boolean) => {
          expect(isModerator).toBeTrue();
          done();
        });
    });
  });

  describe('getVotingEndTime', () => {
    it('should return a Date', () => {
      expect(
        component.getVotingEndTime({
          voting_end_time: '2015-10-10 10:10:10',
        } as Race)
      ).toEqual(jasmine.any(Date));
    });
  });

  describe('formatDistance', () => {
    it('should return 7 days ago', () => {
      expect(
        component.formatDistance(
          new Date('2015-10-10 10:10:10'),
          new Date('2015-10-17 10:10:10')
        )
      ).toBe('7 days ago');
    });

    it('should return a string', () => {
      expect(
        typeof component.formatDistance(new Date('2015-10-10 10:10:10'))
      ).toBe('string');
    });
  });

  describe('onEditRaceClick', () => {
    it('should call modalService.open', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(),
      });
      component.onEditRaceClick({} as Race);
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('onUserVoteAddButtonClick', () => {
    it('should call modalService.open', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(),
      });
      component.onUserVoteAddButtonClick({} as Race);
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('onUserVoteEditButtonClick', () => {
    it('should call modalService.open', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(),
      });
      component.onUserVoteEditButtonClick({} as Race);
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });
});
