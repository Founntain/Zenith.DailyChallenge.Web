import { TestBed } from '@angular/core/testing';

import { ZenithUserService } from './zenith-user.service';

describe('UserService', () => {
  let service: ZenithUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZenithUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
