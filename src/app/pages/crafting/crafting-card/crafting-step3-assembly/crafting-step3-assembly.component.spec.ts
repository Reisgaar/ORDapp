import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingStep3AssemblyComponent } from './crafting-step3-assembly.component';

describe('CraftingStep3AssemblyComponent', () => {
  let component: CraftingStep3AssemblyComponent;
  let fixture: ComponentFixture<CraftingStep3AssemblyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CraftingStep3AssemblyComponent]
    });
    fixture = TestBed.createComponent(CraftingStep3AssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
