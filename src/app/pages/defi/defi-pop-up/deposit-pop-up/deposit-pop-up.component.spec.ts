import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPopUpComponent } from './deposit-pop-up.component';

describe('DepositPopUpComponent', () => {
  let component: DepositPopUpComponent;
  let fixture: ComponentFixture<DepositPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
