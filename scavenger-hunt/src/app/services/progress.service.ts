import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private firestore = inject(Firestore);

  async saveProgress(gameCode: string, username: string, index: number, isGameCompleted: boolean): Promise<void> {
    const progressRef = doc(this.firestore, `games/${gameCode}`);
    await updateDoc(progressRef, {
        [`players.${username}`]: {progressIndex: index, completed: isGameCompleted}
      });
  }

  watchProgress(gameCode: string, callback: (progress: any) => void) {
    const ref = doc(this.firestore, `games/${gameCode}`);
    return onSnapshot(ref, snapshot => {
      const data = snapshot.data();
      callback(data?.['progress'] || {});
    });
  }

  /**
   * Returns the next location index the player should access.
   * This is determined by the highest completed index + 1.
   */
  async getPlayerProgressIndex(gameCode: string, username: string): Promise<[number, boolean]> {
    const ref = doc(this.firestore, `games/${gameCode}`);
    const snapshot = await getDoc(ref);
    const data = snapshot.data();
    const playerProgress = data?.['players']?.[username].progressIndex || 0;
    const isGameCompleted = data?.['players']?.[username].completed || false;

    return [playerProgress, isGameCompleted];
  }
}
