import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Location } from '../model/location';
import { Victim } from '../model/victim';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private dbPath = '/places';
  private victimPath = '/victim';
  locRef: AngularFireList<Location> = null;
  victimRef: AngularFireList<Victim> = null;

  constructor(private db: AngularFireDatabase) {
    this.locRef = db.list(this.dbPath);
    this.victimRef = db.list(this.victimPath);
  }

  getAll(): AngularFireList<Location> {
    this.locRef = this.db.list(this.dbPath);
    return this.locRef;
  }

  create(victim: Victim) {
    this.victimRef = this.db.list(this.victimPath);
    return this.victimRef.push(victim);
  }

  update(victim: Victim, id) {
    return this.victimRef.update(id, victim);
  }
}
