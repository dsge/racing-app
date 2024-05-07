import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListPageComponent } from './race-list-page.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { RaceService } from '../../services/race.service';
import { of, skip, take } from 'rxjs';
import { Race } from '../../models/race.model';
import { ModalService } from '../../services/modal.service';

describe('RaceListPageComponent', () => {
  let component: RaceListPageComponent;
  let fixture: ComponentFixture<RaceListPageComponent>;
  let raceService: RaceService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListPageComponent],
      providers: [provideMockSupabaseClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceListPageComponent);
    component = fixture.componentInstance;
    raceService = TestBed.inject(RaceService);
    modalService = TestBed.inject(ModalService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('getOlderRacesByYear', () => {
    it('should return an empty race list by default', (done: DoneFn) => {
      raceService.getRacesByYear = jasmine
        .createSpy()
        .and.returnValue(of([{}] as Race[]));
      component
        .getOlderRacesByYear(2015)
        .pipe(take(1))
        .subscribe((races: Race[]) => {
          expect(races.length).toBe(0);
          done();
        });
    });

    it('should return some races after onOlderRacesItemsVisibleToggled is called', (done: DoneFn) => {
      raceService.getRacesByYear = jasmine
        .createSpy()
        .and.returnValue(of([{}] as Race[]));
      component
        .getOlderRacesByYear(2015)
        .pipe(skip(1), take(1))
        .subscribe((races: Race[]) => {
          expect(races.length).toBe(1);
          done();
        });
      component.onOlderRacesItemsVisibleToggled(2015);
    });
  });

  describe('onModelEdit', () => {
    it('should call refreshTrigger$.next', () => {
      const spy: jasmine.Spy = jasmine.createSpy();
      component['refreshTrigger$'].next = spy;
      component.onModelEdit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onNewRaceButtonClick', () => {
    it('should call modalService.open', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(),
      });
      component.onNewRaceButtonClick();
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });
});
