import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsWarehouseComponent } from './missions-warehouse.component';

describe('MissionsWarehouseComponent', () => {
  let component: MissionsWarehouseComponent;
  let fixture: ComponentFixture<MissionsWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsWarehouseComponent]
    });
    fixture = TestBed.createComponent(MissionsWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
