import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderWebSectionsComponent } from './slider-web-sections.component';

describe('SliderWebSectionsComponent', () => {
  let component: SliderWebSectionsComponent;
  let fixture: ComponentFixture<SliderWebSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderWebSectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderWebSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
