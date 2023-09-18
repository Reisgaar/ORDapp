import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewerBigComponent } from './item-viewer-big.component';

describe('ItemViewerBigComponent', () => {
  let component: ItemViewerBigComponent;
  let fixture: ComponentFixture<ItemViewerBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemViewerBigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemViewerBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
