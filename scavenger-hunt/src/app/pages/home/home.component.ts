import { Component } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  locations = [1, 2, 3];
  completed: { [key: string]: boolean } = {};

  constructor(private progress: ProgressService, private router: Router) {}

  async ngOnInit() {
    this.completed = await this.progress.getCompleted();
  }

  goToLocation(locId: number) {
    this.router.navigate(['/location', locId]);
  }
}
