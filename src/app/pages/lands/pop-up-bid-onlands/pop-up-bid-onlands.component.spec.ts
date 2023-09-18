import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpBidOnlandsComponent } from './pop-up-bid-onlands.component';

describe('PopUpBidOnlandsComponent', () => {
  let component: PopUpBidOnlandsComponent;
  let fixture: ComponentFixture<PopUpBidOnlandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpBidOnlandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpBidOnlandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
