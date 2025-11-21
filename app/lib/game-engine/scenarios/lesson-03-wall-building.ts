// Lesson 03 - Wall Building scenario (Exercise 1)
// From lesson-03-walls.md Screen 5 + Exercise 1

import { LessonScenario, createTile, ScenarioStep, BoardState } from '../types';

export const lesson03WallBuilding: LessonScenario = {
  lessonId: 3,
  exerciseId: 'wall-building',
  title: 'Build Your Wall',
  completionMessage: 'Perfect wall! You\'re a natural!',
  
  steps: [
    {
      id: 'flip-tiles',
      instruction: 'Tap tiles to flip them face-down (0/38 flipped)',
      
      boardState: {
        walls: [],
        playerRacks: [],
        // 38 tiles scattered that need to be flipped - using various tile types
        centerTiles: Array.from({ length: 38 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          // Use different tile symbols matching actual PNG files
          const symbols = ['Sou1', 'Sou2', 'Pin3', 'Man4', 'Ton', 'Nan', 'Chun', 'Hatsu'];
          const symbol = symbols[i % symbols.length];
          return createTile(
            symbol as any,
            { x: 50 + col * 60, y: 100 + row * 70 },
            true, // Start face-up so user can flip them
            false
          );
        }),
        selectedTiles: []
      },
      
      expectedActions: [
        {
          type: 'tap-tile',
          description: 'Tap each tile to flip it face-down',
          condition: (state: BoardState) => {
            // All tiles should be face-down to complete this step
            const faceDownCount = state.centerTiles.filter(t => !t.faceUp).length;
            return faceDownCount === 38;
          }
        }
      ],
      
      validationMessage: {
        success: 'Good! Keep flipping!',
        error: 'Tap tiles to flip them over.'
      },
      
      hints: ['Tap each tile to flip it face-down before stacking']
    },
    
    {
      id: 'create-pairs',
      instruction: 'Drag tiles together to create pairs (0/19 pairs created)',
      
      boardState: {
        walls: [],
        playerRacks: [],
        centerTiles: Array.from({ length: 38 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          // Use same symbols as step 1
          const symbols = ['Sou1', 'Sou2', 'Pin3', 'Man4', 'Ton', 'Nan', 'Chun', 'Hatsu'];
          const symbol = symbols[i % symbols.length];
          return createTile(
            symbol as any,
            { x: 50 + col * 60, y: 100 + row * 70 },
            false, // Now face-down
            false
          );
        }),
        selectedTiles: []
      },
      
      expectedActions: [
        {
          type: 'stack-tiles',
          description: 'Drag one tile onto another to create a pair',
          condition: (state: BoardState) => {
            // Check if 19 pairs have been created (stacked tiles)
            const pairedTiles = state.centerTiles.filter(tile => 
              tile.position.z && tile.position.z > 0
            );
            return pairedTiles.length === 19;
          }
        }
      ],
      
      validationMessage: {
        success: 'Great! One pair created!',
        error: 'Drag one tile on top of another to stack them.'
      },
      
      hints: [
        'Stack 2 tiles to make 1 pair. You need 19 pairs total.',
        'Drag one tile directly on top of another tile.'
      ]
    },
    
    {
      id: 'arrange-wall',
      instruction: 'Arrange pairs in a straight row (0/19 pairs placed)',
      
      boardState: {
        walls: [],
        playerRacks: [],
        // 19 stacked pairs scattered that need to be arranged
        centerTiles: Array.from({ length: 19 }, (_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          // Use same symbols for pairs
          const symbols = ['Sou1', 'Sou2', 'Pin3', 'Man4', 'Ton', 'Nan', 'Chun', 'Hatsu'];
          const symbol = symbols[i % symbols.length];
          return createTile(
            symbol as any,
            { x: 50 + col * 60, y: 100 + row * 70, z: 1 },
            false,
            false
          );
        }),
        selectedTiles: []
      },
      
      expectedActions: [
        {
          type: 'drag-tile',
          description: 'Drag one pair to start arranging the wall',
          condition: (state: BoardState) => {
            // Step completes when all pairs are arranged in wall
            const wallTiles = state.centerTiles.filter(tile => tile.position.y > 500);
            return wallTiles.length === 19;
          }
        }
      ],
      
      validationMessage: {
        success: 'Perfect wall built!',
        error: 'Drag pairs to the bottom area.'
      },
      
      hints: [
        'Drag any pair to the bottom of the board to start building your wall.'
      ]
    }
  ]
};

