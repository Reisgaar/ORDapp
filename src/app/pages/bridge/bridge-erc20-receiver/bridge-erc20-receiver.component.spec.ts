import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeErc20ReceiverComponent } from './bridge-erc20-receiver.component';

describe('BridgeErc20ReceiverComponent', () => {
  let component: BridgeErc20ReceiverComponent;
  let fixture: ComponentFixture<BridgeErc20ReceiverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BridgeErc20ReceiverComponent]
    });
    fixture = TestBed.createComponent(BridgeErc20ReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
