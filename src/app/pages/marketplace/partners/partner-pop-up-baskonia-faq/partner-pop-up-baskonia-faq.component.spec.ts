import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerPopUpBaskoniaFaqComponent } from './partner-pop-up-baskonia-faq.component';

describe('PartnerPopUpBaskoniaFaqComponent', () => {
  let component: PartnerPopUpBaskoniaFaqComponent;
  let fixture: ComponentFixture<PartnerPopUpBaskoniaFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerPopUpBaskoniaFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerPopUpBaskoniaFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
