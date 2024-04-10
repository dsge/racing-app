import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteEditModalComponent } from './vote-edit-modal.component';

describe('VoteEditModalComponent', () => {
  let component: VoteEditModalComponent;
  let fixture: ComponentFixture<VoteEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
