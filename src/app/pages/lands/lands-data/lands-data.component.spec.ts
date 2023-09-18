import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsDataComponent } from './lands-data.component';

describe('LandsDataComponent', () => {
  let component: LandsDataComponent;
  let fixture: ComponentFixture<LandsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
