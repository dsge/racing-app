import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteEditFormComponent } from './vote-edit-form.component';
import { Driver } from '../../models/driver.model';
import { SelectItem } from 'primeng/api';

describe('VoteEditFormComponent', () => {
  let component: VoteEditFormComponent;
  let fixture: ComponentFixture<VoteEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteEditFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('getDriverVotedForPosition', () => {
    it('should return null for no matching driver', () => {
      component.userVotes = [];
      fixture.detectChanges();
      expect(component.getDriverVotedForPosition(5)).toBeNull();
    })

    it('should return the matching driver', () => {
      const mockDriver: Driver = {
        full_name: 'foo'
      } as Driver;
      component.userVotes = [{
        driver_final_position: 2,
        driver: {} as Driver
      }, {
        driver_final_position: 5,
        driver: mockDriver
      }];
      fixture.detectChanges();

      expect(component.getDriverVotedForPosition(5)).toEqual(mockDriver);
    })
  });

  describe('getDriverVotedForFastestLap', () => {
    it('should return null for no matching driver', () => {
      component.userVotes = [];
      fixture.detectChanges();
      expect(component.getDriverVotedForFastestLap()).toBeNull();
    })

    it('should return the matching driver', () => {
      const mockDriver: Driver = {
        full_name: 'foo'
      } as Driver;
      component.userVotes = [{
        driver_final_position: 2,
        driver: {} as Driver
      }, {
        driver_final_position: 5,
        is_fastest_lap_vote: true,
        driver: mockDriver
      }];
      fixture.detectChanges();

      expect(component.getDriverVotedForFastestLap()).toEqual(mockDriver);
    })
  });

  describe('voteDriverForPosition', () => {
    it('should not emit a new vote when driver is missing', () => {
      component.newVote.emit = jasmine.createSpy();
      component.voteDriverForPosition(5, null);
      expect(component.newVote.emit).not.toHaveBeenCalled();
    })
    it('should emit a new vote', () => {
      component.newVote.emit = jasmine.createSpy();
      component.voteDriverForPosition(5, {} as Driver);
      expect(component.newVote.emit).toHaveBeenCalledTimes(1);
    })
  });

  describe('voteDriverForFastestLap', () => {
    it('should not emit a new vote when driver is missing', () => {
      component.newVote.emit = jasmine.createSpy();
      component.voteDriverForFastestLap(null);
      expect(component.newVote.emit).not.toHaveBeenCalled();
    })
    it('should emit a new vote', () => {
      component.newVote.emit = jasmine.createSpy();
      component.voteDriverForFastestLap({} as Driver);
      expect(component.newVote.emit).toHaveBeenCalledTimes(1);
    })
  });

  describe('onSubmitButtonClick', () => {
    it('should emit', () => {
      component.formSubmit.emit = jasmine.createSpy();
      component.onSubmitButtonClick();
      expect(component.formSubmit.emit).toHaveBeenCalledTimes(1);
    })
  });

  describe('getPositions', () => {
    it('should return a list of 5 when there are 5 allDriverOptions', () => {
      component.allDriverOptions = [{}, {}, {}, {}, {}] as SelectItem<Driver>[];
      fixture.detectChanges();
      expect(component.getPositions()).toEqual([1, 2, 3, 4, 5]);
    })

    it('should return a list of 10 when there are 10+ allDriverOptions', () => {
      component.allDriverOptions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] as SelectItem<Driver>[];
      fixture.detectChanges();
      expect(component.getPositions()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    })
  });
});
