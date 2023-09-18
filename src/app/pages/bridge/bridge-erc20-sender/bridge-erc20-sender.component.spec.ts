import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeERC20SenderComponent } from './bridge-erc20-sender.component';

describe('BridgeERC20SenderComponent', () => {
  let component: BridgeERC20SenderComponent;
  let fixture: ComponentFixture<BridgeERC20SenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeERC20SenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BridgeERC20SenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
