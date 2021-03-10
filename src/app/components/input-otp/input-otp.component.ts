import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss'],
})
export class InputOtpComponent implements OnInit {
  public formOtp: FormGroup;
  confirmationResult: firebase.auth.ConfirmationResult;

  @Input() confirmResult;
  constructor(
    private fb: FormBuilder,
    private fa: AngularFireAuth,
    private modalController: ModalController
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.confirmationResult = this.confirmResult;
    console.log(this.confirmResult);
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
    console.log('hi');
    let otp = this.formOtp.value.otp.toString();
    console.log(otp);
    // this.confirmationResult.confirm(otp).then(() => {
    //   alert('otp verified');
    // });
    // this.confirmationResult.confirm(otp).then((res) => {
    //   alert('otp verified');
    //   console.log(res);
    //   // this.modalController.dismiss();
    // });
  }
}
