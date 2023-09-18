import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefiHeaderComponent } from './defi-header.component';

describe('DefiHeaderComponent', () => {
  let component: DefiHeaderComponent;
  let fixture: ComponentFixture<DefiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefiHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
