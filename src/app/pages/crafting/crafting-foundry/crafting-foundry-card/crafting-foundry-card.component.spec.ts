import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingFoundryCardComponent } from './crafting-foundry-card.component';

describe('CraftingFoundryCardComponent', () => {
  let component: CraftingFoundryCardComponent;
  let fixture: ComponentFixture<CraftingFoundryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingFoundryCardComponent]
    });
    fixture = TestBed.createComponent(CraftingFoundryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
