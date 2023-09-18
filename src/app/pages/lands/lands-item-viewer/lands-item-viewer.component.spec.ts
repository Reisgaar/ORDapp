import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsItemViewerComponent } from './lands-item-viewer.component';

describe('LandsItemViewerComponent', () => {
  let component: LandsItemViewerComponent;
  let fixture: ComponentFixture<LandsItemViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsItemViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsItemViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
