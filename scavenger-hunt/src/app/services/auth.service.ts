import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, setDoc, doc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.setUser(user);
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
    this.setUser(null);
    await this.router.navigate(['/']);
  }

  getUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  setUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Dev helpers
  simulateOrganizerLogin(): void {
    const userDummy = {
      uid: 'dummy-organizer-uid',
      email: 'organizer@test.com',
      displayName: 'Test Organizer',
      isDummy: true
    } as any;
    this.setUser(userDummy)
  }

  clearDummyLogin(): void {
    this.setUser(null);
  }
}
