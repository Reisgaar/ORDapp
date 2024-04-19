import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsGarageComponent } from './missions-garage.component';

describe('MissionsGarageComponent', () => {
  let component: MissionsGarageComponent;
  let fixture: ComponentFixture<MissionsGarageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsGarageComponent]
    });
    fixture = TestBed.createComponent(MissionsGarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
