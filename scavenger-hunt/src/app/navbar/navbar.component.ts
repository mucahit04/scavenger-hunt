import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service'; // adjust path
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports:[TranslateModule, CommonModule, RouterModule],
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  animations: [
    trigger('menuAnimation', [
      state('closed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
        padding: '0',
        paddingBottom:'0.5rem'
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden',
        padding: '*'
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('backdropAnimation',[
      state('closed', style({
        opacity: 0,
        overflow: 'hidden',
      })),
      state('open', style({
        opacity: 1,
        overflow: 'hidden',
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit{
  isMenuOpen = false;
  currentLang = 'en';
  user$!: Observable<User | null>;
  
  languages = [
    { code: 'en', emoji: 'us' },
    { code: 'tr', emoji: 'tr' },
    { code: 'nl', emoji: 'nl' }
  ];

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentLang = translate.currentLang || 'en';
  }
  ngOnInit(): void {
    this.user$ = this.authService.getUser();
    this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectLanguage(code: string) {
    this.translate.use(code);
    this.currentLang = code;
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout(); // implement in your service
    this.toggleMenu()
    this.router.navigate(['/home']);
  }

  get currentEmoji() {
    return this.languages.find(l => l.code === this.currentLang)?.emoji || '🌐';
  }
}
