import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDailiesComponent } from './user-dailies.component';

describe('UserDailiesComponent', () => {
  let component: UserDailiesComponent;
  let fixture: ComponentFixture<UserDailiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDailiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDailiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
