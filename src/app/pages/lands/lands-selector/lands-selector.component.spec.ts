import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsSelectorComponent } from './lands-selector.component';

describe('LandsSelectorComponent', () => {
  let component: LandsSelectorComponent;
  let fixture: ComponentFixture<LandsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
