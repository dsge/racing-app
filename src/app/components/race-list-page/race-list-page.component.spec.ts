import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListPageComponent } from './race-list-page.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';

describe('RaceListPageComponent', () => {
  let component: RaceListPageComponent;
  let fixture: ComponentFixture<RaceListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListPageComponent],
      providers: [
        provideMockSupabaseClient()
      ]
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
