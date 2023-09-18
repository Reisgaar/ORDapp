import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingFactoryComponent } from './crafting-factory.component';

describe('CraftingFactoryComponent', () => {
  let component: CraftingFactoryComponent;
  let fixture: ComponentFixture<CraftingFactoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingFactoryComponent]
    });
    fixture = TestBed.createComponent(CraftingFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
