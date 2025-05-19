export const dummyGames = [
    {
      gameCode: 'test123',
      name: 'Test Scavenger Hunt',
      organizerId: 'dummy-organizer-uid',
      locations: {
        "1": {
          code: "LOC1",
          type: "text",
          keyword: "kurban",
          question: "What color is the bench closest to the tree?",
          answer: "green",
          hint: "Walk past the fountain and follow the gravel path."
        },
        "2": {
          code: "LOC2",
          type: "text",
          keyword: "Hz. Ismail",
          question: "How many steps lead up to the monument?",
          answer: "12",
          hint: "Look behind the monument for your next clue."
        },
        "3": {
          code: "LOC3",
          type: "text",
          keyword: "Hac",
          question: "What is written on the plaque next to the door?",
          answer: "Knowledge is power",
          hint: "You've completed the hunt! 🎉"
        }
      },
      progress: {
        // Example of dummy player progress
        player1: { "1": true, "2": true },
        player2: { "1": true }
      }
    }
  ];