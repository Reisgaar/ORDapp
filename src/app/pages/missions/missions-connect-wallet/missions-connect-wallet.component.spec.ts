import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsConnectWalletComponent } from './missions-connect-wallet.component';

describe('MissionsConnectWalletComponent', () => {
  let component: MissionsConnectWalletComponent;
  let fixture: ComponentFixture<MissionsConnectWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsConnectWalletComponent]
    });
    fixture = TestBed.createComponent(MissionsConnectWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
