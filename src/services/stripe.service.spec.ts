import { TestBed } from '@angular/core/testing';

import { StripeServices } from './stripe.service';

describe('StripeServices', () => {
  let service: StripeServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
