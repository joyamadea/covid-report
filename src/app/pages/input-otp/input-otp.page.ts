import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.page.html',
  styleUrls: ['./input-otp.page.scss'],
})
export class InputOtpPage implements OnInit {
  public formOtp: FormGroup;
  confirmationResult: firebase.auth.ConfirmationResult;
  constructor(
    private fb: FormBuilder,
    private fa: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.confirmationResult = params['val'];
      console.log(this.confirmationResult);
    });
  }

  async initForm() {
    this.formOtp = this.fb.group({
      otp: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  get f() {
    return this.formOtp.controls;
  }

  async login() {
    let otp = this.formOtp.value.otp.toString();
    console.log(otp);
    // this.confirmationResult.confirm(otp).then(() => {
    //   alert('otp verified');
    // });
    this.confirmationResult.confirm('123456').then((res) => {
      console.log(res);
    });
  }
}
