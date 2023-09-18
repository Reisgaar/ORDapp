import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpGeneralComponent } from './pop-up-general.component';

describe('PopUpGeneralComponent', () => {
  let component: PopUpGeneralComponent;
  let fixture: ComponentFixture<PopUpGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
