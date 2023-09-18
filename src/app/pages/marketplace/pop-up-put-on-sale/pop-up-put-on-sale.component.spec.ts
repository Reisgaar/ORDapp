import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpPutOnSaleComponent } from './pop-up-put-on-sale.component';

describe('PopUpPutOnSaleComponent', () => {
  let component: PopUpPutOnSaleComponent;
  let fixture: ComponentFixture<PopUpPutOnSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpPutOnSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpPutOnSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
