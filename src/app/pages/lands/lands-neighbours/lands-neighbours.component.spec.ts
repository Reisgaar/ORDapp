import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsNeighboursComponent } from './lands-neighbours.component';

describe('LandsNeighboursComponent', () => {
  let component: LandsNeighboursComponent;
  let fixture: ComponentFixture<LandsNeighboursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsNeighboursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsNeighboursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
