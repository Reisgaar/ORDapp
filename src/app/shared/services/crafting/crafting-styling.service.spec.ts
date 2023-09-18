import { TestBed } from '@angular/core/testing';

import { CraftingStylingService } from './crafting-styling.service';

describe('CraftingStylingService', () => {
  let service: CraftingStylingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftingStylingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
