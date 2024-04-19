import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsScreenComponent } from './missions-screen.component';

describe('MissionsScreenComponent', () => {
  let component: MissionsScreenComponent;
  let fixture: ComponentFixture<MissionsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsScreenComponent]
    });
    fixture = TestBed.createComponent(MissionsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
