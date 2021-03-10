import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from 'src/environments/environment';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { CacheService } from 'src/app/services/cache.service';
import { InputOtpPage } from '../input-otp/input-otp.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public formLogin: FormGroup;
  recaptchaVerifier;
  confirmationResult: firebase.auth.ConfirmationResult;
  otpSent = false;
  submitted = false;
  phone;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fa: AngularFireAuth,
    private modalController: ModalController,
    private cache: CacheService,
    private toastController: ToastController
  ) {
    this.initForm();
  }

  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' }
    );
  }

  ionViewWillEnter() {
    this.submitted = false;
  }

  async initForm() {
    this.formLogin = this.fb.group({
      phone_number: new FormControl(
        '82262268800',
        Validators.compose([Validators.required])
      ),
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  login() {
    this.submitted = true;
    this.phone = '+62' + this.formLogin.value.phone_number.toString();
    if (this.formLogin.valid) {
      this.fa
        .signInWithPhoneNumber(this.phone, this.recaptchaVerifier)
        .then((res: any) => {
          this.otpSent = true;
          this.presentToast();
          this.otpModal(res);
        });
      //
    } else {
      this.submitted = false;
    }
  }

  async otpModal(val) {
    const modal = await this.modalController.create({
      component: InputOtpPage,
      componentProps: { confirmResult: val, phoneNum: this.phone },
    });

    return await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'OTP Sent',
      duration: 2000,
    });
    toast.present();
  }
}
