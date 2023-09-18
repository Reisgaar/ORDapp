import { TestBed } from '@angular/core/testing';

import { LandsAuctionService } from './lands-auction.service';

describe('LandsAuctionService', () => {
  let service: LandsAuctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandsAuctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
