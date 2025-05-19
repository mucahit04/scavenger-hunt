import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ManageGameComponent } from './organizer/manage-game/manage-game.component';
import { OrganizerDashboardComponent } from './organizer/organizer-dashboard/organizer-dashboard.component';
import { PlayerGameComponent } from './player/player-game/player-game.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'manage-game/:code', component: ManageGameComponent },
  { path: 'manage-game', component: ManageGameComponent },
  { path: 'organizer-dashboard', component: OrganizerDashboardComponent },
  { path: 'play/:gameCode', component: PlayerGameComponent }
];
