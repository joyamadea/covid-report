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
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.page.html',
  styleUrls: ['./input-otp.page.scss'],
})
export class InputOtpPage implements OnInit {
  @Input() confirmResult;
  @Input() phoneNum;

  getOtpCode = '';
  confirmationResult: firebase.auth.ConfirmationResult;
  constructor(
    private cache: CacheService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private fa: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.confirmationResult = this.confirmResult;
  }

  async checkOtp() {
    console.log(this.getOtpCode.length);
    if (this.getOtpCode.length == 6) {
      this.confirmationResult.confirm(this.getOtpCode).then((res) => {
        console.log(res);
        let uid = firebase.auth().currentUser.uid;
        this.cache.setId(uid);
        this.cache.setLoggedIn(true);
        this.checkUser();
        // this.modalController.dismiss();
      });
    } else {
    }
  }

  async checkUser() {
    const check = firebase.database().ref('/users/' + this.phoneNum);
    check.once(
      'value',
      async (snapshot) => {
        if (snapshot.val() == null) {
          firebase.database().ref('/users').child(this.phoneNum).set({
            role: 'user',
          });
          this.cache.setRole('user');
          this.router.navigate(['/home']);
        } else {
          console.log(snapshot.val().role);
          this.cache.setRole(snapshot.val().role);
          this.router.navigate(['/home']);
        }
        this.presentToast();
        this.modalController.dismiss();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Successful Login',
      color: 'success',
      duration: 2000,
    });
    toast.present();
  }
}
