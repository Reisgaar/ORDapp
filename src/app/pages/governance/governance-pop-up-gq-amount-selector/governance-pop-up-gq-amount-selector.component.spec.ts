import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernancePopUpGqAmountSelectorComponent } from './governance-pop-up-gq-amount-selector.component';

describe('GovernancePopUpGqAmountSelectorComponent', () => {
  let component: GovernancePopUpGqAmountSelectorComponent;
  let fixture: ComponentFixture<GovernancePopUpGqAmountSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernancePopUpGqAmountSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernancePopUpGqAmountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
