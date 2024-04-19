import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsHomeComponent } from './missions-home.component';

describe('MissionsHomeComponent', () => {
  let component: MissionsHomeComponent;
  let fixture: ComponentFixture<MissionsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsHomeComponent]
    });
    fixture = TestBed.createComponent(MissionsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
