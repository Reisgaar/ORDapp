import { TestBed } from '@angular/core/testing';

import { MissionsBankService } from './missions-bank.service';

describe('MissionsBankService', () => {
  let service: MissionsBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
