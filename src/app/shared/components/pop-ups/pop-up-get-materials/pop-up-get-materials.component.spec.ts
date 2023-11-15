import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpGetMaterialsComponent } from './pop-up-get-materials.component';

describe('PopUpGetMaterialsComponent', () => {
  let component: PopUpGetMaterialsComponent;
  let fixture: ComponentFixture<PopUpGetMaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpGetMaterialsComponent]
    });
    fixture = TestBed.createComponent(PopUpGetMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
