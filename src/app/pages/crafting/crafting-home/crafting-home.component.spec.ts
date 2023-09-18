import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraftingHomeComponent } from './crafting-home.component';

describe('CraftingHomeComponent', () => {
  let component: CraftingHomeComponent;
  let fixture: ComponentFixture<CraftingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CraftingHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CraftingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
