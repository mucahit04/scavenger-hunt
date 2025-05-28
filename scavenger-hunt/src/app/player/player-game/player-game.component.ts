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

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PlayerLocationComponent, CompassSpinnerComponent],
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
  loading = true;

  showLocation = signal(false);

  ngOnInit(): void {
    this.loadGame();
  }

  private async loadGame() {
    const ref = doc(this.firestore, `games/${this.gameCode()}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      this.error.set('Game not found.');
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
      this.error.set('Incorrect code. Try again.');
    }
  }

  async handleLocationCompleted() {
    let nextIndex = this.currentLocationIndex();
    if(this.hasMoreLocations){
      this.isGameCompleted.set(false);
      nextIndex = this.currentLocationIndex() + 1;
      this.currentLocationIndex.set(nextIndex);
      this.codeInput.set('');
    }
    if(nextIndex > this.locations().length){
      this.isGameCompleted.set(true);
    }
    await this.progressService.saveProgress(this.gameCode(), this.username(), nextIndex, this.isGameCompleted());
    this.showLocation.set(false);
  }

  nextLocation(){
    this.currentLocationIndex.update(value => value + 1);
  }

  get hint(): string {
    return this.locations()[this.currentLocationIndex()]?.hint ?? '';
  }

  get hasMoreLocations(): boolean {
    return this.currentLocationIndex() < this.locations().length;
  }
}
