import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpGetNftsComponent } from './pop-up-get-nfts.component';

describe('PopUpGetNftsComponent', () => {
  let component: PopUpGetNftsComponent;
  let fixture: ComponentFixture<PopUpGetNftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpGetNftsComponent]
    });
    fixture = TestBed.createComponent(PopUpGetNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
