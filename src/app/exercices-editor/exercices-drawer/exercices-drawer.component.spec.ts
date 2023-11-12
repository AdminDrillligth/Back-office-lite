import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesDrawerComponent } from './exercices-drawer.component';

describe('ExercicesDrawerComponent', () => {
  let component: ExercicesDrawerComponent;
  let fixture: ComponentFixture<ExercicesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
