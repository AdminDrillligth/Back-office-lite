import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesEditorComponent } from './exercices-editor.component';

describe('ExercicesEditorComponent', () => {
  let component: ExercicesEditorComponent;
  let fixture: ComponentFixture<ExercicesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
