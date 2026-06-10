import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZenithSplitsComponent } from './zenith-splits.component';

describe('ZenithSplitsComponent', () => {
  let component: ZenithSplitsComponent;
  let fixture: ComponentFixture<ZenithSplitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZenithSplitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZenithSplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
