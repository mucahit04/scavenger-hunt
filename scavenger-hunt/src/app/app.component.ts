import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Scavenger Hunt';
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    document.body.classList.remove('loading');
    this.user = this.authService.getUser();

    // Redirect on app load or refresh
    if (!this.user) {
      // Not logged in: if at root or unknown route, go to home
      if (this.router.url === '/' || this.router.url === '') {
        this.router.navigate(['/home']);
      }
    } else {
      // Logged in: go to dashboard if at login, register or home
      if (['/', '', '/login', '/register', '/home'].includes(this.router.url)) {
        this.router.navigate(['/organizer-dashboard']);
      }
    }

    // Optional: listen for navigation to handle route changes later
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.user = this.authService.getUser();

        if (this.user && ['/login', '/register', '/home'].includes(this.router.url)) {
          this.router.navigate(['/organizer-dashboard']);
        }

        if (!this.user && this.router.url === '/') {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
