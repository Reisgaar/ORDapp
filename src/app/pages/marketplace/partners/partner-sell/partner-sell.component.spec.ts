import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSellComponent } from './partner-sell.component';

describe('PartnerSellComponent', () => {
  let component: PartnerSellComponent;
  let fixture: ComponentFixture<PartnerSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
