import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLootboxInfoComponent } from './pop-up-lootbox-info.component';

describe('PopUpLootboxInfoComponent', () => {
  let component: PopUpLootboxInfoComponent;
  let fixture: ComponentFixture<PopUpLootboxInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpLootboxInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpLootboxInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
