import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent {
  gameName = '';
  error = '';
  loading = false;

  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async createGame() {
    this.loading = true;
    this.error = '';

    const user = await this.afAuth.currentUser;
    if (!user) {
      this.error = 'You must be logged in to create a game.';
      this.loading = false;
      return;
    }

    const gameCode = await this.generateUniqueCode();

    const gameData = {
      name: this.gameName,
      code: gameCode,
      organizerId: user.uid,
      createdAt: new Date(),
      locations: []
    };

    try {
      await addDoc(collection(this.firestore, 'games'), gameData);
      this.router.navigate(['/organizer/dashboard']);
    } catch (err) {
      console.error(err);
      this.error = 'Failed to create game. Try again.';
    }

    this.loading = false;
  }

  async generateUniqueCode(): Promise<string> {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code: string;
    let exists = true;

    do {
      code = Array.from({ length: 6 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join('');

      const q = query(collection(this.firestore, 'games'), where('code', '==', code));
      const snapshot = await getDocs(q);
      exists = !snapshot.empty;
    } while (exists);

    return code;
  }
}
