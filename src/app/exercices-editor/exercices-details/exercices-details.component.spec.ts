import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesDetailsComponent } from './exercices-details.component';

describe('ExercicesDetailsComponent', () => {
  let component: ExercicesDetailsComponent;
  let fixture: ComponentFixture<ExercicesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
