import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyringComponent } from './keyring.component';

describe('KeyringComponent', () => {
  let component: KeyringComponent;
  let fixture: ComponentFixture<KeyringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyringComponent]
    });
    fixture = TestBed.createComponent(KeyringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
