import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEditModalComponent } from './race-edit-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { ModalService } from '../../services/modal.service';
import { Race } from '../../models/race.model';
import { RaceService } from '../../services/race.service';
import { of } from 'rxjs';
import { ToastService } from '../../services/toast.service';

describe('RaceEditModalComponent', () => {
  let component: RaceEditModalComponent;
  let fixture: ComponentFixture<RaceEditModalComponent>;
  let raceService: RaceService;
  let toastService: ToastService;
  let dialogRef: DynamicDialogRef;

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
    raceService = TestBed.inject(RaceService);
    toastService = TestBed.inject(ToastService);
    dialogRef = TestBed.inject(DynamicDialogRef);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('isNewModel', () => {
    it('should be true for new model', () => {
      fixture.detectChanges();
      expect(component.isNewModel).toBeTrue();
    });

    it('should be false for existing model', () => {
      component['data'].model = {} as Race;
      fixture.detectChanges();
      expect(component.isNewModel).toBeFalse();
    });
  });

  describe('getTimeField', () => {
    it('should parse a time field correctly', () => {
      component['data'].model = {
        race_end_date: '2015-05-05T10:10:10Z',
      } as Race;
      expect(component.getTimeField('race_end_date')).toBe('2015-05-05 12:10');
    });

    it('should return null for missing time field', () => {
      component['data'].model = {} as Race;
      expect(component.getTimeField('race_end_date')).toBeNull();
    });
  });

  describe('onTimeChange', () => {
    it('should update a time field correctly', () => {
      component['data'].model = { race_end_date: '' } as Race;
      component.onTimeChange('race_end_date', '2015-05-05 10:10');
      expect(component['data'].model['race_end_date']).toBe(
        '2015-05-05T08:10:00.000Z'
      );
    });
  });

  describe('onSubmit', () => {
    it('should call createRace for new model', () => {
      raceService.createRace = jasmine.createSpy().and.returnValue(of());
      component.isNewModel = true;
      component.onSubmit();
      expect(raceService.createRace).toHaveBeenCalledTimes(1);
    });
    it('should call updateRace for existing model', () => {
      raceService.updateRace = jasmine.createSpy().and.returnValue(of());
      component.isNewModel = false;
      component.onSubmit();
      expect(raceService.updateRace).toHaveBeenCalledTimes(1);
    });

    it('should call toastService.add for save error', () => {
      raceService.createRace = jasmine
        .createSpy()
        .and.returnValue(of({ error: {} }));
      toastService.add = jasmine.createSpy();
      component.isNewModel = true;
      component.onSubmit();
      expect(toastService.add).toHaveBeenCalledTimes(1);
    });

    it('should call dialogRef.close on save success', () => {
      raceService.updateRace = jasmine.createSpy().and.returnValue(of({}));
      dialogRef.close = jasmine.createSpy();
      component.isNewModel = false;
      component.onSubmit();
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
