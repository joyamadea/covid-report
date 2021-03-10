import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CacheService } from 'src/app/services/cache.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any;
  loading = true;
  logoutClicked = false;
  constructor(
    private router: Router,
    private cache: CacheService,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cache.isLoggedIn().then((res: any) => {
      this.cache.getRole().then((res: any) => {
        this.userData = res;
        this.loading = false;
        console.log(this.userData);
      });
    });
  }
  gotoAdd() {
    this.router.navigate(['/victim/add']);
  }

  goto(type) {
    if (type == 'add') {
      this.router.navigate(['/victim/add']);
    } else if (type == 'list') {
      this.router.navigate(['victim-list']);
    } else if (type == 'stat') {
      this.router.navigate(['statistics']);
    }
  }

  async logoutPrompt() {
    this.logoutClicked = true;
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
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
          text: 'Yes',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    // this.firebaseService.logout().then((res) => {
    //   this.cache.setLoggedIn(false);
    //   this.cache.setRole(null);
    //   this.cache.setId(null);
    //   this.router.navigate(['/login']);
    // });
    // this.logoutClicked = false;
  }
}
