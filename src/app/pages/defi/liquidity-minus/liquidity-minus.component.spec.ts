import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityMinusComponent } from './liquidity-minus.component';

describe('LiquidityMinusComponent', () => {
  let component: LiquidityMinusComponent;
  let fixture: ComponentFixture<LiquidityMinusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityMinusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidityMinusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
