import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteEditInputRowComponent } from './vote-edit-input-row.component';

describe('VoteEditInputRowComponent', () => {
  let component: VoteEditInputRowComponent;
  let fixture: ComponentFixture<VoteEditInputRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteEditInputRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoteEditInputRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
