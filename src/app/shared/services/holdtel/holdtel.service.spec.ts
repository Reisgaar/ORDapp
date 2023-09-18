import { TestBed } from '@angular/core/testing';

import { HoldtelService } from './holdtel.service';

describe('HoldtelService', () => {
  let service: HoldtelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldtelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
