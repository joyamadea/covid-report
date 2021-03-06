import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CacheService } from 'src/app/services/cache.service';
import { Router } from '@angular/router';
const { Camera, Device } = Plugins;

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
  uid;
  message = '';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private storage: AngularFireStorage,
    private cache: CacheService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.initForm();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getLocations();
    this.cache.getId().then((res: any) => {
      this.uid = res;
      console.log(res);
    });
  }

  goBack() {
    this.router.navigate(['/home']);
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
    let body;
    if (this.formAdd.valid) {
      this.updatePhotoProfile();
      body = this.formAdd.value;
      body.ref = this.filePath;
      body.uid = this.uid;

      console.log(body);

      this.firebaseService.create(body).then(
        (res: any) => {
          this.message = 'Successfully added new report';
          this.presentToast();
        },
        (err) => {
          this.message = err.message;
          this.presentToast();
          this.goBack();
        }
      );
    }
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

  // GET PICTURE FROM PHONE
  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
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
    let now = Math.round(date.getTime() / 1000).toString();
    this.filePath = '/profile/' + name + now;
    console.log(this.filePath);
    const ref = this.storage.ref(this.filePath);
    const task = ref.put(file).then((res) => {
      console.log(res);
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 2000,
    });
    toast.present();
  }
}
