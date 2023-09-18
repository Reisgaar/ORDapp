import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlippageComponent } from './slippage.component';

describe('SlippageComponent', () => {
  let component: SlippageComponent;
  let fixture: ComponentFixture<SlippageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlippageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlippageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
