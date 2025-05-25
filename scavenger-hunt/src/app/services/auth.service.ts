import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, setDoc, doc, serverTimestamp } from '@angular/fire/firestore';
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

  async register(email: string, password: string, name: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    // Create organizer profile in Firestore
    await setDoc(doc(this.db, `organizers/${cred.user.uid}`), {
      email: cred.user.email,
      role: 'organizer',  // optional
      displayName: name,    // optional future use
      createdAt: serverTimestamp() // Use this instead of `new Date()`
    }, { merge: true });
    return cred.user;
  }

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser = null;
    await this.router.navigate(['/']);
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Dev helpers
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
