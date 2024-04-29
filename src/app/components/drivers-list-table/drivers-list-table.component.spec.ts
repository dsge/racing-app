import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListTableComponent } from './drivers-list-table.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';
import { DriverService } from '../../services/driver.service';
import { Subject, of } from 'rxjs';
import { Driver } from '../../models/driver.model';
import { ModalService } from '../../services/modal.service';
import { AppConfirmationService } from '../../services/confirmation.service';
import { Confirmation } from 'primeng/api';

describe('DriversListTableComponent', () => {
  let component: DriversListTableComponent;
  let fixture: ComponentFixture<DriversListTableComponent>;
  let driverService: DriverService;
  let modalService: ModalService;
  let confirmationService: AppConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListTableComponent],
      providers: [
        provideMockSupabaseClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriversListTableComponent);
    component = fixture.componentInstance;
    driverService = TestBed.inject(DriverService);
    modalService = TestBed.inject(ModalService);
    confirmationService = TestBed.inject(AppConfirmationService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set loading to true while getDriversForYear is processing', () => {
      component.year = 5;
      const trigger$: Subject<Driver[]> = new Subject<Driver[]>();
      driverService.getDriversForYear = jasmine.createSpy().and.returnValue(trigger$);
      fixture.detectChanges();
      expect(component.loading).toBeTrue();
      trigger$.next([]);
      trigger$.complete();
    })

    it('should set loading to false after getDriversForYear is done', () => {
      component.year = 5;
      const trigger$: Subject<Driver[]> = new Subject<Driver[]>();
      driverService.getDriversForYear = jasmine.createSpy().and.returnValue(trigger$);
      fixture.detectChanges();
      trigger$.next([]);
      expect(component.loading).toBeFalse();
      trigger$.complete();
    })
  });

  describe('onNewDriverButtonClick', () => {
    it('should open a modal', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(null)
      });
      component.onNewDriverButtonClick();
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('onEditDriverClick', () => {
    it('should open a modal', () => {
      modalService.open = jasmine.createSpy().and.returnValue({
        onClose: of(null)
      });
      component.onEditDriverClick({} as Driver);
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('onDeleteDriverButtonClick', () => {
    it('should call confirmationService.confirm', () => {
      confirmationService.confirm = jasmine.createSpy();
      component.onDeleteDriverButtonClick({ target: {} } as Event, {} as Driver);
      expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    });

    it('should call deleteDriver', (done: DoneFn) => {
      driverService.deleteDriver = jasmine.createSpy().and.returnValue(of(null));
      confirmationService.confirm = jasmine.createSpy().and.callFake((confirmation: Confirmation) => {
        confirmation.accept?.();
        expect(driverService.deleteDriver).toHaveBeenCalledTimes(1);
        done();
      });
      component.onDeleteDriverButtonClick({ target: {} } as Event, {} as Driver);
    });

    it('should provide a callable reject function ', (done: DoneFn) => {
      confirmationService.confirm = jasmine.createSpy().and.callFake((confirmation: Confirmation) => {
        expect(confirmation.reject).toBeDefined();
        confirmation.reject?.();
        done();
      });
      component.onDeleteDriverButtonClick({ target: {} } as Event, {} as Driver);
    });
  });
});
