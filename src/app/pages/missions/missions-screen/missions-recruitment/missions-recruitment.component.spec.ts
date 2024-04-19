import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsRecruitmentComponent } from './missions-recruitment.component';

describe('MissionsRecruitmentComponent', () => {
  let component: MissionsRecruitmentComponent;
  let fixture: ComponentFixture<MissionsRecruitmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissionsRecruitmentComponent]
    });
    fixture = TestBed.createComponent(MissionsRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
