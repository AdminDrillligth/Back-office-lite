import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesSportSelectComponent } from './exercices-sport-select.component';

describe('ExercicesSportSelectComponent', () => {
  let component: ExercicesSportSelectComponent;
  let fixture: ComponentFixture<ExercicesSportSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesSportSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesSportSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
