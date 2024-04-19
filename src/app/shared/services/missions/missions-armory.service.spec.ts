import { TestBed } from '@angular/core/testing';

import { MissionsArmoryService } from './missions-armory.service';

describe('MissionsArmoryService', () => {
  let service: MissionsArmoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsArmoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
