import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernancePopUpBuyGqComponent } from './governance-pop-up-buy-gq.component';

describe('GovernancePopUpBuyGqComponent', () => {
  let component: GovernancePopUpBuyGqComponent;
  let fixture: ComponentFixture<GovernancePopUpBuyGqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernancePopUpBuyGqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernancePopUpBuyGqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
