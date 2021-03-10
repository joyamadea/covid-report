import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add-victim',
  templateUrl: './add-victim.page.html',
  styleUrls: ['./add-victim.page.scss'],
})
export class AddVictimPage implements OnInit {
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
  public formAdd: FormGroup;
  locations: any;
  thumbnail = true;
  photo: any;
  filePath: any;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private actionSheetController: ActionSheetController,
    private storage: AngularFireStorage
  ) {
    this.initForm();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getLocations();
  }

  async initForm() {
    this.formAdd = this.fb.group({
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

  get f() {
    return this.formAdd.controls;
  }

  addNew() {
    console.log(this.formAdd.value);
    let body;
    if (this.formAdd.valid) {
      this.updatePhotoProfile();
      body = this.formAdd.value;
      body.ref = this.filePath;
    }
    this.firebaseService.create(body);
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
    console.log(image);
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
    let name = this.formAdd.value.name.trim();
    const file = this.dataUrltoFile(this.photo, name);
    let date = new Date();
    this.filePath = '/profile/' + name;
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
