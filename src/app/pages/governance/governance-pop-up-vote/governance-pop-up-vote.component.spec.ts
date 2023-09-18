import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernancePopUpVoteComponent } from './governance-pop-up-vote.component';

describe('GovernancePopUpVoteComponent', () => {
  let component: GovernancePopUpVoteComponent;
  let fixture: ComponentFixture<GovernancePopUpVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernancePopUpVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernancePopUpVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
