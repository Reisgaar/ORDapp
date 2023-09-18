import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingStep2StylingComponent } from './crafting-step2-styling.component';

describe('CraftingStep2StylingComponent', () => {
  let component: CraftingStep2StylingComponent;
  let fixture: ComponentFixture<CraftingStep2StylingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingStep2StylingComponent]
    });
    fixture = TestBed.createComponent(CraftingStep2StylingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
