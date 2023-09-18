import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefiSelectHeaderComponent } from './defi-select-header.component';

describe('DefiSelectHeaderComponent', () => {
  let component: DefiSelectHeaderComponent;
  let fixture: ComponentFixture<DefiSelectHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefiSelectHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefiSelectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
