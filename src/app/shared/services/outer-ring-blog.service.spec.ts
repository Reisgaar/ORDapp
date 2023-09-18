import { TestBed } from '@angular/core/testing';

import { OuterRingBlogService } from './outer-ring-blog.service';

describe('OuterRingBlogService', () => {
  let service: OuterRingBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuterRingBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
