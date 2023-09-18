import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSpecieSelectorComponent } from './pop-up-specie-selector.component';

describe('PopUpSpecieSelectorComponent', () => {
  let component: PopUpSpecieSelectorComponent;
  let fixture: ComponentFixture<PopUpSpecieSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpSpecieSelectorComponent]
    });
    fixture = TestBed.createComponent(PopUpSpecieSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
