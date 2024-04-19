import { TestBed } from '@angular/core/testing';

import { MissionsRecruitmentService } from './missions-recruitment.service';

describe('MissionsRecruitmentService', () => {
  let service: MissionsRecruitmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsRecruitmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
