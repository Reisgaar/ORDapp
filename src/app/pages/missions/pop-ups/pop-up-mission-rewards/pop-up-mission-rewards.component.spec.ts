import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMissionRewardsComponent } from './pop-up-mission-rewards.component';

describe('PopUpMissionRewardsComponent', () => {
  let component: PopUpMissionRewardsComponent;
  let fixture: ComponentFixture<PopUpMissionRewardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpMissionRewardsComponent]
    });
    fixture = TestBed.createComponent(PopUpMissionRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
