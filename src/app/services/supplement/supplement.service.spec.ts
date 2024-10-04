import { TestBed } from '@angular/core/testing';

import { SupplementService } from './supplement.service';

describe('SupplementService', () => {
  let service: SupplementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
