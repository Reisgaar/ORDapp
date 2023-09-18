import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsCardComponent } from './lands-card.component';

describe('LandsCardComponent', () => {
  let component: LandsCardComponent;
  let fixture: ComponentFixture<LandsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
