import { TestBed } from '@angular/core/testing';

import { MissionsMissionsService } from './missions-missions.service';

describe('MissionsMissionsService', () => {
  let service: MissionsMissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsMissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
