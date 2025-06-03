import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '../../models/location.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-player-location',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './player-location.component.html',
  styleUrls: ['./player-location.component.css']
})
export class PlayerLocationComponent implements OnInit{
  @Input() location!: Location;
  @Input() index!: number;
  
  @Output() locationCompleted = new EventEmitter<void>();
  
  inputAnswer: string = '';
  feedbackMessage: string = '';
  completed: boolean = false;

  constructor() {}
  
  ngOnInit(): void {
  }

  submitAnswer() {
    if (this.inputAnswer.trim().toLowerCase() === this.location.answer.trim().toLowerCase()) {
      this.locationCompleted.emit();
      this.feedbackMessage = '';
    } else {
      this.feedbackMessage = 'Incorrect answer. Try again!';
    }
  }
}
