// Lesson 02 - Tile Sorting Game scenario (Exercise 1)
// From lesson-02-tiles.md Screen 7 + Exercise 1

import { LessonScenario, createTile, ScenarioStep, BoardState } from '../types';

export const lesson02TileSorting: LessonScenario = {
  lessonId: 2,
  exerciseId: 'tile-sorting',
  title: 'Sort the Tiles',
  completionMessage: 'Fantastic! You can sort tiles like a pro!',
  
  steps: [
    {
      id: 'sorting-intro',
      instruction: `Sort these tiles into the correct categories:
• Suits: Bamboo, Characters, Dots
• Honor Tiles: Winds, Dragons
• Special: Flowers, Jokers

Drag each tile to the right bin!`,
      
      boardState: {
        walls: [],
        playerRacks: [],
        centerTiles: [
          // 15 tiles to sort - using actual PNG filenames
          createTile('Sou4', { x: 100, y: 150 }, true, false),    // Bamboo/Suit
          createTile('Ton', { x: 200, y: 150 }, true, false),     // East Wind/Honor
          createTile('joker', { x: 300, y: 150 }, true, false),   // Joker/Special
          createTile('Pin7', { x: 400, y: 150 }, true, false),    // Dot/Suit
          createTile('Chun', { x: 100, y: 250 }, true, false),    // Red Dragon/Honor
          createTile('flower-plum', { x: 200, y: 250 }, true, false), // Flower/Special
          createTile('Man2', { x: 300, y: 250 }, true, false),    // Character/Suit
          createTile('Nan', { x: 400, y: 250 }, true, false),     // South Wind/Honor
          createTile('Sou9', { x: 100, y: 350 }, true, false),    // Bamboo/Suit
          createTile('Haku', { x: 200, y: 350 }, true, false),    // White Dragon/Honor
          createTile('Pin5', { x: 300, y: 350 }, true, false),    // Dot/Suit
          createTile('joker', { x: 400, y: 350 }, true, false),   // Joker/Special
          createTile('Man3', { x: 100, y: 450 }, true, false),    // Character/Suit
          createTile('Hatsu', { x: 200, y: 450 }, true, false),   // Green Dragon/Honor
          createTile('Pei', { x: 300, y: 450 }, true, false),     // North Wind/Honor
        ],
        selectedTiles: []
      },
      
      expectedActions: [
        {
          type: 'drag-tile',
          description: 'Drag tiles to any bin - all drops are valid for practice',
          condition: (state: BoardState) => {
            // Count how many tiles have been moved off-screen (sorted into bins)
            const tilesInBins = state.centerTiles.filter(tile => 
              tile.position.x < 0 || tile.position.y < 0
            ).length;
            // All 15 tiles need to be sorted
            return tilesInBins === 15;
          }
        }
      ],
      
      validationMessage: {
        success: 'Perfect! That tile is in the right category!',
        error: 'Not quite - think about what type of tile this is.'
      },
      
      hints: [
        'Remember: Bamboo, Characters, and Dots are suits.',
        'Winds and Dragons are honor tiles.',
        'Flowers and Jokers are special tiles.'
      ]
    }
  ]
};

