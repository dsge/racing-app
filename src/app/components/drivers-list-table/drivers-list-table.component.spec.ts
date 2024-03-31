import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListTableComponent } from './drivers-list-table.component';

describe('DriversListTableComponent', () => {
  let component: DriversListTableComponent;
  let fixture: ComponentFixture<DriversListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriversListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
