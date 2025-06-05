import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-manage-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  providers:[UploadService],
  templateUrl: './manage-game.component.html',
  styleUrls: ['./manage-game.component.css']
})
export class ManageGameComponent {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  gameForm!: FormGroup;
  isEditMode: boolean = false;
  gameCode: string = '';

  imageFile: File | null = null;
  imageUrl: string = '';

  constructor(private uploadService: UploadService){}

  async ngOnInit() {
    this.initForm();

    this.route.paramMap.subscribe(async params => {
      const code = params.get('code');
      if (code) {
        this.gameCode = code;
        this.isEditMode = true;
        await this.loadGame(code);
      }
    });
  }

  initForm() {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      // Remove gameCode from form controls
      locations: this.fb.array([])
    });
  }

  get locations(): FormArray {
    return this.gameForm.get('locations') as FormArray;
  }

  newLocation(): FormGroup {
    return this.fb.group({
      code: ['', Validators.required],
      type: ['text', Validators.required],
      story: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      hint: [''],
      imageUrl: ['']
    });
  }

  addLocation() {
    this.locations.push(this.newLocation());
  }

  removeLocation(index: number) {
    this.locations.removeAt(index);
  }

  onFileSelected(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.uploadImage(file).then(url => {
      this.locations.at(index).patchValue({ imageUrl: url });
    });
  }

  async uploadImage(file: File): Promise<string> {
    return this.uploadService.uploadImage(file);
  }

  async loadGame(code: string) {
    const ref = doc(this.firestore, `games/${code}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data() as any;
    this.gameForm.patchValue({
      name: data.name,
      gameCode: code
    });

    const locs = Object.values(data.locations || {}) as Location[];
    locs.forEach(loc => this.locations.push(this.fb.group(loc)));
  }

  async saveGame() {
    if (this.gameForm.invalid) return;

    const user = this.authService.currentUserValue;
    const { name, locations } = this.gameForm.value;

    let codeToUse = this.gameCode;
    if (!this.isEditMode) {
      // Generate unique code on create
      codeToUse = await this.generateUniqueCode();
    }

    const locationMap: { [key: number]: Location } = {};
    locations.forEach((loc: Location, i: number) => {
      locationMap[i + 1] = loc;
    });

    const game = {
      name,
      organizerId: user?.uid ?? '',
      locations: locations
    };

    await setDoc(doc(this.firestore, `games/${codeToUse}`), game, { merge: true });

    this.router.navigate(['/organizer-dashboard']);
  }

    // Helper to generate a random 6-char alphanumeric code
  generateGameCode(length = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O,0,I,1 to avoid confusion
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Check if code already exists in Firestore
  async isCodeUnique(code: string): Promise<boolean> {
    const docRef = doc(this.firestore, `games/${code}`);
    const snap = await getDoc(docRef);
    return !snap.exists();
  }

  async generateUniqueCode(): Promise<string> {
    let code = this.generateGameCode();
    let attempts = 0;
    const maxAttempts = 5;
    while (!(await this.isCodeUnique(code))) {
      code = this.generateGameCode();
      attempts++;
      if (attempts >= maxAttempts) throw new Error('Failed to generate unique game code');
    }
    return code;
  }
}
