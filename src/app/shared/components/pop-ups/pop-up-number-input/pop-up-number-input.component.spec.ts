import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpNumberInputComponent } from './pop-up-number-input.component';

describe('PopUpNumberInputComponent', () => {
  let component: PopUpNumberInputComponent;
  let fixture: ComponentFixture<PopUpNumberInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpNumberInputComponent]
    });
    fixture = TestBed.createComponent(PopUpNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
