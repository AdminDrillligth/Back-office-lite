import { TestBed } from '@angular/core/testing';

import { UserHandlersServiceCustomer } from './user-handlers-customer.service';

describe('UserHandlersServiceCustomer', () => {
  let service: UserHandlersServiceCustomer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandlersServiceCustomer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
