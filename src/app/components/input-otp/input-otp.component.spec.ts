import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InputOtpComponent } from './input-otp.component';

describe('InputOtpComponent', () => {
  let component: InputOtpComponent;
  let fixture: ComponentFixture<InputOtpComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InputOtpComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [IonicModule, ReactiveFormsModule, FormsModule],
      }).compileComponents();

      fixture = TestBed.createComponent(InputOtpComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
