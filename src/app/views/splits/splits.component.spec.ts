import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitsComponent } from './splits.component';

describe('SplitsComponent', () => {
  let component: SplitsComponent;
  let fixture: ComponentFixture<SplitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
