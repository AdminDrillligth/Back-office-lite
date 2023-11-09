import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconesComponent } from './econes.component';

describe('EconesComponent', () => {
  let component: EconesComponent;
  let fixture: ComponentFixture<EconesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
