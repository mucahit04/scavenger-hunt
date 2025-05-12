import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async markComplete(locationId: number) {
    const group = this.auth.getGroup();
    if (!group) return;

    const ref = doc(this.firestore, `groups/${group}`);
    await setDoc(ref, {
      progress: { [locationId]: true }
    }, { merge: true });
  }

  async getCompleted(): Promise<{ [key: string]: boolean }> {
    const group = this.auth.getGroup();
    if (!group) return {};

    const ref = doc(this.firestore, `groups/${group}`);
    const snap = await getDoc(ref);
    const data = snap.data() as any;
    return data?.progress || {};
  }

  async getPath(): Promise<number[]> {
    const group = this.auth.getGroup(); // Checks if the group is valid
    console.log('Group:', group); // Debug log to ensure it's returning the group ID

    if (!group) return [1, 2, 3];  // If no group, fall back to this list
    
    const ref = doc(this.firestore, `groups/${group}`);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      console.log('No group document found.');
      return [1, 2, 3];  // Fallback to default if document does not exist
    }
    
    const data = snap.data() as any;
    console.log('Fetched group data:', data); // Debug log
    
    return data?.path || [1, 2, 3];  // Return the path if found, otherwise fallback
  }
}
