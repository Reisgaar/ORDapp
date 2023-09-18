import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNftViewerComponent } from './profile-nft-viewer.component';

describe('ProfileNftViewerComponent', () => {
  let component: ProfileNftViewerComponent;
  let fixture: ComponentFixture<ProfileNftViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNftViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNftViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
