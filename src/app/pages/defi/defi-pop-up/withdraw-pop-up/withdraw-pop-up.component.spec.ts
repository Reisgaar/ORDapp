import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawPopUpComponent } from './withdraw-pop-up.component';

describe('WithdrawPopUpComponent', () => {
  let component: WithdrawPopUpComponent;
  let fixture: ComponentFixture<WithdrawPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
