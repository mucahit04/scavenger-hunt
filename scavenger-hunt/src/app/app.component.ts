import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { filter, take } from 'rxjs';

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
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.translate.use(savedLang);
    }

    this.authService.getUser()
      .pipe(
        filter(user => user !== undefined), // ensure initial undefined values are skipped if any
        take(1) // only take the first emitted user value after auth state settles
      )
      .subscribe(user => {
        this.user = user;

        if (!user) {
          // Not logged in: redirect root or unknown to /home
          if (['/', ''].includes(this.router.url)) {
            this.router.navigate(['/home']);
          }
        } else {
          // Logged in: redirect login, register, home to dashboard
          if (['/', '', '/login', '/register', '/home'].includes(this.router.url)) {
            this.router.navigate(['/organizer-dashboard']);
          }
        }
      });

    // Optionally, react to subsequent navigation events if needed
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Instead of assigning an observable, subscribe here as well or use async pipe in templates
        this.authService.getUser().pipe(take(1)).subscribe(user => {
          this.user = user;

          if (user && ['/login', '/register', '/home'].includes(this.router.url)) {
            this.router.navigate(['/organizer-dashboard']);
          }

          if (!user && this.router.url === '/') {
            this.router.navigate(['/home']);
          }
        });
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
