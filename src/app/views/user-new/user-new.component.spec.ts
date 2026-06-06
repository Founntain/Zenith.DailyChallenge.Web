import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewComponent } from './user-new.component';

describe('UserNewComponent', () => {
  let component: UserNewComponent;
  let fixture: ComponentFixture<UserNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
