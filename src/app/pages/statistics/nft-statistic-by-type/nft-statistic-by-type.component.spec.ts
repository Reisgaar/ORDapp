import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStatisticByTypeComponent } from './nft-statistic-by-type.component';

describe('NftStatisticByTypeComponent', () => {
  let component: NftStatisticByTypeComponent;
  let fixture: ComponentFixture<NftStatisticByTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NftStatisticByTypeComponent]
    });
    fixture = TestBed.createComponent(NftStatisticByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
