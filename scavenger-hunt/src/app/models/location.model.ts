export interface Location {
  code: string;           // Unique code identifier for the location
  type: 'text';           // Type of the clue (could extend later to 'image', 'video', etc.)
  keyword: string;        // The clue content (text, e.g., a riddle or direction)
  imageUrl?: string;      // Optional image clue for the location
  question: string;       // Question to be answered at this location
  answer: string;         // Correct answer for the question
  hint?: string;          // Optional hint for the next location
}
