import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPageContentsComponent } from './results-page-contents.component';

describe('ResultsPageContentsComponent', () => {
  let component: ResultsPageContentsComponent;
  let fixture: ComponentFixture<ResultsPageContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPageContentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsPageContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
