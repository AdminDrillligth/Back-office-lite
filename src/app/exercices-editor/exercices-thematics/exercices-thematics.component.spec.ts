import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesThematicsComponent } from './exercices-thematics.component';

describe('ExercicesThematicsComponent', () => {
  let component: ExercicesThematicsComponent;
  let fixture: ComponentFixture<ExercicesThematicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesThematicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesThematicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
