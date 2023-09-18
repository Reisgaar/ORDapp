import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceHomeComponent } from './governance-home.component';

describe('GovernanceHomeComponent', () => {
  let component: GovernanceHomeComponent;
  let fixture: ComponentFixture<GovernanceHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
