import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewerMediumComponent } from './item-viewer-medium.component';

describe('ItemViewerMediumComponent', () => {
  let component: ItemViewerMediumComponent;
  let fixture: ComponentFixture<ItemViewerMediumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemViewerMediumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewerMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
