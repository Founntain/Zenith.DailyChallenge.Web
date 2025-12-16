import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentbarComponent } from './segmentbar.component';

describe('SegmentbarComponent', () => {
  let component: SegmentbarComponent;
  let fixture: ComponentFixture<SegmentbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
