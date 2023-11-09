import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditoComponent } from './video-edito.component';

describe('VideoEditoComponent', () => {
  let component: VideoEditoComponent;
  let fixture: ComponentFixture<VideoEditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoEditoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
