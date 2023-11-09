import { TestBed } from '@angular/core/testing';

import { UserHandlerHistoricalService } from './user-handlers-historical.service';

describe('UserHandlerHistoricalService', () => {
  let service: UserHandlerHistoricalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandlerHistoricalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
