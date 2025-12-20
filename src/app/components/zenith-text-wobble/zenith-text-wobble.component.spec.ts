import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZenithTextWobbleComponent } from './zenith-text-wobble.component';

describe('ZenithTextWobbleComponent', () => {
  let component: ZenithTextWobbleComponent;
  let fixture: ComponentFixture<ZenithTextWobbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZenithTextWobbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZenithTextWobbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
