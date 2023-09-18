import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingCardComponent } from './crafting-card.component';

describe('CraftingCardComponent', () => {
  let component: CraftingCardComponent;
  let fixture: ComponentFixture<CraftingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingCardComponent]
    });
    fixture = TestBed.createComponent(CraftingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
