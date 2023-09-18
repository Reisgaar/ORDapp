import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeHomeComponent } from './bridge-home.component';

describe('BridgeHomeComponent', () => {
  let component: BridgeHomeComponent;
  let fixture: ComponentFixture<BridgeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BridgeHomeComponent]
    });
    fixture = TestBed.createComponent(BridgeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
