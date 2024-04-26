import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListTableComponent } from './drivers-list-table.component';
import { provideMockSupabaseClient } from '../../providers/provide-mock-supabase-client';

describe('DriversListTableComponent', () => {
  let component: DriversListTableComponent;
  let fixture: ComponentFixture<DriversListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversListTableComponent],
      providers: [
        provideMockSupabaseClient()
      ]
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
