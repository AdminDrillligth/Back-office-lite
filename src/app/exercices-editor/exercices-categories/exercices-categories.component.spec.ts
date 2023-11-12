import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesCategoriesComponent } from './exercices-categories.component';

describe('ExercicesCategoriesComponent', () => {
  let component: ExercicesCategoriesComponent;
  let fixture: ComponentFixture<ExercicesCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
