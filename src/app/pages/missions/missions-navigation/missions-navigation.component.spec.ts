import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsNavigationComponent } from './missions-navigation.component';

describe('MissionsNavigationComponent', () => {
  let component: MissionsNavigationComponent;
  let fixture: ComponentFixture<MissionsNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsNavigationComponent]
    });
    fixture = TestBed.createComponent(MissionsNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
