import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerNftCardComponent } from './partner-nft-card.component';

describe('PartnerNftCardComponent', () => {
  let component: PartnerNftCardComponent;
  let fixture: ComponentFixture<PartnerNftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerNftCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerNftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
