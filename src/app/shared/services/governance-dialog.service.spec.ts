import { TestBed } from '@angular/core/testing';

import { GovernanceDialogService } from './governance-dialog.service';

describe('GovernanceDialogService', () => {
  let service: GovernanceDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernanceDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
