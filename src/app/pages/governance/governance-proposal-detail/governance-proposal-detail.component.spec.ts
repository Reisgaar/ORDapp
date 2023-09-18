import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceProposalDetailComponent } from './governance-proposal-detail.component';

describe('GovernanceProposalDetailComponent', () => {
  let component: GovernanceProposalDetailComponent;
  let fixture: ComponentFixture<GovernanceProposalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceProposalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceProposalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
