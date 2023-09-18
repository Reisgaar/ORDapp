import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerNftComponent } from './partner-nft.component';

describe('PartnerNftComponent', () => {
  let component: PartnerNftComponent;
  let fixture: ComponentFixture<PartnerNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
