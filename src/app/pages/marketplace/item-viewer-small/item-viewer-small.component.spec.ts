import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewerSmallComponent } from './item-viewer-small.component';

describe('ItemViewerSmallComponent', () => {
  let component: ItemViewerSmallComponent;
  let fixture: ComponentFixture<ItemViewerSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemViewerSmallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewerSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
