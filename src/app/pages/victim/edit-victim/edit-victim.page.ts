import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/core';
import { ActionSheetController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-victim',
  templateUrl: './edit-victim.page.html',
  styleUrls: ['./edit-victim.page.scss'],
})
export class EditVictimPage implements OnInit {
  public formEdit: FormGroup;
  detail: any;
  locations: any;
  photo: any;
  filePath: any;
  key: any;

  items = [
    {
      id: '1',
      title: 'm',
      name: 'Male',
    },
    {
      id: '2',
      title: 'f',
      name: 'Female',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private firebaseService: FirebaseService,
    private actionSheetController: ActionSheetController,
    private activatedRoute: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params) {
        this.key = params['id'];
      }
    });
  }

  ionViewWillEnter() {
    this.getVictimData();
    this.getLocations();
  }

  async initForm() {
    this.formEdit = this.fb.group({
      name: new FormControl(null, Validators.compose([Validators.required])),
      age: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      gender: new FormControl(null, Validators.compose([Validators.required])),
      location: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });
  }

  async getVictimData() {
    await this.db
      .object('/victim/' + this.key)
      .valueChanges()
      .subscribe((data) => {
        this.detail = data;
        this.formEdit.patchValue(this.detail);
        this.storage
          .ref(this.detail.ref)
          .getDownloadURL()
          .subscribe((res: any) => {
            this.photo = res;
            console.log(this.photo);
          });
      });
  }

  getLocations() {
    this.firebaseService
      .getAll()
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
        this.locations = data;
      });
  }

  edit() {
    if (this.formEdit.valid) {
      console.log(this.formEdit.value);
      let body;
      this.updatePhotoProfile();
      body = this.formEdit.value;
      body.ref = this.filePath;

      this.firebaseService.update(this.formEdit.value, '-MVNLBPCJ3a4shg3jjSo');
    }
  }

  // CHANGE PHOTO PROFILE
  async changePhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Mengambil Gambar dari',
      buttons: [
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  // GET PICTURE FROM PHONE
  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    this.photo = image.dataUrl;
    console.log(this.photo);
    // this.updatePhotoProfile();
  }

  // TAKE PICTURE USING CAMERA
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.photo = image.dataUrl;
  }

  dataUrltoFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  updatePhotoProfile() {
    let name = this.formEdit.value.name.trim();
    this.filePath = '/profile/' + name;
    if (!this.photo.includes('http')) {
      const file = this.dataUrltoFile(this.photo, name);
      let date = new Date();
      const ref = this.storage.ref(this.filePath);
      const task = ref.put(file).then((res) => {
        // this.storage
        //   .ref(this.filePath)
        //   .getDownloadURL()
        //   .subscribe((res: any) => {
        //     console.log(res);
        //   });
        console.log(res);
      });
    }
  }
}
