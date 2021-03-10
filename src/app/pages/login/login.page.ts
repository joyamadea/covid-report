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
import { ModalController } from '@ionic/angular';
import { InputOtpComponent } from 'src/app/components/input-otp/input-otp.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { CacheService } from 'src/app/services/cache.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fa: AngularFireAuth,
    private modalController: ModalController,
    private cache: CacheService
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

  async initForm() {
    this.formLogin = this.fb.group({
      phone_number: new FormControl(
        '82262268811',
        Validators.compose([Validators.required])
      ),
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  login() {
    let phone;
    phone = '+62' + this.formLogin.value.phone_number.toString();
    console.log(phone);
    if (this.formLogin.valid) {
      this.fa
        .signInWithPhoneNumber(phone, this.recaptchaVerifier)
        .then((res: any) => {
          this.otpSent = true;
          alert('otp sent');
          console.log(res);
          // let navExtras: NavigationExtras = {
          //   queryParams: {
          //     val: res,
          //   },
          // };
          // this.router.navigate(['/input-otp']);
          // this.otpModal(res);
          // this.navCtrl.navigateForward(['input-otp'], navExtras);

          this.confirmationResult = res;
          this.confirmationResult.confirm('123456').then((res) => {
            console.log(res);
            this.checkUser();
          });
        });
      //
    }
  }

  async checkUser() {
    const check = firebase.database().ref('/users/+6282262268800');
    check.once('value', async (snapshot) => {
      if (snapshot.val() == null) {
        console.log('null');
        firebase.database().ref('/users').child('+6282262268800').set({
          role: 'user',
        });
        this.cache.setRole('user');
        this.router.navigate(['']);
      } else {
        console.log('not null');
        console.log(snapshot.val().role);
        this.cache.setRole(snapshot.val().role);
        this.router.navigate(['']);
        // await firebase.database().
        //   .object('/users/+6282262268800')
        //   .valueChanges()
        //   .subscribe((data: any) => {
        //     console.log(data.role);
        //   });
      }
    });
  }
  async otpModal(val) {
    const modal = await this.modalController.create({
      component: InputOtpComponent,
      componentProps: { confirmResult: val },
    });

    return await modal.present();
  }
}
