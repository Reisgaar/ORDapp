import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceStakeCardComponent } from './governance-stake-card.component';

describe('GovernanceStakeCardComponent', () => {
  let component: GovernanceStakeCardComponent;
  let fixture: ComponentFixture<GovernanceStakeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceStakeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceStakeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
