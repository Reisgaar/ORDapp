import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootboxHomeComponent } from './lootbox-home.component';

describe('LootboxHomeComponent', () => {
  let component: LootboxHomeComponent;
  let fixture: ComponentFixture<LootboxHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootboxHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootboxHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
