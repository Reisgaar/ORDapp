import { TestBed } from '@angular/core/testing';

import { MissionsSharedService } from './missions-shared.service';

describe('MissionsSharedService', () => {
  let service: MissionsSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
