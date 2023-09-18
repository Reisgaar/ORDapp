import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeFromGameComponent } from './bridge-from-game.component';

describe('BridgeFromGameComponent', () => {
  let component: BridgeFromGameComponent;
  let fixture: ComponentFixture<BridgeFromGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BridgeFromGameComponent]
    });
    fixture = TestBed.createComponent(BridgeFromGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
