import { TestBed } from '@angular/core/testing';

import { FirmWareService } from './firmware.service';

describe('FirmWareService', () => {
  let service: FirmWareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirmWareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
