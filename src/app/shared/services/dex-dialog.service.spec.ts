import { TestBed } from '@angular/core/testing';

import { DexDialogService } from './dex-dialog.service';

describe('DexDialogService', () => {
  let service: DexDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
