import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpBuyAsGiftComponent } from './pop-up-buy-as-gift.component';

describe('PopUpBuyAsGiftComponent', () => {
  let component: PopUpBuyAsGiftComponent;
  let fixture: ComponentFixture<PopUpBuyAsGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpBuyAsGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpBuyAsGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
