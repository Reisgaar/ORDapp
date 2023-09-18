import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityAddComponent } from './liquidity-add.component';

describe('LiquidityAddComponent', () => {
  let component: LiquidityAddComponent;
  let fixture: ComponentFixture<LiquidityAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
