import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPreview } from './cv-preview';

describe('CvPreview', () => {
  let component: CvPreview;
  let fixture: ComponentFixture<CvPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
