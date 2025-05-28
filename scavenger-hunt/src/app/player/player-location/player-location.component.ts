import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-player-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-location.component.html',
  styleUrls: ['./player-location.component.css']
})
export class PlayerLocationComponent implements OnInit{
  @Input() location!: Location;
  @Input() index!: number;
  
  @Output() locationCompleted = new EventEmitter<void>();
  @Output() nextLocation = new EventEmitter<void>();
  
  inputAnswer: string = '';
  feedbackMessage: string = '';
  completed: boolean = false;

  constructor() {}
  
  ngOnInit(): void {
    console.log(this.location);
  }

  submitAnswer() {
    if (this.inputAnswer.trim().toLowerCase() === this.location.answer.trim().toLowerCase()) {
      this.completed = true;
      this.feedbackMessage = '';
      this.locationCompleted.emit();
    } else {
      this.feedbackMessage = 'Incorrect answer. Try again!';
    }
  }

  toNextLocation(){
    this.nextLocation.emit();
  }
}
