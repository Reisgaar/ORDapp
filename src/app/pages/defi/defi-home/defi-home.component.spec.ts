import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefiHomeComponent } from './defi-home.component';

describe('DefiHomeComponent', () => {
  let component: DefiHomeComponent;
  let fixture: ComponentFixture<DefiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefiHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
