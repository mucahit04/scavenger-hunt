export interface Location {
  code: string;          // Unique code identifier for the location
  type: 'text'; // Type of the clue (could extend later)
  keyword: string;        // The clue content (text or video URL)
  question: string;       // Question to be answered at this location
  answer: string;         // Correct answer for the question
  hint?: string;          // Optional hint for the player
}