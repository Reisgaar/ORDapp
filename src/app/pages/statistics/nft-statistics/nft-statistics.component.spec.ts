import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftStatisticsComponent } from './nft-statistics.component';

describe('NftStatisticsComponent', () => {
  let component: NftStatisticsComponent;
  let fixture: ComponentFixture<NftStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NftStatisticsComponent]
    });
    fixture = TestBed.createComponent(NftStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
