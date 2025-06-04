import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TranslateModule, FormsModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Scavenger Hunt';
  user: any = null;
  currentLang: string = "en"
  dropdownOpen = false;

  languages = [
    { code: 'en' },
    { code: 'tr' },
    { code: 'nl' }
  ];

  constructor(private authService: AuthService, 
    private router: Router, 
    private translate: TranslateService) {
      const savedLang = localStorage.getItem('lang') || translate.getDefaultLang();
      this.translate.use(savedLang);
      this.currentLang = savedLang;
    }

  ngOnInit() {
    document.body.classList.remove('loading');
    this.user = this.authService.getUser();
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.translate.use(savedLang);
    }
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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.dropdownOpen = false;
  }

  getFlag(code: string): string {
    const flags: { [key: string]: string } = {
      en: '🇬🇧',
      tr: '🇹🇷',
      nl: '🇳🇱'
    };
    return flags[code] || '🏳️';
  }

  logout() {
    this.authService.logout();
  }

  // changeLanguage(event: Event){
  //   const lang = (event.target as HTMLSelectElement).value;
  //   this.translate.use(lang);
  //   localStorage.setItem('lang', lang);
  // }
}
