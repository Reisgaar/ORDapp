import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsResourcesMiniComponent } from './missions-resources-mini.component';

describe('MissionsResourcesMiniComponent', () => {
  let component: MissionsResourcesMiniComponent;
  let fixture: ComponentFixture<MissionsResourcesMiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsResourcesMiniComponent]
    });
    fixture = TestBed.createComponent(MissionsResourcesMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
