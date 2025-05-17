import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private firestore: Firestore) {}

  private getGameInfo() {
    const gameCode = localStorage.getItem('playerGame');
    const username = localStorage.getItem('username');
    return { gameCode, username };
  }

  async markComplete(locationId: number) {
    const { gameCode, username } = this.getGameInfo();
    if (!gameCode || !username) return;

    const ref = doc(this.firestore, `games/${gameCode}/players/${username}`);
    const snap = await getDoc(ref);
    const data = snap.data() || {};

    await setDoc(ref, {
      ...data,
      progress: {
        ...(data['progress'] || {}),
        [locationId]: true
      }
    }, { merge: true });
  }

  async getCompleted(): Promise<{ [key: string]: boolean }> {
    const { gameCode, username } = this.getGameInfo();
    if (!gameCode || !username) return {};

    const ref = doc(this.firestore, `games/${gameCode}/players/${username}`);
    const snap = await getDoc(ref);
    const data = snap.data() as any;
    return data?.progress || {};
  }

  async getPath(): Promise<number[]> {
    const { gameCode } = this.getGameInfo();
    if (!gameCode) return [1, 2, 3]; // fallback for dev

    const gameRef = doc(this.firestore, `games/${gameCode}`);
    const snap = await getDoc(gameRef);

    if (!snap.exists()) {
      console.warn('Game not found:', gameCode);
      return [1, 2, 3];
    }

    const data = snap.data() as any;
    return data?.path || [1, 2, 3];
  }
}
