import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExtractionCardComponent } from './material-extraction-card.component';

describe('MaterialExtractionCardComponent', () => {
  let component: MaterialExtractionCardComponent;
  let fixture: ComponentFixture<MaterialExtractionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialExtractionCardComponent]
    });
    fixture = TestBed.createComponent(MaterialExtractionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
