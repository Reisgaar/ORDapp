import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsBankComponent } from './missions-bank.component';

describe('MissionsBankComponent', () => {
  let component: MissionsBankComponent;
  let fixture: ComponentFixture<MissionsBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsBankComponent]
    });
    fixture = TestBed.createComponent(MissionsBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
