import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
    });
  }

  async register(email: string, password: string, group: string) {
    const cred = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await this.db.collection('groups').doc(group).set({ name: group }, { merge: true });
    localStorage.setItem('group', group);
    return this.router.navigate(['/home']);
  }

  async login(email: string, password: string, group: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password);
    localStorage.setItem('group', group);
    return this.router.navigate(['/home']);
  }

  logout() {
    this.afAuth.signOut();
    localStorage.removeItem('group');
    this.router.navigate(['/login']);
  }

  getGroup(): string | null {
    return localStorage.getItem('group');
  }

  getUser() {
    return this.currentUser;
  }
}
