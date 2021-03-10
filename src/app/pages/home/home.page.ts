import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData: any;
  loading = true;
  constructor(private router: Router, private cache: CacheService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cache.isLoggedIn().then((res: any) => {
      if (!res) {
        this.router.navigate(['/login']);
      } else {
        this.cache.getRole().then((res: any) => {
          this.userData = res;
          this.loading = false;
          console.log(this.userData);
        });
      }
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
    }
  }
}
