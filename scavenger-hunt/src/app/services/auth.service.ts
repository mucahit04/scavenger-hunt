import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: any = null;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async register(email: string, password: string, group: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.db, `groups/${group}`), { name: group }, { merge: true });
    localStorage.setItem('group', group);
    return this.router.navigate(['/home']);
  }

  async login(email: string, password: string, group: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    localStorage.setItem('group', group);
    return this.router.navigate(['/home']);
  }

  logout() {
    signOut(this.auth);
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
