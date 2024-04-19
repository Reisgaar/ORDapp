import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsArmoryComponent } from './missions-armory.component';

describe('MissionsArmoryComponent', () => {
  let component: MissionsArmoryComponent;
  let fixture: ComponentFixture<MissionsArmoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsArmoryComponent]
    });
    fixture = TestBed.createComponent(MissionsArmoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
