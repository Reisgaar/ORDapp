import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackMarketMaterialCardComponent } from './black-market-material-card.component';

describe('BlackMarketMaterialCardComponent', () => {
  let component: BlackMarketMaterialCardComponent;
  let fixture: ComponentFixture<BlackMarketMaterialCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlackMarketMaterialCardComponent]
    });
    fixture = TestBed.createComponent(BlackMarketMaterialCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
