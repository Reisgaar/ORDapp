import { TestBed } from '@angular/core/testing';

import { BuyLootboxService } from './buy-lootbox.service';

describe('BuyLootboxService', () => {
  let service: BuyLootboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyLootboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
