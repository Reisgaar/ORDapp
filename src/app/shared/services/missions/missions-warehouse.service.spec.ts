import { TestBed } from '@angular/core/testing';

import { MissionsWarehouseService } from './missions-warehouse.service';

describe('MissionsWarehouseService', () => {
  let service: MissionsWarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionsWarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
