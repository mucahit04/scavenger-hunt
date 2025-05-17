import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private firestore: Firestore,
    private router: Router
  ) {}

  async joinGame(username: string, gameCode: string): Promise<boolean> {
    const gameRef = doc(this.firestore, `games/${gameCode}`);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) return false;

    const playerRef = doc(this.firestore, `games/${gameCode}/players/${username}`);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) {
      await setDoc(playerRef, {
        username,
        startTime: Timestamp.now(),
        progress: {}
      });
    }

    localStorage.setItem('playerGame', gameCode);
    localStorage.setItem('username', username);

    this.router.navigate(['/home']);
    return true;
  }

  getPlayerInfo() {
    return {
      gameCode: localStorage.getItem('playerGame'),
      username: localStorage.getItem('username')
    };
  }

  async markLocationComplete(gameCode: string, username: string, locationId: number) {
    const playerRef = doc(this.firestore, `games/${gameCode}/players/${username}`);
    const snap = await getDoc(playerRef);
    const playerData = snap.data() || {};

    const updatedProgress = {
      ...(playerData['progress'] || {}),
      [locationId]: true
    };

    await setDoc(playerRef, {
      ...playerData,
      progress: updatedProgress
    });
  }
}
