import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpInfoComponent } from './pop-up-info.component';

describe('PopUpInfoComponent', () => {
  let component: PopUpInfoComponent;
  let fixture: ComponentFixture<PopUpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
