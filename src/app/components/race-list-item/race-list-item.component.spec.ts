import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceListItemComponent } from './race-list-item.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';

describe('RaceListItemComponent', () => {
  let component: RaceListItemComponent;
  let fixture: ComponentFixture<RaceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceListItemComponent],
      providers: [provideMockSupabaseClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
