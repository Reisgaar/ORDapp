import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerPopUpPutOnSaleComponent } from './partner-pop-up-put-on-sale.component';

describe('PartnerPopUpPutOnSaleComponent', () => {
  let component: PartnerPopUpPutOnSaleComponent;
  let fixture: ComponentFixture<PartnerPopUpPutOnSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerPopUpPutOnSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerPopUpPutOnSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
