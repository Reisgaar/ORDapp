import { TestBed } from '@angular/core/testing';

import { PartnerNftService } from './partner-nft.service';

describe('PartnerNftService', () => {
  let service: PartnerNftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerNftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
