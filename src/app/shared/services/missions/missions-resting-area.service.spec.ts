import { TestBed } from '@angular/core/testing';

import { MissionsRestingAreaService } from './missions-resting-area.service';

describe('MissionsRestingAreaService', () => {
  let service: MissionsRestingAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsRestingAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
