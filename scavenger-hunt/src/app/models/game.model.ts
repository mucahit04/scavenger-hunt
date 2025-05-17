import { Location } from './location.model';

export interface Game {
  gameCode?: string;       // Firestore doc ID (auto-generated or manual)
  name: string;
  organizerId: string;
  locations: Location[];
  createdAt?: Date;
}