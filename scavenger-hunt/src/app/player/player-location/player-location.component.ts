import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '../../models/location.model';
import { SafeUrlPipe } from '../../shared/safe-url.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  
  safeVideoUrl: SafeResourceUrl | null = null;
  inputAnswer: string = '';
  feedbackMessage: string = '';
  completed: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit(): void {
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

  private sanitizeAndConvertYouTubeUrl(url: string): SafeResourceUrl {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w\-]+)/);
    const embedUrl = match && match[1]
      ? `https://www.youtube.com/embed/${match[1]}`
      : url;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
