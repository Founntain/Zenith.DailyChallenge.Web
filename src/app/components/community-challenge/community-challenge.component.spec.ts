import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityChallengeComponent } from './community-challenge.component';

describe('CommunityChallengeComponent', () => {
  let component: CommunityChallengeComponent;
  let fixture: ComponentFixture<CommunityChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
