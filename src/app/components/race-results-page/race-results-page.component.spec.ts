import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceResultsPageComponent } from './race-results-page.component';

describe('RaceResultsPageComponent', () => {
  let component: RaceResultsPageComponent;
  let fixture: ComponentFixture<RaceResultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceResultsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaceResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
