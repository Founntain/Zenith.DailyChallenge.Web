import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZdcStatsComponent } from './zdc-stats.component';

describe('ZdcStatsComponent', () => {
  let component: ZdcStatsComponent;
  let fixture: ComponentFixture<ZdcStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZdcStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZdcStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
