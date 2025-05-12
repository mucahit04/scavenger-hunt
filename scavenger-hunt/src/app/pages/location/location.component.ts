import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  locationId!: number;
  content: any;
  userAnswer = '';
  feedback = '';
  isCorrect = false;

  locationsData: any = {
    1: {
      type: 'text',
      content: 'This is a clue: I have keys but no locks. What am I?',
      question: 'What has keys but can’t open locks?',
      answer: 'piano'
    },
    2: {
      type: 'video',
      content: 'https://www.w3schools.com/html/mov_bbb.mp4',
      question: 'What color is the car in the video?',
      answer: 'red'
    },
    3: {
      type: 'text',
      content: 'You’ve made it to the final location!',
      question: 'Type the word "finish" to complete the hunt',
      answer: 'finish'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progress: ProgressService
  ) {}

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.paramMap.get('id')!;
    this.content = this.locationsData[this.locationId];
  }

  async checkAnswer() {
    if (this.userAnswer.trim().toLowerCase() === this.content.answer.toLowerCase()) {
      this.feedback = 'Correct! You can proceed.';
      this.isCorrect = true;
      await this.progress.markComplete(this.locationId);
    } else {
      this.feedback = 'Incorrect, try again!';
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
