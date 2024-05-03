import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEditModalComponent } from './driver-edit-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { DriverService } from '../../services/driver.service';
import { of } from 'rxjs';
import { Driver } from '../../models/driver.model';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';

describe('DriverEditModalComponent', () => {
  let component: DriverEditModalComponent;
  let fixture: ComponentFixture<DriverEditModalComponent>;
  let dialogService: ModalService;
  let driverService: DriverService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverEditModalComponent],
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

    fixture = TestBed.createComponent(DriverEditModalComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(ModalService);
    driverService = TestBed.inject(DriverService);
    toastService = TestBed.inject(ToastService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isNewModel to false when no year is provided', () => {
      dialogService.getInstance = jasmine
        .createSpy()
        .and.returnValue({ data: {} });
      fixture.detectChanges();
      expect(component.isNewModel).toBe(false);
    });

    it('should fallback when dialogdata is empty', () => {
      dialogService.getInstance = jasmine.createSpy().and.returnValue({});
      fixture.detectChanges();
      expect(component.isNewModel).toBe(false);
    });

    it('should set isNewModel to true with a year is provided but no model', () => {
      dialogService.getInstance = jasmine
        .createSpy()
        .and.returnValue({ data: { year: 5 } });
      fixture.detectChanges();
      expect(component.isNewModel).toBe(true);
    });

    it('should set isNewModel to false with a year and a model are provided', () => {
      dialogService.getInstance = jasmine
        .createSpy()
        .and.returnValue({ data: { year: 5, model: {} } });
      fixture.detectChanges();
      expect(component.isNewModel).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should call createDriver for new models', () => {
      component.isNewModel = true;
      component['data'] = { model: {} as Driver, year: 5 };
      driverService.createDriver = jasmine.createSpy().and.returnValue(of({}));
      component.onSubmit();
      expect(driverService.createDriver).toHaveBeenCalledTimes(1);
    });

    it('should call updateDriver for existing models', () => {
      component.isNewModel = false;
      component['data'] = { model: { id: 51 } as Driver, year: 5 };
      driverService.updateDriver = jasmine.createSpy().and.returnValue(of({}));
      component.onSubmit();
      expect(driverService.updateDriver).toHaveBeenCalledTimes(1);
    });

    it('should call toastservice when there is an api error', () => {
      component.isNewModel = true;
      component['data'] = { model: {} as Driver, year: 5 };
      driverService.createDriver = jasmine
        .createSpy()
        .and.returnValue(of({ error: {} }));
      toastService.add = jasmine.createSpy();
      component.onSubmit();
      expect(toastService.add).toHaveBeenCalledTimes(1);
    });
  });
});
