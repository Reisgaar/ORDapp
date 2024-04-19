import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpRestingSoldierSelectorComponent } from './pop-up-resting-soldier-selector.component';

describe('PopUpRestingSoldierSelectorComponent', () => {
  let component: PopUpRestingSoldierSelectorComponent;
  let fixture: ComponentFixture<PopUpRestingSoldierSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpRestingSoldierSelectorComponent]
    });
    fixture = TestBed.createComponent(PopUpRestingSoldierSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
