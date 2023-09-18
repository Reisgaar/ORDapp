import { TestBed } from '@angular/core/testing';

import { MaterialExtractionService } from './material-extraction.service';

describe('MaterialExtractionService', () => {
  let service: MaterialExtractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialExtractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
