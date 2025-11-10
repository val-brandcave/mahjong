import { LessonData } from './lessons.types';

export const lesson01: LessonData = {
  metadata: {
    id: 1,
    code: 'LESSON-01',
    title: 'Welcome to Mahjong',
    phase: 'Foundation',
    priority: 'MVP Core',
    duration: '3-5 minutes',
    difficulty: 'Beginner',
    prerequisites: [],
    unlocks: 2,
    starRequirement: 0,
    premiumOnly: false,
  },
  
  screens: [
    // Screen 1: Welcome Hero
    {
      screenNum: 1,
      type: 'hero',
      title: 'Welcome to Mahjong!',
      text: "You're about to learn one of the most fun and social games around. Let's get started!",
      visual: 'welcome-splash', // placeholder
      button: 'Begin Lesson',
    },
    
    // Screen 2: What is Mahjong?
    {
      screenNum: 2,
      type: 'video',
      title: 'What is Mahjong?',
      narration: "Mahjong is a tile-based game played with four players. It's social, fun, and mentally stimulating - which is why it's become so popular! American Mahjong is a special version created in the 1930s and is now experiencing a huge renaissance. You might have heard it called the 'next Pickleball' or 'next Bunko' - and it's true! Everyone's learning it. The best part? It looks complicated, but we're going to teach you step-by-step, so you'll feel confident in no time.",
      text: [
        'Mahjong is a tile-based game for 4 players',
        'Social, fun, and mentally stimulating',
        'The trending game everyone\'s learning',
        'Looks complex, but you CAN learn it!',
      ],
      visual: 'four-friends-playing', // placeholder
    },
    
    // Screen 3: The Goal
    {
      screenNum: 3,
      type: 'content',
      title: 'The Goal of Mahjong',
      narration: "The goal of Mahjong is simple: match your tiles to a specific pattern shown on the card. Everyone starts with 13 tiles. Throughout the game, you'll draw and discard tiles, trying to create one of the patterns on the card. The first person to complete their pattern wins! Think of it like making a specific poker hand, but with tiles instead of cards.",
      text: [
        'The Goal: Match your tiles to a pattern',
        'Start with 13 tiles',
        'Draw and discard to build your pattern',
        'First to complete wins!',
      ],
      visual: 'goal-animation', // placeholder
    },
    
    // Screen 4: What Makes It Special? (Interactive Card Flip)
    {
      screenNum: 4,
      type: 'interactive',
      title: 'What Makes It Special?',
      interactiveType: 'card-flip',
      interactiveData: {
        requireAll: true,
        cards: [
          {
            id: 'card-1',
            front: { icon: '🎴', text: '152 Tiles' },
            back: { text: 'American Mahjong uses 152 tiles including Jokers (wild cards)' },
          },
          {
            id: 'card-2',
            front: { icon: '🔄', text: 'The Charleston' },
            back: { text: 'Unique tile-passing phase before gameplay begins' },
          },
          {
            id: 'card-3',
            front: { icon: '📄', text: 'The Annual Card' },
            back: { text: 'New patterns released every April by the National Mahjong League' },
          },
          {
            id: 'card-4',
            front: { icon: '🧠🎲', text: 'Strategy & Luck' },
            back: { text: 'Combines strategic thinking with exciting chance' },
          },
        ],
      },
      narration: "American Mahjong has some unique features that make it special. It uses 152 tiles, including Jokers that act as wild cards. Before playing, there's a phase called the 'Charleston' where you pass tiles with other players. The patterns you're trying to make come from the National Mahjong League card, which changes every year with new challenges. Best of all, it's a perfect mix of strategy and luck - so every game is exciting and different!",
    },
    
    // Screen 5: Why You'll Love It (Icon Appear)
    {
      screenNum: 5,
      type: 'interactive',
      title: "Here's why millions of people love Mahjong:",
      interactiveType: 'icon-appear',
      interactiveData: {
        icons: [
          { id: 'social', emoji: '🎉', text: 'Social & Fun', detail: 'Play with friends and make new ones' },
          { id: 'mental', emoji: '🧠', text: 'Mental Workout', detail: 'Keep your mind sharp and engaged' },
          { id: 'beautiful', emoji: '✨', text: 'Beautiful Design', detail: 'Gorgeous tiles and accessories' },
          { id: 'different', emoji: '🎲', text: 'Always Different', detail: 'Every game is a new challenge' },
          { id: 'competition', emoji: '🏆', text: 'Exciting Competition', detail: 'Friendly competition with friends' },
          { id: 'relaxing', emoji: '☕', text: 'Relaxing Hobby', detail: 'Enjoyable way to spend time' },
        ],
      },
      narration: "Here's why millions of people love Mahjong: It's incredibly social - you'll play with friends and make new ones. It keeps your mind sharp with fun mental challenges. The tiles and accessories are absolutely beautiful. Every game is different and exciting. You'll enjoy friendly competition. And it's a wonderfully relaxing hobby. Ready to learn? Let's get started!",
    },
    
    // Screen 6: You're Ready (Progress Roadmap)
    {
      screenNum: 6,
      type: 'interactive',
      title: "You're ready to start learning!",
      interactiveType: 'progress-roadmap',
      interactiveData: {
        currentLesson: 1,
        totalLessons: 8,
        upcomingTopics: [
          'The 152 tiles and what they mean',
          'How to set up the game',
          'The Charleston (we\'ll make it easy!)',
          'How to read the card',
          'How to play and win',
        ],
      },
      text: "Remember: Mahjong looks complicated at first, but thousands of people just like you have learned it. You've got this!",
      narration: "You're ready to start learning! In the next lessons, you'll learn about the 152 tiles, how to set up the game, the Charleston - and don't worry, we'll make it easy - how to read the card, and how to play and win. Remember: Mahjong looks complicated at first, but thousands of people just like you have learned it successfully. You've got this! Let's start with the tiles...",
      button: 'Continue to Quiz',
    },
  ],
  
  quiz: [
    {
      id: 'q1',
      question: 'What is the main goal of Mahjong?',
      options: [
        { id: 'a', text: 'Collect the most tiles', correct: false },
        { id: 'b', text: 'Match your tiles to a pattern on the card', correct: true },
        { id: 'c', text: 'Get rid of all your tiles first', correct: false },
        { id: 'd', text: 'Memorize the entire card', correct: false },
      ],
      correctFeedback: "Exactly! You're trying to match your tiles to one of the patterns on the card.",
      incorrectFeedback: "Not quite. Remember: you're trying to match your tiles to a specific pattern shown on the card.",
    },
    {
      id: 'q2',
      question: 'How many players are in a game of Mahjong?',
      options: [
        { id: 'a', text: '2 players', correct: false },
        { id: 'b', text: '3 players', correct: false },
        { id: 'c', text: '4 players', correct: true },
        { id: 'd', text: 'As many as you want', correct: false },
      ],
      correctFeedback: "That's right! Mahjong is always played with 4 players.",
      incorrectFeedback: 'Almost! Mahjong is played with 4 players at a table.',
    },
    {
      id: 'q3',
      question: 'What makes American Mahjong unique?',
      options: [
        { id: 'a', text: 'It uses more tiles and includes the Charleston', correct: true },
        { id: 'b', text: "It's played with cards instead of tiles", correct: false },
        { id: 'c', text: "It doesn't require strategy", correct: false },
        { id: 'd', text: 'Only one person can win', correct: false },
      ],
      correctFeedback: 'Perfect! American Mahjong has 152 tiles, Jokers, and the unique Charleston phase.',
      incorrectFeedback: "Not exactly. American Mahjong is special because it has 152 tiles (including Jokers) and includes the Charleston tile-passing phase.",
    },
  ],
  
  confidenceRating: {
    question: 'How confident do you feel about learning Mahjong?',
    options: [
      { value: 'nervous', emoji: '😰', text: 'Nervous - it seems really complicated' },
      { value: 'uncertain', emoji: '😐', text: 'Uncertain - but willing to try' },
      { value: 'cautious', emoji: '🙂', text: 'Cautiously optimistic' },
      { value: 'excited', emoji: '😊', text: 'Excited - let\'s do this!' },
    ],
    response: "That's completely normal! Remember: we'll teach you step-by-step, and you can review lessons anytime. Thousands of people just like you have learned Mahjong successfully.",
  },
  
  rewards: {
    baseXP: 100,
    starBonusXP: { 1: 0, 2: 25, 3: 50 },
    nextLessonUnlock: 2,
    badge: 'Welcome Complete!',
  },
};

