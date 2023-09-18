import { TestBed } from '@angular/core/testing';

import { PartnerEnglishAuctionService } from './partner-english-auction.service';

describe('PartnerEnglishAuctionService', () => {
  let service: PartnerEnglishAuctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerEnglishAuctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
