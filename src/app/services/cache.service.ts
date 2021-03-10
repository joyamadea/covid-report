import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private storage: Storage) {}

  setPhone(phone) {
    this.storage.set('phone', phone);
  }

  getPhone() {
    return this.storage.get('phone');
  }

  setRole(role) {
    this.storage.set('role', role);
  }

  getRole() {
    return this.storage.get('role');
  }

  setLoggedIn(val) {
    this.storage.set('login', val);
  }

  isLoggedIn() {
    return this.storage.get('login');
  }
}
