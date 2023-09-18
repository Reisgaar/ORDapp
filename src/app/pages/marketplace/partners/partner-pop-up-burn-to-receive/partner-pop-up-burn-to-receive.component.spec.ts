import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerPopUpBurnToReceiveComponent } from './partner-pop-up-burn-to-receive.component';

describe('PartnerPopUpBurnToReceiveComponent', () => {
  let component: PartnerPopUpBurnToReceiveComponent;
  let fixture: ComponentFixture<PartnerPopUpBurnToReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerPopUpBurnToReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerPopUpBurnToReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
