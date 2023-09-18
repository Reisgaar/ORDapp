import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsMapComponent } from './lands-map.component';

describe('LandsMapComponent', () => {
  let component: LandsMapComponent;
  let fixture: ComponentFixture<LandsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
