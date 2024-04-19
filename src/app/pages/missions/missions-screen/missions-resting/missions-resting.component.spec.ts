import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsRestingComponent } from './missions-resting.component';

describe('MissionsRestingComponent', () => {
  let component: MissionsRestingComponent;
  let fixture: ComponentFixture<MissionsRestingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsRestingComponent]
    });
    fixture = TestBed.createComponent(MissionsRestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
