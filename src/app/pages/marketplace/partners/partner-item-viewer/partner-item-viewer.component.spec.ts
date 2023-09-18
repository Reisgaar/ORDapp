import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerItemViewerComponent } from './partner-item-viewer.component';

describe('PartnerItemViewerComponent', () => {
  let component: PartnerItemViewerComponent;
  let fixture: ComponentFixture<PartnerItemViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerItemViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerItemViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
