import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingFoundryComponent } from './crafting-foundry.component';

describe('CraftingFoundryComponent', () => {
  let component: CraftingFoundryComponent;
  let fixture: ComponentFixture<CraftingFoundryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingFoundryComponent]
    });
    fixture = TestBed.createComponent(CraftingFoundryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
