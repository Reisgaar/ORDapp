import { TestBed } from '@angular/core/testing';

import { BlackMarketService } from './black-market.service';

describe('BlackMarketService', () => {
  let service: BlackMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlackMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
