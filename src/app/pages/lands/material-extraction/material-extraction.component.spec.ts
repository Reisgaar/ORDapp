import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExtractionComponent } from './material-extraction.component';

describe('MaterialExtractionComponent', () => {
  let component: MaterialExtractionComponent;
  let fixture: ComponentFixture<MaterialExtractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialExtractionComponent]
    });
    fixture = TestBed.createComponent(MaterialExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
