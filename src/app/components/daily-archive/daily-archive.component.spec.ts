import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyArchiveComponent } from './daily-archive.component';

describe('DailyArchiveComponent', () => {
  let component: DailyArchiveComponent;
  let fixture: ComponentFixture<DailyArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyArchiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
