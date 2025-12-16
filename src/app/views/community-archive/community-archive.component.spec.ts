import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityArchiveComponent } from './community-archive.component';

describe('CommunityArchiveComponent', () => {
  let component: CommunityArchiveComponent;
  let fixture: ComponentFixture<CommunityArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityArchiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
