import { TestBed } from '@angular/core/testing';

import { FirebaseExerciceService } from './firebase-exercice.service';

describe('FirebaseExerciceService', () => {
  let service: FirebaseExerciceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseExerciceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
