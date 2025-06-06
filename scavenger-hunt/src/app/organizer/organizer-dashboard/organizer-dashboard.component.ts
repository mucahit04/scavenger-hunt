import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Firestore, collection, getDocs, query, where, doc, getDoc, writeBatch, addDoc, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { dummyGames } from './dummy-games';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';


@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css'],
})
export class OrganizerDashboardComponent implements OnInit {
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly ngZone = inject(NgZone);

  organizerId: string = '';
  games: any[] = [];
  expandedGameCode: string | null = null;
  playerMap: { [gameCode: string]: any[] } = {};
  players: {}= {};

  async ngOnInit(): Promise<void> {
    this.authService.getUser().pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/']);
        return;
      }

      this.organizerId = user.uid;
      this.fetchGames();
    });
  }
  
  async fetchGames(): Promise<void> {
    const gamesRef = collection(this.firestore, 'games');
    const q = query(gamesRef, where('organizerId', '==', this.organizerId));

    const snapshot = await getDocs(q);

    this.ngZone.run(() => {
      this.games = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          gameCode: doc.id,
          totalLocations: Object.keys(data['locations'] || {}).length,
          ...data
        };
      });
    });
  }

  toggleGameDetails(game: any): void {
    if (this.expandedGameCode === game.gameCode) {
      this.expandedGameCode = null;
    } else {
      this.expandedGameCode = game.gameCode;
      this.fetchPlayersForGame(game);
    }
  }

  isExpanded(gameCode:string): boolean{
    return this.expandedGameCode === gameCode;
  }

  async fetchPlayersForGame(game: any) {

    const playersRef = collection(this.firestore, `games/${game.gameCode}/players`);
    const querySnapshot = await getDocs(playersRef);

    this.playerMap[game.gameCode] = querySnapshot.docs.map(doc => ({
      username: doc.id,
      ...doc.data()
    }));
    this.players = game.players;
    console.log(game.players);
  }

  getPlayerProgress(player: any, totalLocations: number): string {
    if (player.progress) {
      const completed = Object.values(player.progress).filter((v: any) => v).length;
      return `${completed} / ${totalLocations}`;
    }
    return `0 / ${totalLocations}`;
  }

  getPlayerTime(player: any): string {
    return player.time ? `${player.time} mins` : 'Not started';
  }

  createGame(): void {
    this.router.navigate(['/manage-game']);
  }

  editGame(gameCode: string): void {
    this.router.navigate(['/manage-game', gameCode]);
  }

  async deleteGame(gameCode: string): Promise<void> {
    const confirmDelete = confirm(`Are you sure you want to delete the game "${gameCode}"? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      // Delete all players in the subcollection
      const playersRef = collection(this.firestore, `games/${gameCode}/players`);
      const playersSnapshot = await getDocs(playersRef);
      const batch = writeBatch(this.firestore);

      playersSnapshot.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });

      // Delete the game document
      const gameDocRef = doc(this.firestore, 'games', gameCode);
      batch.delete(gameDocRef);

      await batch.commit();

      // Refresh game list
      await this.fetchGames();
      if (this.expandedGameCode === gameCode) {
        this.expandedGameCode = null;
      }

      alert(`Game "${gameCode}" deleted.`);
    } catch (err) {
      console.error('Failed to delete game:', err);
      alert('Something went wrong while deleting the game.');
    }
  }

}
