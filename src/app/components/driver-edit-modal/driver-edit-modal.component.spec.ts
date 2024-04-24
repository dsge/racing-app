import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEditModalComponent } from './driver-edit-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('DriverEditModalComponent', () => {
  let component: DriverEditModalComponent;
  let fixture: ComponentFixture<DriverEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverEditModalComponent],
      providers: [
        { provide: DialogService, useValue: { getInstance: jasmine.createSpy().and.returnValue({ data: {} }) } },
        { provide: DynamicDialogRef, useValue: jasmine.createSpyObj('', ['close']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
