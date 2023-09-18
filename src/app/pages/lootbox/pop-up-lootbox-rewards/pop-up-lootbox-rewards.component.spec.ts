import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLootboxRewardsComponent } from './pop-up-lootbox-rewards.component';

describe('PopUpLootboxRewardsComponent', () => {
  let component: PopUpLootboxRewardsComponent;
  let fixture: ComponentFixture<PopUpLootboxRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpLootboxRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpLootboxRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
