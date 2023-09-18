import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpBidOnAuctionComponent } from './pop-up-bid-on-auction.component';

describe('PopUpBidOnAuctionComponent', () => {
  let component: PopUpBidOnAuctionComponent;
  let fixture: ComponentFixture<PopUpBidOnAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpBidOnAuctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpBidOnAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
