import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteEditFormComponent } from './vote-edit-form.component';

describe('VoteEditFormComponent', () => {
  let component: VoteEditFormComponent;
  let fixture: ComponentFixture<VoteEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoteEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
