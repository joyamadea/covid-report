import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(private storage: Storage) {}

  setId(phone) {
    this.storage.set('uid', phone);
  }

  getId() {
    return this.storage.get('uid');
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
