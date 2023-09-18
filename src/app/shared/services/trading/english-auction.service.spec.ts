import { TestBed } from '@angular/core/testing';

import { EnglishAuctionService } from './english-auction.service';

describe('EnglishAuctionService', () => {
  let service: EnglishAuctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnglishAuctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
