import { TestBed } from '@angular/core/testing';

import { OracleApiService } from './oracle-api.service';

describe('OracleApiService', () => {
  let service: OracleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OracleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
