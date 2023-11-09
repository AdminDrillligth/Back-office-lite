import { TestBed } from '@angular/core/testing';

import { StepsServiceService } from './steps-service.service';

describe('StepsServiceService', () => {
  let service: StepsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
