"use client";

import { MahjongTile3D } from "./MahjongTile3D";
import { generateFullTileSet, shuffleTiles, getWallTiles } from "@/lib/data/tile-sets";
import { useMemo } from "react";

interface GameplaySceneProps {
  scene: number;
  progress: number; // 0-1 for animations within scene
}

export function GameplayScenes({ scene, progress }: GameplaySceneProps) {
  // Generate and shuffle tiles once
  const tiles = useMemo(() => {
    const allTiles = generateFullTileSet();
    return shuffleTiles(allTiles);
  }, []);

  const walls = useMemo(() => getWallTiles(tiles), [tiles]);

  switch (scene) {
    case 0:
      return <Scene0_InitialSetup walls={walls} progress={progress} />;
    case 1:
      return <Scene1_BreakingWall walls={walls} progress={progress} />;
    case 2:
      return <Scene2_Charleston walls={walls} progress={progress} />;
    case 3:
      return <Scene3_Gameplay walls={walls} progress={progress} />;
    case 4:
      return <Scene4_CallingTile walls={walls} progress={progress} />;
    case 5:
      return <Scene5_WinningHand walls={walls} progress={progress} />;
    default:
      return <Scene0_InitialSetup walls={walls} progress={progress} />;
  }
}

// Scene 0: Initial Setup - Walls Built
function Scene0_InitialSetup({ walls, progress }: any) {
  // Table surface is at Y=0.05, tile height is 0.16
  // Bottom of tile should touch table, so Y = 0.05 + (0.16/2) = 0.13
  const tableY = 0.13;
  const tileSpacing = 0.32; // Increased from 0.2 for better visibility
  const stackHeight = 0.18; // Increased from 0.17 for clearer stacking

  return (
    <group>
      {/* East Wall (bottom from camera perspective) */}
      {walls.east.map((tile: string, i: number) => {
        const stackIndex = Math.floor(i / 2);
        const layer = i % 2;
        return (
          <MahjongTile3D
            key={`east-${i}`}
            position={[
              -1.8 + stackIndex * tileSpacing,
              tableY + layer * stackHeight,
              1.5,
            ]}
            rotation={[0, 0, 0]}
            tileName={tile}
            faceUp={false}
            scale={1}
          />
        );
      })}

      {/* South Wall (right) */}
      {walls.south.map((tile: string, i: number) => {
        const stackIndex = Math.floor(i / 2);
        const layer = i % 2;
        return (
          <MahjongTile3D
            key={`south-${i}`}
            position={[
              1.5,
              tableY + layer * stackHeight,
              -1.8 + stackIndex * tileSpacing,
            ]}
            rotation={[0, Math.PI / 2, 0]}
            tileName={tile}
            faceUp={false}
            scale={1}
          />
        );
      })}

      {/* West Wall (top) */}
      {walls.west.map((tile: string, i: number) => {
        const stackIndex = Math.floor(i / 2);
        const layer = i % 2;
        return (
          <MahjongTile3D
            key={`west-${i}`}
            position={[
              1.8 - stackIndex * tileSpacing,
              tableY + layer * stackHeight,
              -1.5,
            ]}
            rotation={[0, Math.PI, 0]}
            tileName={tile}
            faceUp={false}
            scale={1}
          />
        );
      })}

      {/* North Wall (left) */}
      {walls.north.map((tile: string, i: number) => {
        const stackIndex = Math.floor(i / 2);
        const layer = i % 2;
        return (
          <MahjongTile3D
            key={`north-${i}`}
            position={[
              -1.5,
              tableY + layer * stackHeight,
              1.8 - stackIndex * tileSpacing,
            ]}
            rotation={[0, -Math.PI / 2, 0]}
            tileName={tile}
            faceUp={false}
            scale={1}
          />
        );
      })}
    </group>
  );
}

// Scene 1: Breaking the Wall & Dealing
function Scene1_BreakingWall({ walls, progress }: any) {
  const tableY = 0.13;
  const tileSpacing = 0.32;
  
  // Show initial walls, then animate some tiles moving to players
  const dealingProgress = Math.max(0, progress - 0.3);

  return (
    <group>
      {/* Keep most walls in place */}
      {walls.east.slice(8).map((tile: string, i: number) => {
        const stackIndex = Math.floor((i + 8) / 2);
        const layer = (i + 8) % 2;
        return (
          <MahjongTile3D
            key={`east-${i}`}
            position={[
              -1.8 + stackIndex * tileSpacing,
              tableY + layer * 0.18,
              1.5,
            ]}
            rotation={[0, 0, 0]}
            tileName={tile}
            faceUp={false}
            scale={1}
          />
        );
      })}

      {/* Animated tiles being dealt to East player */}
      {walls.east.slice(0, 8).map((tile: string, i: number) => {
        const targetX = -0.8 + i * 0.17;
        const targetZ = 1.0;
        const currentX = -1.8 + Math.floor(i / 2) * tileSpacing + (targetX + 1.8) * dealingProgress;
        const currentZ = 1.5 + (targetZ - 1.5) * dealingProgress;
        
        return (
          <MahjongTile3D
            key={`dealt-east-${i}`}
            position={[currentX, tableY, currentZ]}
            rotation={[0, 0, 0]}
            tileName={tile}
            faceUp={dealingProgress > 0.8}
            scale={1}
          />
        );
      })}
    </group>
  );
}

// Scene 2: Charleston (Passing Tiles)
function Scene2_Charleston({ walls, progress }: any) {
  const tableY = 0.13;
  
  // Player hands (simplified)
  const eastHand = walls.east.slice(0, 13);
  const southHand = walls.south.slice(0, 13);
  
  // Tiles being passed
  const passingTiles = eastHand.slice(0, 3);
  
  // Animate tiles moving from East to South (right pass)
  const passX = -0.5 + progress * 2.0; // Move right
  const passZ = 1.0;
  const passRotation = progress * Math.PI / 4;

  return (
    <group>
      {/* East player hand (remaining tiles) */}
      {eastHand.slice(3).map((tile: string, i: number) => (
        <MahjongTile3D
          key={`east-${i}`}
          position={[-0.8 + i * 0.17, tableY, 1.0]}
          rotation={[0, 0, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}

      {/* Tiles being passed (animated) */}
      {passingTiles.map((tile: string, i: number) => (
        <MahjongTile3D
          key={`passing-${i}`}
          position={[
            passX + i * 0.17,
            tableY + progress * 0.3,
            passZ - i * 0.1,
          ]}
          rotation={[0, passRotation, 0]}
          tileName={tile}
          faceUp={false}
          scale={1}
        />
      ))}

      {/* South player hand */}
      {southHand.slice(0, 10).map((tile: string, i: number) => (
        <MahjongTile3D
          key={`south-${i}`}
          position={[0.8, tableY, -0.8 + i * 0.17]}
          rotation={[0, Math.PI / 2, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}
    </group>
  );
}

// Scene 3: Active Gameplay (Draw & Discard)
function Scene3_Gameplay({ walls, progress }: any) {
  const tableY = 0.13;
  const eastHand = walls.east.slice(0, 13);
  
  // Tile being drawn
  const drawnTile = walls.east[13];
  const drawProgress = Math.min(progress * 2, 1);
  
  // Tile being discarded
  const discardTile = eastHand[12];
  const discardProgress = Math.max((progress - 0.5) * 2, 0);

  return (
    <group>
      {/* Player hand */}
      {eastHand.slice(0, 12).map((tile: string, i: number) => (
        <MahjongTile3D
          key={`hand-${i}`}
          position={[-0.9 + i * 0.17, tableY, 1.0]}
          rotation={[0, 0, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}

      {/* Drawing tile animation */}
      <MahjongTile3D
        position={[
          -1.5 + drawProgress * 1.4,
          tableY,
          1.5 - drawProgress * 0.5,
        ]}
        rotation={[0, 0, 0]}
        tileName={drawnTile}
        faceUp={drawProgress > 0.5}
        scale={1}
      />

      {/* Discarding tile animation */}
      <MahjongTile3D
        position={[
          -0.1,
          tableY,
          1.0 - discardProgress * 1.0,
        ]}
        rotation={[0, discardProgress * Math.PI / 6, 0]}
        tileName={discardTile}
        faceUp={true}
        scale={1}
      />

      {/* Center discard pile (previous discards) */}
      {walls.south.slice(0, 6).map((tile: string, i: number) => (
        <MahjongTile3D
          key={`discard-${i}`}
          position={[-0.3 + (i % 3) * 0.25, tableY, -0.3 + Math.floor(i / 3) * 0.25]}
          rotation={[0, Math.random() * 0.3, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}
    </group>
  );
}

// Scene 4: Calling a Tile (Exposing Pung)
function Scene4_CallingTile({ walls, progress }: any) {
  const tableY = 0.13;
  const southHand = walls.south.slice(0, 13);
  
  // The called tile from discard
  const calledTile = "Man5";
  
  // Matching tiles from hand
  const exposedTiles = [calledTile, calledTile, calledTile];
  
  const callProgress = progress;

  return (
    <group>
      {/* South player hand (hidden tiles) */}
      {southHand.slice(3, 13).map((tile: string, i: number) => (
        <MahjongTile3D
          key={`hand-${i}`}
          position={[1.0, tableY, -0.8 + i * 0.17]}
          rotation={[0, Math.PI / 2, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}

      {/* Exposed Pung (animated) */}
      {exposedTiles.map((tile: string, i: number) => (
        <MahjongTile3D
          key={`exposed-${i}`}
          position={[
            1.0 - callProgress * 0.3,
            tableY,
            -1.2 + i * 0.25,
          ]}
          rotation={[0, Math.PI / 2, 0]}
          tileName={tile}
          faceUp={true}
          scale={1}
        />
      ))}

      {/* Called tile animating from center */}
      <MahjongTile3D
        position={[
          -0.2 + callProgress * 1.2,
          tableY + (1 - callProgress) * 0.3,
          -0.2 - callProgress * 1.0,
        ]}
        rotation={[0, callProgress * Math.PI / 2, 0]}
        tileName={calledTile}
        faceUp={true}
        scale={1}
      />
    </group>
  );
}

// Scene 5: Winning Hand Reveal
function Scene5_WinningHand({ walls, progress }: any) {
  const tableY = 0.13;
  
  // Create a winning hand (example: runs and pairs)
  const winningHand = [
    "Man1", "Man2", "Man3", // Run
    "Sou4", "Sou5", "Sou6", // Run
    "Pin7", "Pin8", "Pin9", // Run
    "Ton", "Ton", "Ton",    // Pung
    "Haku", "Haku",         // Pair
  ];

  // Spread animation
  const spreadProgress = progress;

  return (
    <group>
      {/* Winning hand spread out */}
      {winningHand.map((tile: string, i: number) => {
        const groupOffset = Math.floor(i / 3) * 0.6;
        const tileInGroup = i % 3;
        const yLift = spreadProgress * 0.2;
        
        return (
          <MahjongTile3D
            key={`win-${i}`}
            position={[
              -1.5 + groupOffset + tileInGroup * 0.2,
              tableY + yLift,
              0.8,
            ]}
            rotation={[spreadProgress * -0.3, 0, 0]}
            tileName={tile}
            faceUp={true}
            scale={1.1}
          />
        );
      })}

      {/* Celebratory floating tiles */}
      {[walls.north[0], walls.north[1], walls.north[2]].map((tile: string, i: number) => (
        <MahjongTile3D
          key={`float-${i}`}
          position={[
            -1.0 + i * 1.0,
            tableY + 1.0 + Math.sin(spreadProgress * Math.PI + i) * 0.3,
            -0.5 + i * 0.3,
          ]}
          rotation={[
            spreadProgress * Math.PI * 2,
            spreadProgress * Math.PI,
            0,
          ]}
          tileName={tile}
          faceUp={true}
          scale={0.8}
        />
      ))}
    </group>
  );
}

