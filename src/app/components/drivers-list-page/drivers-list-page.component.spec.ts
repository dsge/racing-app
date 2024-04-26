import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListPageComponent } from './drivers-list-page.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';

describe('DriversListPageComponent', () => {
  let component: DriversListPageComponent;
  let fixture: ComponentFixture<DriversListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListPageComponent],
      providers: [
        provideMockSupabaseClient()
      ]
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
