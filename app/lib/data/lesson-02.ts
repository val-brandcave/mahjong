import { LessonData } from './lessons.types';

export const lesson02: LessonData = {
  metadata: {
    id: 2,
    code: 'LESSON-02',
    title: 'Know Your Tiles',
    phase: 'Foundation',
    priority: 'MVP Core',
    duration: '5-8 minutes',
    difficulty: 'Beginner',
    prerequisites: ['LESSON-01'],
    unlocks: 3,
    starRequirement: 0,
    premiumOnly: false,
  },
  
  screens: [
    // Screen 1: Introduction
    {
      screenNum: 1,
      type: 'hero',
      title: 'Know Your Tiles',
      text: "American Mahjong uses 152 tiles. That sounds like a lot, but don't worry - they're organized into simple categories. Let's explore each type!",
      visual: 'tiles-overview',
      button: 'Explore the Tiles',
    },
    
    // Screen 2: Tile Categories Overview
    {
      screenNum: 2,
      type: 'interactive',
      title: 'Tile Categories',
      interactiveType: 'card-flip',
      interactiveData: {
        requireAll: true,
        cards: [
          {
            id: 'bamboo',
            front: { icon: '🎋', text: 'Bamboo (Bams)' },
            back: { text: '36 tiles • Numbers 1-9 • Four of each number • Green bamboo stick designs' },
          },
          {
            id: 'character',
            front: { icon: '字', text: 'Characters (Craks)' },
            back: { text: '36 tiles • Numbers 1-9 • Four of each number • Chinese character designs' },
          },
          {
            id: 'dot',
            front: { icon: '⚫', text: 'Dots' },
            back: { text: '36 tiles • Numbers 1-9 • Four of each number • Circular dot designs' },
          },
          {
            id: 'winds',
            front: { icon: '🧭', text: 'Winds' },
            back: { text: '16 tiles • East, South, West, North • Four of each direction' },
          },
          {
            id: 'dragons',
            front: { icon: '🐉', text: 'Dragons' },
            back: { text: '12 tiles • Red, Green, White • Four of each color' },
          },
          {
            id: 'special',
            front: { icon: '🌸', text: 'Flowers & Jokers' },
            back: { text: '16 tiles • 8 Flowers (unique) • 8 Jokers (wild cards)' },
          },
        ],
      },
      narration: "The 152 tiles are organized into 6 simple categories. We have three suits - Bamboo, Characters, and Dots - each with 36 tiles. Then we have honor tiles: Winds and Dragons. Finally, we have special tiles: Flowers and Jokers. Let's explore each category!",
    },
    
    // Screen 3: The Three Suits
    {
      screenNum: 3,
      type: 'content',
      title: 'The Three Suits',
      text: [
        'Bamboo (Bams) - 36 tiles with green bamboo designs',
        'Characters (Craks) - 36 tiles with Chinese characters',
        'Dots - 36 tiles with circular dot patterns',
        'Each suit has numbers 1-9, with four of each number',
      ],
      visual: 'three-suits',
      narration: "The three suits are the heart of Mahjong. Bamboo tiles show bamboo sticks, Character tiles have Chinese characters, and Dot tiles display circles. Each suit has tiles numbered 1 through 9, and there are 4 of each number. That's 36 tiles per suit, or 108 total for all three suits!",
    },
    
    // Screen 4: Honor Tiles - Winds & Dragons
    {
      screenNum: 4,
      type: 'content',
      title: 'Honor Tiles',
      text: [
        'Winds: East, South, West, North (4 of each = 16 tiles)',
        'Dragons: Red, Green, White/Soap (4 of each = 12 tiles)',
        'Honor tiles don\'t have numbers',
        'They\'re powerful for certain winning patterns',
      ],
      visual: 'honor-tiles',
      narration: "In addition to suits, we have honor tiles. The Winds represent the four directions - East, South, West, and North. The Dragons come in three colors: Red, Green, and White (sometimes called Soap). There are 4 of each, giving us 16 Wind tiles and 12 Dragon tiles.",
    },
    
    // Screen 5: Special Tiles
    {
      screenNum: 5,
      type: 'content',
      title: 'Flowers & Jokers',
      text: [
        'Flowers: 8 unique tiles with beautiful designs',
        'Jokers: 8 wild card tiles that can be anything',
        'Jokers are very powerful - they substitute for any tile',
        'Together they make 16 special tiles',
      ],
      visual: 'special-tiles',
      narration: "Finally, we have special tiles. Flowers are 8 unique tiles with beautiful floral designs - each one is different. Jokers are wild cards that can substitute for almost any other tile, making them very powerful! Together, that's 16 special tiles to complete our 152 total.",
    },
    
    // Screen 6: The Complete Set
    {
      screenNum: 6,
      type: 'content',
      title: 'All 152 Tiles',
      text: [
        'Suits (Bamboo, Character, Dot): 108 tiles',
        'Winds: 16 tiles',
        'Dragons: 12 tiles',
        'Flowers: 8 tiles',
        'Jokers: 8 tiles',
        'Total: 152 tiles',
      ],
      visual: 'complete-set',
      narration: "Let's review the complete set. We have 108 suit tiles across Bamboo, Characters, and Dots. Then 16 Winds and 12 Dragons as honor tiles. Finally, 8 Flowers and 8 Jokers as our special tiles. That's all 152 tiles! Now you know what every tile is.",
      button: 'Continue to Quiz',
    },
  ],
  
  quiz: [
    {
      id: 'q1',
      question: 'How many total tiles are used in American Mahjong?',
      options: [
        { id: 'a', text: '108 tiles', correct: false },
        { id: 'b', text: '144 tiles', correct: false },
        { id: 'c', text: '152 tiles', correct: true },
        { id: 'd', text: '160 tiles', correct: false },
      ],
      correctFeedback: "Perfect! American Mahjong uses 152 tiles total.",
      incorrectFeedback: "Not quite. American Mahjong uses 152 tiles - that's what makes it unique!",
    },
    {
      id: 'q2',
      question: 'What are the three suits in Mahjong?',
      options: [
        { id: 'a', text: 'Bamboo, Character, Dot', correct: true },
        { id: 'b', text: 'Winds, Dragons, Flowers', correct: false },
        { id: 'c', text: 'Red, Green, White', correct: false },
        { id: 'd', text: 'East, South, West', correct: false },
      ],
      correctFeedback: "Exactly right! The three suits are Bamboo, Character, and Dot.",
      incorrectFeedback: "Almost! The three suits are Bamboo (Bams), Character (Craks), and Dot.",
    },
    {
      id: 'q3',
      question: 'What makes Jokers special in Mahjong?',
      options: [
        { id: 'a', text: 'They\'re worth the most points', correct: false },
        { id: 'b', text: 'They can substitute for any tile', correct: true },
        { id: 'c', text: 'You must collect all 8 to win', correct: false },
        { id: 'd', text: 'They\'re only used in advanced games', correct: false },
      ],
      correctFeedback: "That's right! Jokers are wild cards that can substitute for almost any other tile.",
      incorrectFeedback: "Not quite. Jokers are special because they're wild cards - they can substitute for any tile you need!",
    },
    {
      id: 'q4',
      question: 'How many of each numbered tile exists in one suit?',
      options: [
        { id: 'a', text: '2 of each', correct: false },
        { id: 'b', text: '3 of each', correct: false },
        { id: 'c', text: '4 of each', correct: true },
        { id: 'd', text: '5 of each', correct: false },
      ],
      correctFeedback: "Correct! There are 4 of each numbered tile in every suit.",
      incorrectFeedback: "Remember: there are 4 of each numbered tile. For example, there are four 1-Bams, four 2-Bams, and so on.",
    },
  ],
  
  rewards: {
    baseXP: 100,
    starBonusXP: { 1: 0, 2: 25, 3: 50 },
    nextLessonUnlock: 3,
    badge: 'Tile Expert!',
  },
};

