import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceProposalsComponent } from './governance-proposals.component';

describe('GovernanceProposalsComponent', () => {
  let component: GovernanceProposalsComponent;
  let fixture: ComponentFixture<GovernanceProposalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceProposalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
