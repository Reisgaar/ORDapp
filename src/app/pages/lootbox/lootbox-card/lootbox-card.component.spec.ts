import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootboxCardComponent } from './lootbox-card.component';

describe('LootboxCardComponent', () => {
  let component: LootboxCardComponent;
  let fixture: ComponentFixture<LootboxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootboxCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootboxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
