import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersHomeComponent } from './partners-home.component';

describe('PartnersHomeComponent', () => {
  let component: PartnersHomeComponent;
  let fixture: ComponentFixture<PartnersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
