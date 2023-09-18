import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceAddProposalComponent } from './governance-add-proposal.component';

describe('GovernanceAddProposalComponent', () => {
  let component: GovernanceAddProposalComponent;
  let fixture: ComponentFixture<GovernanceAddProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceAddProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceAddProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
