import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsHomeComponent } from './lands-home.component';

describe('LandsHomeComponent', () => {
  let component: LandsHomeComponent;
  let fixture: ComponentFixture<LandsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
