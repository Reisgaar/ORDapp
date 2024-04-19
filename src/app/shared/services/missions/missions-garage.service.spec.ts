import { TestBed } from '@angular/core/testing';

import { MissionsGarageService } from './missions-garage.service';

describe('MissionsGarageService', () => {
  let service: MissionsGarageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsGarageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
