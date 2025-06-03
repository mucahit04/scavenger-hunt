import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { doc, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

import { PlayerLocationComponent } from '../player-location/player-location.component';
import { Location } from '../../models/location.model';
import { ProgressService } from '../../services/progress.service';
import { dummyGames } from '../../organizer/organizer-dashboard/dummy-games';
import { CompassSpinnerComponent } from '../../shared/compass-spinner/compass-spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    RouterModule,
    PlayerLocationComponent, 
    CompassSpinnerComponent,
    TranslateModule
  ],
  templateUrl: './player-game.component.html',
  styleUrls: ['./player-game.component.css']
})
export class PlayerGameComponent {
  private firestore = inject(Firestore);
  private progressService = inject(ProgressService);

  game = signal<any | null>(null);
  locations = signal<Location[]>([]);
  currentLocationIndex = signal(0);
  username = signal(localStorage.getItem('username') ?? '');
  gameCode = signal(localStorage.getItem('gameCode') ?? '');
  codeInput = signal('');
  error = signal('');
  isGameCompleted = signal(false);
  locationCompleted = signal(false);
  loading = true;

  showLocation = signal(false);

  constructor(private translate: TranslateService){}
  ngOnInit(): void {
    this.loadGame();
    console.log(this.locationCompleted());
  }

  private async loadGame() {
    const ref = doc(this.firestore, `games/${this.gameCode()}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.translate.get('errors.game_not_found').subscribe(msg => {
        this.error.set(msg)});
      return;
    }
    // Load current progress
    try{
      const [index, isCompleted] = await this.progressService.getPlayerProgressIndex(this.gameCode(), this.username());
      this.currentLocationIndex.set(index);
      if(isCompleted){
        this.isGameCompleted.set(true);
        return;
      }
    } finally{
      this.loading = false;
    }

    const data = snap.data();
    this.game.set(data);
    const locationArray: Location[] = Object.values(data['locations'] || {});
    this.locations.set(locationArray);
  }

  checkCode() {
    const entered = this.codeInput().trim().toLowerCase();
    const expected = this.locations()[this.currentLocationIndex()]?.code.toLowerCase();
    if (entered === expected) {
      this.showLocation.set(true);
      this.error.set('');
    } else {
      this.translate.get('errors.incorrect_location_code').subscribe(msg => {
        this.error.set(msg)});
    }
  }

  async handleLocationCompleted() {
    const nextIndex = this.currentLocationIndex() + 1;

    const completed = nextIndex >= this.locations().length;
    this.isGameCompleted.set(completed);

    await this.progressService.saveProgress(this.gameCode(), this.username(), nextIndex, completed);

    if (!completed) {
      this.locationCompleted.set(true);
      this.showLocation.set(false);
    }
  }

  get hint(): string {
    return this.locations()[this.currentLocationIndex()]?.hint ?? '';
  }
  
  get image(): string | null {
    return this.locations()[this.currentLocationIndex()]?.imageUrl ?? null;
  }

  get hasMoreLocations(): boolean {
    return (this.currentLocationIndex() +1 < this.locations().length);
  }

  toNextLocation() {
    if (this.hasMoreLocations) {
      this.currentLocationIndex.update(index => index + 1);
      this.locationCompleted.set(false);
      this.codeInput.set('');
      this.error.set('');
    } else {
      this.isGameCompleted.set(true);
    }
  }
}
