import { LessonData } from './lessons.types';

export const lesson03: LessonData = {
  metadata: {
    id: 3,
    code: 'LESSON-03',
    title: 'Building the Walls',
    phase: 'Setup & Structure',
    priority: 'MVP Core',
    duration: '5-7 minutes',
    difficulty: 'Beginner',
    prerequisites: ['LESSON-02'],
    unlocks: 4,
    starRequirement: 0,
    premiumOnly: false,
  },
  
  screens: [
    // Screen 1: Introduction to Walls
    {
      screenNum: 1,
      type: 'hero',
      title: 'Building the Walls',
      text: "Before you can play Mahjong, you need to build the 'walls.' These are stacks of face-down tiles that form a square in the center of the table. Let's learn how!",
      visual: 'walls-overhead',
      button: 'Show Me How',
    },
    
    // Screen 2: Wall Dimensions
    {
      screenNum: 2,
      type: 'content',
      title: 'Wall Size',
      text: [
        '19 pairs of tiles (length)',
        '2 tiles high (stacked)',
        'Total: 38 tiles per wall',
        'With 4 players, that\'s 152 tiles total!',
      ],
      visual: 'wall-dimensions',
      narration: "Let's look at one wall up close. Each wall is 19 tiles long and 2 tiles high. That means you'll stack 19 pairs of tiles in a row - giving you 38 tiles per wall. Since there are 4 players, 4 walls of 38 tiles each equals all 152 tiles!",
    },
    
    // Screen 3: How to Stack - Step by Step
    {
      screenNum: 3,
      type: 'interactive',
      title: 'How to Build Your Wall',
      interactiveType: 'icon-appear',
      interactiveData: {
        icons: [
          { 
            id: 'step1', 
            emoji: '1️⃣', 
            text: 'Gather Tiles', 
            detail: 'Each player takes 38 tiles from the center' 
          },
          { 
            id: 'step2', 
            emoji: '2️⃣', 
            text: 'Flip Face-Down', 
            detail: 'Turn all your tiles face-down so backs are showing' 
          },
          { 
            id: 'step3', 
            emoji: '3️⃣', 
            text: 'Stack in Pairs', 
            detail: 'Stack two tiles on top of each other to make pairs' 
          },
          { 
            id: 'step4', 
            emoji: '4️⃣', 
            text: 'Make 19 Pairs', 
            detail: 'Create 19 stacked pairs total' 
          },
          { 
            id: 'step5', 
            emoji: '5️⃣', 
            text: 'Arrange in Line', 
            detail: 'Place all 19 pairs in a straight row in front of you' 
          },
          { 
            id: 'step6', 
            emoji: '✅', 
            text: 'Wall Complete!', 
            detail: 'You\'ve built your wall - 19 tiles long, 2 tiles high' 
          },
        ],
      },
      narration: "Here's how to build your wall step-by-step. First, take 38 tiles and flip them face-down. Then, stack them in pairs - two tiles on top of each other. Make 19 of these pairs. Finally, arrange all 19 pairs in a straight line in front of you. That's it - you've built your wall!",
    },
    
    // Screen 4: Directional Positions
    {
      screenNum: 4,
      type: 'content',
      title: 'Player Positions',
      text: [
        'East (dealer): Starting position',
        'South: To East\'s right',
        'West: Across from East',
        'North: To East\'s left',
        'Players sit counter-clockwise around the table',
      ],
      visual: 'player-positions',
      narration: "Each player has a directional position. East is the dealer and sits in the starting position. South is to East's right, West sits across from East, and North is to East's left. The positions go counter-clockwise around the table.",
    },
    
    // Screen 5: Pushing Walls Together
    {
      screenNum: 5,
      type: 'content',
      title: 'Pushing Walls Together',
      text: [
        'Each player builds their wall in front of them',
        'Walls are pushed toward the center',
        'They form a square "cage" of tiles',
        'Small gaps remain at the corners',
      ],
      visual: 'walls-together',
      narration: "Once all four players have built their walls, everyone pushes their wall toward the center of the table. The four walls come together to form a square - like a cage made of tiles. This square is where the game begins!",
    },
    
    // Screen 6: Breaking the Wall
    {
      screenNum: 6,
      type: 'content',
      title: 'Breaking the Wall',
      text: [
        'After building, one wall will be "broken" for dealing',
        'East rolls dice to determine where to break',
        'Tiles are dealt starting from the break point',
        'We\'ll learn the dealing process in the next lesson!',
      ],
      visual: 'breaking-wall',
      narration: "After the walls are pushed together, one wall needs to be 'broken' so tiles can be dealt. The East player rolls dice to determine where the break happens. Tiles are then dealt starting from that break point. Don't worry - we'll cover the full dealing process in the next lesson!",
      button: 'Continue to Quiz',
    },
  ],
  
  quiz: [
    {
      id: 'q1',
      question: 'How many tiles long is each wall?',
      options: [
        { id: 'a', text: '15 tiles', correct: false },
        { id: 'b', text: '17 tiles', correct: false },
        { id: 'c', text: '19 tiles', correct: true },
        { id: 'd', text: '21 tiles', correct: false },
      ],
      correctFeedback: "Perfect! Each wall is 19 tiles long.",
      incorrectFeedback: "Not quite. Each wall is 19 tiles (pairs) long and 2 tiles high.",
    },
    {
      id: 'q2',
      question: 'How many tiles does each player use to build their wall?',
      options: [
        { id: 'a', text: '36 tiles', correct: false },
        { id: 'b', text: '38 tiles', correct: true },
        { id: 'c', text: '40 tiles', correct: false },
        { id: 'd', text: '42 tiles', correct: false },
      ],
      correctFeedback: "That's right! Each player uses 38 tiles to build their wall (19 pairs × 2 tiles high).",
      incorrectFeedback: "Almost! Each player uses 38 tiles - that's 19 pairs stacked 2 tiles high.",
    },
    {
      id: 'q3',
      question: 'Where is the South player seated in relation to East?',
      options: [
        { id: 'a', text: 'To East\'s right', correct: true },
        { id: 'b', text: 'To East\'s left', correct: false },
        { id: 'c', text: 'Across from East', correct: false },
        { id: 'd', text: 'Behind East', correct: false },
      ],
      correctFeedback: "Excellent! South sits to East's right, and positions go counter-clockwise.",
      incorrectFeedback: "Remember: positions go counter-clockwise. South is to East's right, West is across, and North is to East's left.",
    },
  ],
  
  rewards: {
    baseXP: 100,
    starBonusXP: { 1: 0, 2: 25, 3: 50 },
    nextLessonUnlock: 4,
    badge: 'Wall Builder!',
  },
};

