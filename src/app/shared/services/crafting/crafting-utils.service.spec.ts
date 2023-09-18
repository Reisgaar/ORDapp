import { TestBed } from '@angular/core/testing';

import { CraftingUtilsService } from './crafting-utils.service';

describe('CraftingUtilsService', () => {
  let service: CraftingUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftingUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
