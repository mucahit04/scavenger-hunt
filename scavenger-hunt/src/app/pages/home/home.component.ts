import { Component } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  locations = [1, 2, 3];
  completed: { [key: string]: boolean } = {};

  constructor(private progress: ProgressService, private router: Router) {}

  async ngOnInit() {
    console.log('HomeComponent initialized');
    this.locations = await this.progress.getPath();
    console.log('Locations:', this.locations);
    // this.completed = await this.progress.getCompleted();
    this.completed = {
      1: true,
      2: false,
      3: false
    };
  }

  goToLocation(locId: number) {
    this.router.navigate(['/location', locId]);
  }
}
