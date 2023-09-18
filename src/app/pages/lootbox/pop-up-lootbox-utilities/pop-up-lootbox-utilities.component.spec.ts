import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLootboxUtilitiesComponent } from './pop-up-lootbox-utilities.component';

describe('PopUpLootboxUtilitiesComponent', () => {
  let component: PopUpLootboxUtilitiesComponent;
  let fixture: ComponentFixture<PopUpLootboxUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpLootboxUtilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpLootboxUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
