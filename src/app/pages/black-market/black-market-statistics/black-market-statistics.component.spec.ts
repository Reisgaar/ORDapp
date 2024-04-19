import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackMarketStatisticsComponent } from './black-market-statistics.component';

describe('BlackMarketStatisticsComponent', () => {
  let component: BlackMarketStatisticsComponent;
  let fixture: ComponentFixture<BlackMarketStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlackMarketStatisticsComponent]
    });
    fixture = TestBed.createComponent(BlackMarketStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
