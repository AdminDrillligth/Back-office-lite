import { TestBed } from '@angular/core/testing';

import { EconesService } from './econes.service';

describe('EconesService', () => {
  let service: EconesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EconesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
