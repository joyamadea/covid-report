import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public formLogin: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  async initForm() {
    this.formLogin = this.fb.group({
      phone_number: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      password: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  login() {
    console.log(this.formLogin.value);
  }
}
