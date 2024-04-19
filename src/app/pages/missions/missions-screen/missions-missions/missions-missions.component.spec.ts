import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsMissionsComponent } from './missions-missions.component';

describe('MissionsMissionsComponent', () => {
  let component: MissionsMissionsComponent;
  let fixture: ComponentFixture<MissionsMissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsMissionsComponent]
    });
    fixture = TestBed.createComponent(MissionsMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
