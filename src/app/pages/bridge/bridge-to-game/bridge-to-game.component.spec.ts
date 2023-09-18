import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeToGameComponent } from './bridge-to-game.component';

describe('BridgeToGameComponent', () => {
  let component: BridgeToGameComponent;
  let fixture: ComponentFixture<BridgeToGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BridgeToGameComponent]
    });
    fixture = TestBed.createComponent(BridgeToGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
