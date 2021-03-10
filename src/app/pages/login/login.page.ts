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
  message = '';

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
    this.cache.isLoggedIn().then((res: any) => {
      if (res == true) {
        this.router.navigate(['/home']);
      }
    });
  }

  async initForm() {
    this.formLogin = this.fb.group({
      phone_number: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(10)])
      ),
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  login() {
    this.submitted = true;
    let phoneNum = this.formLogin.value.phone_number.toString();
    if (this.formLogin.valid) {
      this.phone = '+62' + phoneNum;
      console.log(this.phone);
      this.fa.signInWithPhoneNumber(this.phone, this.recaptchaVerifier).then(
        (res: any) => {
          this.otpSent = true;
          this.message = 'OTP Sent';
          this.presentToast();
          this.otpModal(res);
        },
        (err) => {
          this.message = err.message;
          this.presentToast();
        }
      );
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
      message: this.message,
      duration: 2000,
    });
    toast.present();
  }
}
