import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEditModalComponent } from './race-edit-modal.component';

describe('RaceEditModalComponent', () => {
  let component: RaceEditModalComponent;
  let fixture: ComponentFixture<RaceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaceEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
