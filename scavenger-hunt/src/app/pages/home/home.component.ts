import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gameCode: string = '';
  username: string = '';
  loading: boolean = false;

  constructor(private router: Router, private auth: AuthService, private firestore: Firestore) {}

  async joinGame() {
    if (!this.username.trim() || !this.gameCode.trim()) {
      alert('Please enter both a game code and a nickname.');
      return;
    }

    const code = this.gameCode.trim();
    const name = this.username.trim();
    this.loading = true;

    try {
      const gameRef = doc(this.firestore, `games/${code}`);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        alert('Game not found. Please check the code.');
        this.loading = false;
        return;
      }

      // Register player progress in the game if not exists
      const gameData = gameSnap.data() as any;
      console.log(gameData.locations);
      const players = gameData.players || {};

      if (!players[name]) {
        players[name] = {
          nickname: name,
          progressIndex: 0,
          // completedAt: "",
          // answers: {}
        };

        // ✅ Update the game document with merged players map
        console.log(gameData, players[name]);
      }
      await updateDoc(gameRef, {
        [`players.${name}`]: players[name]
      });

      // Store locally
      localStorage.setItem('gameCode', code);
      localStorage.setItem('username', name);

      this.router.navigate(['/play', code]); // Go to player screen
    } catch (err) {
      console.error(err);
      alert('An error occurred while joining the game.');
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  simulateLogin() {
    this.auth.simulateOrganizerLogin();
    this.router.navigate(['/organizer-dashboard']);
  }
}
