import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListPageComponent } from './race-list-page.component';

describe('RaceListPageComponent', () => {
  let component: RaceListPageComponent;
  let fixture: ComponentFixture<RaceListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaceListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
