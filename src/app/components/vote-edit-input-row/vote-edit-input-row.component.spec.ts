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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('getId', () => {
    it('should return an empty string when no position and no isFastestLapVote', () => {
      component.position = null;
      component.isFastestLapVote = false;
      fixture.detectChanges();
      expect(component.getId()).toBe('');
    });

    it('should return "fastest-lap" when isFastestLapVote is true', () => {
      component.position = 2;
      component.isFastestLapVote = true;
      fixture.detectChanges();
      expect(component.getId()).toBe('fastest-lap');
    });

    it('should return "2" when isFastestLapVote is false', () => {
      component.position = 2;
      component.isFastestLapVote = false;
      fixture.detectChanges();
      expect(component.getId()).toBe('2');
    });
  });
});
