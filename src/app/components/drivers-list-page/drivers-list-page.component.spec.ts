import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListPageComponent } from './drivers-list-page.component';

describe('DriversListPageComponent', () => {
  let component: DriversListPageComponent;
  let fixture: ComponentFixture<DriversListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriversListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
