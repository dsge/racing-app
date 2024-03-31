import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEditModalComponent } from './driver-edit-modal.component';

describe('DriverEditModalComponent', () => {
  let component: DriverEditModalComponent;
  let fixture: ComponentFixture<DriverEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverEditModalComponent]
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
