import { TestBed } from '@angular/core/testing';

import { PartnerSellService } from './partner-sell.service';

describe('PartnerSellService', () => {
  let service: PartnerSellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerSellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
