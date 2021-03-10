import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import firebase from 'firebase/app';
import 'firebase/auth';
import { map } from 'rxjs/operators';
import { CacheService } from 'src/app/services/cache.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-victim-list',
  templateUrl: './victim-list.page.html',
  styleUrls: ['./victim-list.page.scss'],
})
export class VictimListPage implements OnInit {
  role: any;
  uid: any;
  check: any;
  victimList: any;
  skeleton = true;
  fakeList = Array(3);

  constructor(
    private cache: CacheService,
    private db: AngularFireDatabase,
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fetchData();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async fetchData() {
    this.skeleton = true;
    this.cache.getRole().then((res) => {
      this.role = res;
      this.cache.getId().then((res) => {
        this.uid = res;
        console.log(this.uid);
        if (this.role == 'admin') {
          this.getAllVictim();
        } else {
          this.getVictimByUploader();
        }
      });
    });
  }

  async getAllVictim() {
    this.firebaseService
      .getAllVictim()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.val(),
          }))
        )
      )
      .subscribe((data) => {
        this.dataChanger(data);
      });
  }

  async getVictimByUploader() {
    this.firebaseService
      .getVictimByUploader(this.uid)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            key: c.payload.key,
            ...c.payload.val(),
          }))
        )
      )
      .subscribe((data) => {
        // this.victimList = data;
        this.dataChanger(data);
      });
  }

  dataChanger(data) {
    data.forEach((element: any) => {
      console.log(element.ref);
      this.storage
        .ref(element.ref)
        .getDownloadURL()
        .subscribe((res: any) => {
          element.ref = res;
        });

      this.db
        .object('/places/' + element.location)
        .valueChanges()
        .subscribe((res: any) => {
          element.location = res.name;
          // console.log(res);
        });
    });

    this.victimList = data;
    this.skeleton = false;
  }

  async actions(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Action List',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.gotoDetail(id);
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.confirmDelete(id);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async confirmDelete(id) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete victim report?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.delete(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Victim deleted',
      duration: 2000,
    });
    toast.present();
  }

  delete(id) {
    this.firebaseService.delete(id).then((res) => {
      this.presentToast();
    });
  }

  gotoDetail(id) {
    this.router.navigate(['/victim/edit', id]);
  }
}
