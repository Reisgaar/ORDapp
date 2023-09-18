import { TestBed } from '@angular/core/testing';

import { CraftingCreationService } from './crafting-creation.service';

describe('CraftingCreationService', () => {
  let service: CraftingCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftingCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
