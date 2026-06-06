import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsComponent } from './runs.component';

describe('RunsComponent', () => {
  let component: RunsComponent;
  let fixture: ComponentFixture<RunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
