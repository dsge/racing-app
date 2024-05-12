import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPageContentsComponent } from './results-page-contents.component';
import { of, take } from 'rxjs';
import { Race, RaceScoreScreenVotes } from '../../models/race.model';
import { UserVote } from '../../models/user-vote.model';
import { Driver } from '../../models/driver.model';

describe('ResultsPageContentsComponent', () => {
  let component: ResultsPageContentsComponent;
  let fixture: ComponentFixture<ResultsPageContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPageContentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPageContentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not fail when there is only a race passed', () => {
      component.race$ = of({} as Race);
      fixture.detectChanges();
      expect(component.raceFinalResults$).toBeUndefined();
    });

    describe('raceFinalResults$', () => {
      it('should be empty when there are no raceFinalResults', (done: DoneFn) => {
        component.race$ = of({ id: 20001 } as Race);
        component.raceScoreScreenVotes$ = of({
          raceFinalResults: [],
          userVotes: [],
        } as RaceScoreScreenVotes);
        fixture.detectChanges();
        component.raceFinalResults$
          .pipe(take(1))
          .subscribe((finalResults?: UserVote[]) => {
            expect(finalResults).toBeUndefined();
            done();
          });
      });

      it('should not be empty when there are raceFinalResults', (done: DoneFn) => {
        component.race$ = of({ id: 20001 } as Race);
        component.raceScoreScreenVotes$ = of({
          raceFinalResults: [
            {
              driver_final_position: 5,
              driver: {} as Driver,
            },
            {
              driver_final_position: 2,
              driver: {} as Driver,
            },
            {
              driver_final_position: 2,
              driver: {} as Driver,
            },
            {
              is_fastest_lap_vote: true,
              driver: {} as Driver,
            },
          ],
          userVotes: [],
        } as RaceScoreScreenVotes);
        fixture.detectChanges();
        component.raceFinalResults$
          .pipe(take(1))
          .subscribe((finalResults?: UserVote[]) => {
            expect(finalResults).not.toBeUndefined();
            done();
          });
      });
    });
  });

  describe('getDriverForPosition', () => {
    it('should return undefined when there are no drivers passed to the component', () => {
      component.drivers = [];
      expect(
        component.getDriverForPosition(5, [
          { is_fastest_lap_vote: false, driver_final_position: 5 },
        ])
      ).toBeUndefined();
    });

    it('should return the driver when there are drivers passed to the component', () => {
      component.drivers = [
        {
          id: 8,
          full_name: 'foo',
          year_of_racing: 2015,
        },
      ];
      expect(
        component.getDriverForPosition(5, [
          { driver_final_position: 5, driver_id: 8 },
        ])?.full_name
      ).toBe('foo');
    });

    it('should return the driver for fastest lap vote', () => {
      component.drivers = [
        {
          id: 8,
          full_name: 'foo',
          year_of_racing: 2015,
        },
      ];
      expect(
        component.getDriverForPosition('fastest-lap', [
          { is_fastest_lap_vote: true, driver_id: 8 },
        ])?.full_name
      ).toBe('foo');
    });
  });
});
