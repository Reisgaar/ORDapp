import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackMarketSaleCreatorComponent } from './black-market-sale-creator.component';

describe('BlackMarketSaleCreatorComponent', () => {
  let component: BlackMarketSaleCreatorComponent;
  let fixture: ComponentFixture<BlackMarketSaleCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlackMarketSaleCreatorComponent]
    });
    fixture = TestBed.createComponent(BlackMarketSaleCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
