import { TestBed } from '@angular/core/testing';

import { ZenithService } from './zenith.service';

describe('ZenithService', () => {
  let service: ZenithService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZenithService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
