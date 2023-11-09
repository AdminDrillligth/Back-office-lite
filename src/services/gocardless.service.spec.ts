import { TestBed } from '@angular/core/testing';

import { GocardlessService } from './gocardless.service';

describe('GocardlessService', () => {
  let service: GocardlessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GocardlessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
