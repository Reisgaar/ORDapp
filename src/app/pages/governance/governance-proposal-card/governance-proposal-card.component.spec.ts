import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceProposalCardComponent } from './governance-proposal-card.component';

describe('GovernanceProposalCardComponent', () => {
  let component: GovernanceProposalCardComponent;
  let fixture: ComponentFixture<GovernanceProposalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceProposalCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceProposalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
