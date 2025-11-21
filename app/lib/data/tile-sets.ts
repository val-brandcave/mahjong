// American Mahjong tile set composition
// Total: 152 tiles (4 of each tile type)

export const TILE_TYPES = {
  // Dots (Circles) - 1-9
  dots: ["Pin1", "Pin2", "Pin3", "Pin4", "Pin5", "Pin6", "Pin7", "Pin8", "Pin9"],
  
  // Bamboo (Bams/Sticks) - 1-9
  bamboo: ["Sou1", "Sou2", "Sou3", "Sou4", "Sou5", "Sou6", "Sou7", "Sou8", "Sou9"],
  
  // Characters (Craks) - 1-9
  characters: ["Man1", "Man2", "Man3", "Man4", "Man5", "Man6", "Man7", "Man8", "Man9"],
  
  // Winds
  winds: ["Ton", "Nan", "Shaa", "Pei"], // East, South, West, North
  
  // Dragons
  dragons: ["Haku", "Hatsu", "Chun"], // White, Green, Red
  
  // Flowers (American Mahjong doesn't typically use these, but included for completeness)
  flowers: ["flower-plum", "flower-orchid", "flower-chrysanthemum", "flower-bamboo"],
  
  // Jokers (8 jokers in American Mahjong)
  jokers: ["joker"],
};

// Generate full tile set (4 of each tile, except 8 jokers)
export function generateFullTileSet(): string[] {
  const tiles: string[] = [];
  
  // Add 4 of each regular tile
  Object.values(TILE_TYPES).forEach((category) => {
    if (category === TILE_TYPES.jokers) {
      // Add 8 jokers
      for (let i = 0; i < 8; i++) {
        tiles.push("joker");
      }
    } else if (category === TILE_TYPES.flowers) {
      // Skip flowers in American Mahjong standard set
      // Uncomment if needed:
      // category.forEach((tile) => tiles.push(tile));
    } else {
      // Add 4 copies of each tile
      category.forEach((tile) => {
        for (let i = 0; i < 4; i++) {
          tiles.push(tile);
        }
      });
    }
  });
  
  return tiles;
}

// Shuffle array
export function shuffleTiles(tiles: string[]): string[] {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get tiles for initial wall layout
// American Mahjong: walls are 19 tiles long, 2 tiles high
export function getWallTiles(allTiles: string[]) {
  const tilesPerWall = 38; // 19 stacks of 2
  
  return {
    east: allTiles.slice(0, tilesPerWall),
    south: allTiles.slice(tilesPerWall, tilesPerWall * 2),
    west: allTiles.slice(tilesPerWall * 2, tilesPerWall * 3),
    north: allTiles.slice(tilesPerWall * 3, tilesPerWall * 4),
  };
}

// Sample tiles for demonstrations
export const SAMPLE_TILES = {
  mixed: ["Man1", "Man2", "Man3", "Sou5", "Sou6", "Pin7", "Ton", "Chun"],
  dots: ["Pin1", "Pin2", "Pin3", "Pin4", "Pin5"],
  bamboo: ["Sou1", "Sou2", "Sou3", "Sou4", "Sou5"],
  characters: ["Man1", "Man2", "Man3", "Man4", "Man5"],
  honors: ["Ton", "Nan", "Shaa", "Pei", "Haku", "Hatsu", "Chun"],
};

