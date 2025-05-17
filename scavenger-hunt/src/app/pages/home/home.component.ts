import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private auth: AuthService) {}

  joinGame() {
    if (!this.username.trim() || !this.gameCode.trim()) {
      alert('Please enter both a game code and a username.');
      return;
    }

    // Store info locally for use in the game
    localStorage.setItem('gameCode', this.gameCode.trim());
    localStorage.setItem('username', this.username.trim());

    this.router.navigate(['/location', 1]); // Assume game starts at location 1
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
