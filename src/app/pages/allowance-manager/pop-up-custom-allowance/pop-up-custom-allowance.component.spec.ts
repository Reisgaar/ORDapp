import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCustomAllowanceComponent } from './pop-up-custom-allowance.component';

describe('PopUpCustomAllowanceComponent', () => {
  let component: PopUpCustomAllowanceComponent;
  let fixture: ComponentFixture<PopUpCustomAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpCustomAllowanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpCustomAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
