import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMissionTroopsSelectorComponent } from './pop-up-mission-troops-selector.component';

describe('PopUpMissionTroopsSelectorComponent', () => {
  let component: PopUpMissionTroopsSelectorComponent;
  let fixture: ComponentFixture<PopUpMissionTroopsSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpMissionTroopsSelectorComponent]
    });
    fixture = TestBed.createComponent(PopUpMissionTroopsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
