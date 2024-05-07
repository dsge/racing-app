import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceResultsPageComponent } from './race-results-page.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { ActivatedRoute, Data, provideRouter } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { Subject, of, take } from 'rxjs';
import { Race } from '../../models/race.model';
import { ScoreScreenService } from '../../services/score-screen.service';
import { DriverService } from '../../services/driver.service';
import { UserService } from '../../services/user.service';
import { RaceService } from '../../services/race.service';

describe('RaceResultsPageComponent', () => {
  let component: RaceResultsPageComponent;
  let fixture: ComponentFixture<RaceResultsPageComponent>;
  let modalService: ModalService;
  let scoreScreenService: ScoreScreenService;
  let driverService: DriverService;
  let activatedRoute: ActivatedRoute;
  let activatedRouteData$: Subject<Data>;
  let userService: UserService;
  let raceService: RaceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceResultsPageComponent],
      providers: [provideMockSupabaseClient(), provideRouter([])],
    }).compileComponents();

    activatedRouteData$ = new Subject<Data>();
    activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.data = activatedRouteData$;
    fixture = TestBed.createComponent(RaceResultsPageComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    scoreScreenService = TestBed.inject(ScoreScreenService);
    driverService = TestBed.inject(DriverService);
    userService = TestBed.inject(UserService);
    raceService = TestBed.inject(RaceService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('raceScoreScreenVotes$', () => {
    it('should call scoreScreenService.getRaceScoreScreenVotes', (done: DoneFn) => {
      scoreScreenService.getRaceScoreScreenVotes = jasmine
        .createSpy()
        .and.returnValue(of({}));
      component.raceScoreScreenVotes$.pipe(take(1)).subscribe(() => {
        expect(
          scoreScreenService.getRaceScoreScreenVotes
        ).toHaveBeenCalledTimes(1);
        done();
      });
      activatedRouteData$.next({
        race: { drivers_from_year: 2015 },
      });
    });
  });

  describe('drivers$', () => {
    it('should call driverService.getDriversForYear', (done: DoneFn) => {
      driverService.getDriversForYear = jasmine
        .createSpy()
        .and.returnValue(of([]));
      component.drivers$.pipe(take(1)).subscribe(() => {
        expect(driverService.getDriversForYear).toHaveBeenCalledTimes(1);
        done();
      });
      activatedRouteData$.next({
        race: { drivers_from_year: 2015 },
      });
    });
  });

  describe('openEditFinalResultsDialog', () => {
    it('should call modalService.open', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(),
      });
      component.openEditFinalResultsDialog({} as Race);
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('currentUserIsModerator', () => {
    it('should call userService.isModerator', () => {
      userService.isModerator = jasmine.createSpy().and.returnValue(of());
      component.currentUserIsModerator();
      expect(userService.isModerator).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasVotingEnded', () => {
    it('should call raceService.hasVotingEnded', () => {
      raceService.hasVotingEnded = jasmine.createSpy().and.returnValue(true);
      component.hasVotingEnded({} as Race);
      expect(raceService.hasVotingEnded).toHaveBeenCalledTimes(1);
    });
  });
});
