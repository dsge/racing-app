import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListSectionComponent } from './race-list-section.component';

describe('RaceListSectionComponent', () => {
  let component: RaceListSectionComponent;
  let fixture: ComponentFixture<RaceListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaceListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
