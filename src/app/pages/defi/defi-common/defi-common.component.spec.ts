import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefiCommonComponent } from './defi-common.component';

describe('DefiCommonComponent', () => {
  let component: DefiCommonComponent;
  let fixture: ComponentFixture<DefiCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefiCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefiCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
