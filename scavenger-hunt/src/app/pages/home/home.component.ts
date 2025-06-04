import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  gameCode: string = '';
  username: string = '';
  loading: boolean = false;  
  user$!: Observable<User | null>;
  

  constructor(private router: Router, 
    private auth: AuthService, 
    private firestore: Firestore,
    private translate: TranslateService) {}
    
  ngOnInit(): void {
    this.user$ = this.auth.getUser();
  }

  async joinGame() {
    if (!this.username.trim() || !this.gameCode.trim()) {
      const message = this.translate.instant('errors.missing_game_code_or_nickname');
      alert(message);
      return;
    }

    const code = this.gameCode.trim();
    const name = this.username.trim();
    this.loading = true;

    try {
      const gameRef = doc(this.firestore, `games/${code}`);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        const message = this.translate.instant('errors.game_not_found_with_tip');
        alert(message);
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
