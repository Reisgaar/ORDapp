import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialViewerComponent } from './material-viewer.component';

describe('MaterialViewerComponent', () => {
  let component: MaterialViewerComponent;
  let fixture: ComponentFixture<MaterialViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
