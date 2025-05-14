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
  enteredCode = '';
  codeVerified = false;
  hint = '';

  // Dummy data for dev
  locationsData: any = {
    1: {
      code: 'KEY123',
      type: 'text',
      content: 'This is a clue: I have keys but no locks. What am I?',
      question: 'What has keys but can’t open locks?',
      answer: 'piano',
      hint: 'Look under the old tree near the playground.'
    },
    2: {
      code: 'VIDEO456',
      type: 'video',
      content: 'https://www.w3schools.com/html/mov_bbb.mp4',
      question: 'What color is the car in the video?',
      answer: 'red',
      hint: 'Next location is where the sun hits first in the morning.'
    },
    3: {
      code: 'FINAL789',
      type: 'text',
      content: 'You’ve made it to the final location!',
      question: 'Type the word "finish" to complete the hunt',
      answer: 'finish',
      hint: 'Congratulations! You’ve completed the hunt.'
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

  verifyCode() {
    if (this.enteredCode.trim().toUpperCase() === this.content.code.toUpperCase()) {
      this.codeVerified = true;
      this.feedback = '';
    } else {
      this.feedback = 'Incorrect code. Try again.';
      this.codeVerified = false;
    }
  }

  async checkAnswer() {
    if (this.userAnswer.trim().toLowerCase() === this.content.answer.toLowerCase()) {
      this.feedback = 'Correct! You can proceed.';
      this.isCorrect = true;
      this.hint = this.content.hint;
      await this.progress.markComplete(this.locationId);
    } else {
      this.feedback = 'Incorrect, try again!';
      this.isCorrect = false;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
