import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpNftSelectorComponent } from './pop-up-nft-selector.component';

describe('PopUpNftSelectorComponent', () => {
  let component: PopUpNftSelectorComponent;
  let fixture: ComponentFixture<PopUpNftSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpNftSelectorComponent]
    });
    fixture = TestBed.createComponent(PopUpNftSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
