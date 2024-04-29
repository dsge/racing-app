import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListSectionComponent } from './race-list-section.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { RaceService } from '../../services/race.service';
import { Race } from '../../models/race.model';
import { of, take } from 'rxjs';

describe('RaceListSectionComponent', () => {
  let component: RaceListSectionComponent;
  let fixture: ComponentFixture<RaceListSectionComponent>;
  let raceService: RaceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListSectionComponent],
      providers: [
        provideMockSupabaseClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceListSectionComponent);
    component = fixture.componentInstance;
    raceService = TestBed.inject(RaceService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should item visibility to true when itemsCanBeHidden is false', () => {
    component.itemsVisible = false;
    component.itemsCanBeHidden = false;
    fixture.detectChanges();
    expect(component.itemsVisible).toBe(true);
  });

  it('should return whether the voting has ended', () => {
    const mockValue: boolean = true;
    raceService.hasVotingEnded = jasmine.createSpy().and.returnValue(mockValue);
    expect(component.hasVotingEnded({} as Race)).toBe(mockValue);
  });

  it('should return whether the user has ended', (done: DoneFn) => {
    const mockValue: boolean = true;
    raceService.hasUserVoted = jasmine.createSpy().and.returnValue(of(mockValue));
    component.hasUserVoted({} as Race).pipe(take(1)).subscribe((value: boolean) => {
      expect(value).toBe(mockValue);
      done();
    });
  });

  it('should emit on model edit', () => {
    component.modelEdit.emit = jasmine.createSpy();
    component.onModelEdit();
    expect(component.modelEdit.emit).toHaveBeenCalledTimes(1);
  });

  describe('toggleItemsVisible', () => {
    it('should toggle item visibility on', () => {
      component.itemsVisible = false;
      component.toggleItemsVisible({ preventDefault: jasmine.createSpy() } as unknown as Event);
      expect(component.itemsVisible).toBe(true);
    });
    it('should toggle item visibility off', () => {
      component.itemsVisible = true;
      component.toggleItemsVisible({ preventDefault: jasmine.createSpy() } as unknown as Event);
      expect(component.itemsVisible).toBe(false);
    });
  });
});
