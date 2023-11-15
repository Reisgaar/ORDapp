import { TestBed } from '@angular/core/testing';

import { FoundryService } from './foundry.service';

describe('FoundryService', () => {
  let service: FoundryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoundryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
