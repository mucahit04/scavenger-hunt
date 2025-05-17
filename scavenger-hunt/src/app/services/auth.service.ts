import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: User | null = null;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    // Optionally create organizer profile in Firestore
    await setDoc(doc(this.db, `organizers/${cred.user.uid}`), {
      email: cred.user.email,
      createdAt: new Date()
    }, { merge: true });
    return this.router.navigate(['/organizer-dashboard']);
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    return this.router.navigate(['/organizer-dashboard']);
  }

  logout() {
    signOut(this.auth);
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  getUser() {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  /** 🔧 For testing: simulate a logged-in organizer */
  simulateOrganizerLogin(): void {
    this.currentUser = {
      uid: 'dummy-organizer-uid',
      email: 'organizer@test.com',
      displayName: 'Test Organizer',
      isDummy: true
    } as any;
  }

  clearDummyLogin(): void {
    this.currentUser = null;
  }
}
