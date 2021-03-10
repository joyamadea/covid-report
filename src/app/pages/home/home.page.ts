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
  constructor(private router: Router, private cache: CacheService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.cache.getRole().then((res: any) => {
      this.userData = res;
      console.log(this.userData);
    });
  }
  gotoAdd() {
    this.router.navigate(['/victim/add']);
  }
}
