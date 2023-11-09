import { TestBed } from '@angular/core/testing';

import { UserHandlersServiceAdmin } from './user-handlers-admin.service';

describe('UserHandlersServiceAdmin', () => {
  let service: UserHandlersServiceAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandlersServiceAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
