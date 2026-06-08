import { ComponentFixture, TestBed } from '@angular/core/testing';

import ChallengesNewComponent from './challenges-new.component';

describe('ChallengesNewComponent', () => {
  let component: ChallengesNewComponent;
  let fixture: ComponentFixture<ChallengesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
