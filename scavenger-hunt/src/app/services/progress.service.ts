import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

    constructor(
    private db: AngularFirestore,
    private auth: AuthService
  ) {}

  async markComplete(locationId: number) {
    const group = this.auth.getGroup();
    if (!group) return;

    await this.db.collection('groups').doc(group).set({
      progress: { [locationId]: true }
    }, { merge: true });
  }

  async getCompleted(): Promise<{ [key: string]: boolean }> {
    const group = this.auth.getGroup();
    if (!group) return {};
    const doc = await this.db.collection('groups').doc(group).get().toPromise();
    return doc?.data()?.['progress'] || {};
  }
}
