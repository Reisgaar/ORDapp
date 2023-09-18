import { TestBed } from '@angular/core/testing';

import { CraftingAssemblyService } from './crafting-assembly.service';

describe('CraftingAssemblyService', () => {
  let service: CraftingAssemblyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftingAssemblyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
