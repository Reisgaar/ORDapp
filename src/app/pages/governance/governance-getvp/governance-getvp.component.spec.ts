import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernanceGetvpComponent } from './governance-getvp.component';

describe('GovernanceGetvpComponent', () => {
  let component: GovernanceGetvpComponent;
  let fixture: ComponentFixture<GovernanceGetvpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernanceGetvpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernanceGetvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
