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
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss'],
})
export class InputOtpComponent implements OnInit {
  confirmationResult: firebase.auth.ConfirmationResult;
  getOtpCode = '';

  @Input() confirmResult;
  constructor(private router: Router, private cache: CacheService) {}

  ngOnInit() {
    this.confirmationResult = this.confirmResult;
    console.log(this.confirmResult);
  }

  checkOtp() {
    console.log(this.getOtpCode);
    if (this.getOtpCode.length == 6) {
      this.confirmationResult.confirm(this.getOtpCode).then((res) => {
        alert('otp verified');
        console.log(res);
        this.checkUser();
        // this.modalController.dismiss();
      });
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
}
