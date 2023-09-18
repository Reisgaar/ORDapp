import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingStep1CreationComponent } from './crafting-step1-creation.component';

describe('CraftingStep1CreationComponent', () => {
  let component: CraftingStep1CreationComponent;
  let fixture: ComponentFixture<CraftingStep1CreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingStep1CreationComponent]
    });
    fixture = TestBed.createComponent(CraftingStep1CreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
