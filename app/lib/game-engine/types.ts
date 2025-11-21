// Core types for the scripted Mahjong game engine
// Phase 1: Dummy/Scripted approach for lessons

export type TileSymbol = 
  // Bamboo (Sou) 1-9 - matches Sou1.png, Sou2.png, etc.
  | 'Sou1' | 'Sou2' | 'Sou3' | 'Sou4' | 'Sou5' | 'Sou6' | 'Sou7' | 'Sou8' | 'Sou9'
  // Character (Man) 1-9 - matches Man1.png, Man2.png, etc.
  | 'Man1' | 'Man2' | 'Man3' | 'Man4' | 'Man5' | 'Man6' | 'Man7' | 'Man8' | 'Man9'
  // Dot (Pin) 1-9 - matches Pin1.png, Pin2.png, etc.
  | 'Pin1' | 'Pin2' | 'Pin3' | 'Pin4' | 'Pin5' | 'Pin6' | 'Pin7' | 'Pin8' | 'Pin9'
  // Winds - matches Ton.png, Nan.png, Shaa.png, Pei.png
  | 'Ton' | 'Nan' | 'Shaa' | 'Pei'
  // Dragons - matches Chun.png (Red), Hatsu.png (Green), Haku.png (White)
  | 'Chun' | 'Hatsu' | 'Haku'
  // Flowers - matches flower-plum.png, flower-orchid.png, etc.
  | 'flower-plum' | 'flower-orchid' | 'flower-bamboo' | 'flower-chrysanthemum'
  | 'season-spring' | 'season-summer' | 'season-autumn' | 'season-winter'
  | 'joker'
  // Generic placeholders
  | 'FaceDown' | 'Empty';

export type TileSuit = 'bamboo' | 'character' | 'dot' | 'wind' | 'dragon' | 'flower' | 'joker';
export type TileCategory = 'suit' | 'honor' | 'special';

export interface Tile {
  id: string;
  symbol: TileSymbol;
  suit: TileSuit | null;
  category: TileCategory;
  faceUp: boolean;
  position: Position;
  locked: boolean; // Can't be moved by user
}

export interface Position {
  x: number;
  y: number;
  z?: number; // For stacking
}

export type Direction = 'east' | 'south' | 'west' | 'north';

export interface Wall {
  direction: Direction;
  tiles: Tile[];
  position: Position;
}

export interface PlayerRack {
  direction: Direction;
  tiles: Tile[];
}

export interface BoardState {
  walls: Wall[];
  playerRacks: PlayerRack[];
  centerTiles: Tile[]; // For discards, etc.
  selectedTiles: string[]; // IDs of selected tiles
}

// Scripted scenario system
export type ActionType = 
  | 'tap-tile'
  | 'drag-tile'
  | 'flip-tile'
  | 'stack-tiles'
  | 'arrange-tiles'
  | 'select-answer'
  | 'tap-continue';

export interface ExpectedAction {
  type: ActionType;
  tileIds?: string[];
  targetPosition?: Position;
  condition?: (state: BoardState) => boolean;
  description: string; // What the user should do
}

export interface ScenarioStep {
  id: string;
  instruction: string; // What to show the user
  boardState: BoardState;
  expectedActions: ExpectedAction[];
  validationMessage?: {
    success: string;
    error: string;
  };
  hints?: string[];
}

export interface LessonScenario {
  lessonId: number;
  exerciseId: string;
  title: string;
  steps: ScenarioStep[];
  completionMessage: string;
}

// Helper to create tiles
export function createTile(
  symbol: TileSymbol,
  position: Position,
  faceUp: boolean = true,
  locked: boolean = false
): Tile {
  const id = `${symbol}-${position.x}-${position.y}-${Math.random().toString(36).substr(2, 9)}`;
  
  let suit: TileSuit | null = null;
  let category: TileCategory = 'suit';
  
  // Bamboo tiles (Sou1-9)
  if (symbol.startsWith('Sou')) suit = 'bamboo';
  // Character tiles (Man1-9)
  else if (symbol.startsWith('Man')) suit = 'character';
  // Dot tiles (Pin1-9)
  else if (symbol.startsWith('Pin')) suit = 'dot';
  // Winds (Ton=East, Nan=South, Shaa=West, Pei=North)
  else if (['Ton', 'Nan', 'Shaa', 'Pei'].includes(symbol)) {
    suit = 'wind';
    category = 'honor';
  }
  // Dragons (Chun=Red, Hatsu=Green, Haku=White)
  else if (['Chun', 'Hatsu', 'Haku'].includes(symbol)) {
    suit = 'dragon';
    category = 'honor';
  }
  // Flowers and Seasons
  else if (symbol.startsWith('flower') || symbol.startsWith('season')) {
    suit = 'flower';
    category = 'special';
  }
  else if (symbol === 'joker') {
    suit = 'joker';
    category = 'special';
  }
  
  return {
    id,
    symbol,
    suit,
    category,
    faceUp,
    position,
    locked
  };
}

