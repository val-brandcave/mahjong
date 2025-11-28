"use client";

import React, { useState, useEffect } from "react";
import { MahjongTile3D } from "./MahjongTile3D";
import { TileRack } from "./TileRack";
import { FilledTileRack } from "./FilledTileRack";
import { CharlestonTileAnimation } from "./CharlestonTileAnimation";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface TileInPlay {
  id: string;
  tileName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  owner: "player" | "opponent1" | "opponent2" | "opponent3" | "wall" | "discard";
  faceUp: boolean;
}

interface FullGameplayHybridProps {
  onDraggingChange?: (isDragging: boolean) => void;
  onWin?: () => void;
  onPhaseChange?: (phase: string, info: any) => void;
  onPlayerHandChange?: (tiles: string[]) => void;
  onWallTileClick?: any;
  onDrawnThisTurnChange?: (hasDrawn: boolean) => void;
  canStartDealing?: boolean;
  parentGamePhase?: "dealing" | "charleston" | "playing" | "won" | "transition" | "readyToReveal";
}

// Make component forwardRef compatible
export const FullGameplayHybridWithRef = React.forwardRef<any, FullGameplayHybridProps>((props, ref) => {
  return <FullGameplayHybridInner {...props} forwardedRef={ref} />;
});

FullGameplayHybridWithRef.displayName = "FullGameplayHybrid";

interface FullGameplayHybridInnerProps extends FullGameplayHybridProps {
  forwardedRef?: any;
}

function FullGameplayHybridInner({ 
  onDraggingChange, 
  onWin, 
  onPhaseChange,
  onPlayerHandChange,
  onWallTileClick,
  onDrawnThisTurnChange,
  canStartDealing = false,
  parentGamePhase,
  forwardedRef,
}: FullGameplayHybridInnerProps) {
  const [tiles, setTiles] = useState<TileInPlay[]>([]);
  const [gamePhase, setGamePhase] = useState<"dealing" | "playing" | "won">("dealing");
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "opponent1" | "opponent2" | "opponent3">("player");
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [playRounds, setPlayRounds] = useState(0);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [showFilledRacks, setShowFilledRacks] = useState(false);
  const [charlestonAnimations, setCharlestonAnimations] = useState<Array<{
    id: string;
    tiles: string[];
    direction: "right" | "across" | "left";
    playerPosition: "east" | "south" | "west" | "north";
  }>>([]);

  // Create tile set - 116 tiles total
  const createTileSet = () => {
    const tileSet: string[] = [];
    // Dots/Pin: 4 of each (1-9) = 36 tiles
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Pin1", "Pin2", "Pin3", "Pin4", "Pin5", "Pin6", "Pin7", "Pin8", "Pin9"]);
    }
    // Bamboo/Sou: 4 of each (1-9) = 36 tiles
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Sou1", "Sou2", "Sou3", "Sou4", "Sou5", "Sou6", "Sou7", "Sou8", "Sou9"]);
    }
    // Characters/Man: 4 of each (1-5) = 20 tiles
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Man1", "Man2", "Man3", "Man4", "Man5"]);
    }
    // Winds: 4 of each (Ton, Nan, Shaa, Pei) = 16 tiles
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Ton", "Nan", "Shaa", "Pei"]);
    }
    // Dragons: 4 of each (Haku, Hatsu, Chun) = 8 tiles (if available, else repeat winds)
    // Total should be: 36 + 36 + 20 + 16 + 8 = 116 tiles
    for (let i = 0; i < 2; i++) {
      tileSet.push(...["Ton", "Nan", "Shaa", "Pei"]); // Add 8 more wind tiles to reach 116
    }
    return tileSet.sort(() => Math.random() - 0.5);
  };

  // Initialize - walls only, no player rack
  useEffect(() => {
    const allTiles = createTileSet();
    const initialTiles: TileInPlay[] = [];
    let tileIndex = 0;

    // Build walls - EAST and WEST: 10 pairs, NORTH and SOUTH: 19 pairs
    // EAST WALL (Blue side) - 10 pairs (20 tiles)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-east-${i}-${layer}`,
          tileName: allTiles[tileIndex++] || "Man1",
          position: [2.3, 0.09 + layer * 0.05, -0.95 + i * 0.19] as [number, number, number],
          rotation: [0, Math.PI / 2, 0] as [number, number, number],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // SOUTH WALL (Red/Pink side) - 19 pairs (38 tiles)
    for (let i = 0; i < 19; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-south-${i}-${layer}`,
          tileName: allTiles[tileIndex++] || "Man1",
          position: [1.81 - i * 0.19, 0.09 + layer * 0.05, -1.3] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // WEST WALL (Green side) - 10 pairs (20 tiles)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-west-${i}-${layer}`,
          tileName: allTiles[tileIndex++] || "Man1",
          position: [-2.3, 0.09 + layer * 0.05, 0.95 - i * 0.19] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // NORTH WALL (Yellow/Player side) - 19 pairs (38 tiles)
    for (let i = 0; i < 19; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-north-${i}-${layer}`,
          tileName: allTiles[tileIndex++] || "Man1",
          position: [-1.81 + i * 0.19, 0.09 + layer * 0.05, 1.3] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // Opponent tiles (same as before - in their racks)
    // ... (keeping opponent initialization from V2)

    // Initialize opponent hands in their racks (will be added during dealing)
    setTiles(initialTiles);
  }, []);

  // Auto-deal to opponents and handle opponent turns
  useEffect(() => {
    if (gamePhase !== "playing" || currentPlayer === "player") return;

    const timer = setTimeout(() => {
      performOpponentTurn(currentPlayer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentPlayer, gamePhase]);

  const performOpponentTurn = (opponent: string) => {
    // Draw one tile
    drawTileForOpponent(opponent);

    setTimeout(() => {
      // Discard one tile in their row
      setTiles((prev) => {
        const opponentTiles = prev.filter((t) => t.owner === opponent);
        if (opponentTiles.length === 0) return prev;

        const tileToDiscard = opponentTiles[Math.floor(Math.random() * opponentTiles.length)];
        const opponentDiscardCount = prev.filter((t) => t.owner === "discard" && t.id.startsWith(opponent)).length;

        const discardedTile: TileInPlay = {
          id: `${opponent}-discard-${Date.now()}`,
          tileName: tileToDiscard.tileName,
          position: getDiscardPosition(opponent, opponentDiscardCount),
          rotation: [0, 0, 0] as [number, number, number],
          owner: "discard",
          faceUp: true,
        };

        return [...prev.filter((t) => t.id !== tileToDiscard.id), discardedTile];
      });

      setTimeout(() => {
        advanceToNextPlayer();
      }, 500);
    }, 1000);
  };

  // Sync player hand to parent
  useEffect(() => {
    console.log("🔄 Syncing playerHand to parent:", playerHand.length, "tiles:", playerHand);
    onPlayerHandChange?.(playerHand);
  }, [playerHand]);

  // Handle wall tile click (called from parent when 2D UI clicks)
  const drawTileFromWall = () => {
    const wallTiles = tiles.filter((t) => t.owner === "wall");
    if (wallTiles.length === 0) {
      console.log("❌ No wall tiles left");
      return;
    }

    const drawnTile = wallTiles[0];
    console.log("🎲 Drawing tile:", drawnTile.tileName, "Current hand size:", playerHand.length);
    
    // Add to player hand (2D)
    setPlayerHand((prev) => {
      const newHand = [...prev, drawnTile.tileName];
      console.log("   New hand will be:", newHand.length, "tiles");
      return newHand;
    });

    // Remove from 3D wall
    setTiles((prev) => prev.filter((t) => t.id !== drawnTile.id));

    // Track drawing
    if (gamePhase === "dealing") {
      const newCount = playerHand.length + 1;
      onPhaseChange?.("dealing", { drawn: newCount, total: 12 });
      
      if (newCount === 12) {
        console.log("✅ Player dealing complete - 12 tiles drawn, starting bot auto-draw");
        // Start opponent dealing
        dealToOpponents();
      }
    } else if (gamePhase === "playing") {
      console.log("🎮 Player drew during playing phase - enabling discard");
      setHasDrawnThisTurn(true);
      // Notify parent to update hasDrawnThisTurn
      onPhaseChange?.("playerDrew", { hasDrawn: true });
      
      // Check if this is the winning draw (after 5 rounds, drawing 13th tile = ready to reveal)
      if (playRounds >= 5 && playerHand.length + 1 === 13) {
        console.log("🎊 MAHJONG! Player has winning hand - ready to reveal!");
        // Don't auto-win, let player click reveal button
        onPhaseChange?.("readyToReveal", {});
      }
    }
  };

  // Get discard position for each player (in rows parallel to their side)
  const getDiscardPosition = (player: string, discardIndex: number): [number, number, number] => {
    const spacing = 0.22;
    
    switch (player) {
      case "player":
        // Horizontal row parallel to south wall (unchanged)
        return [-0.6 + discardIndex * spacing, 0.09, 0.8] as [number, number, number];
      case "opponent1":
        // Vertical row parallel to east wall (moved +1 unit east)
        return [1.8, 0.09, -0.6 + discardIndex * spacing] as [number, number, number];
      case "opponent2":
        // Horizontal row parallel to north wall (unchanged)
        return [0.6 - discardIndex * spacing, 0.09, -0.8] as [number, number, number];
      case "opponent3":
        // Vertical row parallel to west wall (moved -1 unit west)
        return [-1.8, 0.09, 0.6 - discardIndex * spacing] as [number, number, number];
      default:
        return [0, 0.09, 0] as [number, number, number];
    }
  };

  const addDiscardTile = (tileName: string, player: string) => {
    const discardCount = tiles.filter((t) => t.owner === "discard" && t.id.startsWith(player)).length;
    
    const newTile: TileInPlay = {
      id: `${player}-discard-${Date.now()}`,
      tileName,
      position: getDiscardPosition(player, discardCount),
      rotation: [0, 0, 0] as [number, number, number],
      owner: "discard",
      faceUp: true,
    };

    setTiles((prev) => [...prev, newTile]);
  };

  const advanceToNextPlayer = () => {
    const nextPlayer = getNextPlayer(currentPlayer);
    setCurrentPlayer(nextPlayer);

    if (nextPlayer === "player") {
      const newRoundCount = playRounds + 1;
      setPlayRounds(newRoundCount);
      setHasDrawnThisTurn(false);
      console.log("📊 Round completed. Total rounds:", newRoundCount);
      
      // Don't trigger win yet - let player draw final tile
      if (newRoundCount >= 5) {
        console.log("🏁 Final round! Player will draw one more tile then win");
        onPhaseChange?.("finalRound", { round: newRoundCount });
      }
    }
  };

  const getNextPlayer = (current: string) => {
    if (current === "player") return "opponent1";
    if (current === "opponent1") return "opponent2";
    if (current === "opponent2") return "opponent3";
    return "player";
  };

  // Sync player hand from parent (when they discard)
  const syncPlayerHand = (newHand: string[]) => {
    console.log("📥 Child syncing hand FROM parent:", newHand.length, "tiles:", newHand);
    setPlayerHand(newHand);
  };

  // Show filled racks (switch from empty to filled)
  const addDummyTilesToRacks = () => {
    console.log("🎴 ===== SWITCHING TO FILLED RACKS =====");
    setShowFilledRacks(true);
  };

  // Charleston pass animation trigger
  const showCharlestonPass = (tiles: string[], direction: "right" | "across" | "left") => {
    console.log("🎴 Showing Charleston animation:", tiles, direction);
    
    // Create animations for all 4 players
    const animations = [
      { id: "player-charleston", tiles, direction, playerPosition: "east" as const },
      { id: "opponent1-charleston", tiles, direction, playerPosition: "south" as const },
      { id: "opponent2-charleston", tiles, direction, playerPosition: "west" as const },
      { id: "opponent3-charleston", tiles, direction, playerPosition: "north" as const },
    ];
    
    setCharlestonAnimations(animations);
  };

  const clearCharlestonAnimations = (id: string) => {
    setCharlestonAnimations((prev) => prev.filter((anim) => anim.id !== id));
  };

  // Expose functions to parent via ref
  React.useImperativeHandle(forwardedRef, () => ({
    drawTileFromWall,
    addDiscardTile,
    advanceToNextPlayer,
    syncPlayerHand,
    addDummyTilesToRacks,
    showCharlestonPass,
  }));

  const dealToOpponents = async () => {
    console.log("🤖 Starting bot auto-draw");
    // Deal to 3 opponents (6 tiles each)
    for (const opponent of ["opponent1", "opponent2", "opponent3"]) {
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForOpponent(opponent);
      }
    }

    console.log("🤖 Bots finished drawing - notifying parent to add dummy tiles and start Charleston");
    onPhaseChange?.("botsAutoDrawComplete", {});
    
    // DON'T set gamePhase here - let the parent control Charleston -> playing transition
  };

  const drawTileForOpponent = (opponent: string) => {
    setTiles((prev) => {
      const wallTiles = prev.filter((t) => t.owner === "wall");
      if (wallTiles.length === 0) return prev;

      const drawnTile = wallTiles[0];
      const opponentTiles = prev.filter((t) => t.owner === opponent);
      const handIndex = opponentTiles.length;

      const newTiles = prev.filter((t) => t.id !== drawnTile.id);
      newTiles.push({
        ...drawnTile,
        owner: opponent as any,
        position: getRackPosition(opponent, handIndex),
        rotation: getRackRotation(opponent),
        faceUp: false,
      });

      return newTiles;
    });
  };

  const getRackPosition = (player: string, index: number): [number, number, number] => {
    const tileY = 0.175;
    switch (player) {
      case "opponent1":
        return [2.85, tileY, -0.6 + index * 0.21]; // Moved +1 unit east
      case "opponent2":
        return [0.6 - index * 0.21, tileY, -1.85]; // Unchanged (north/south)
      case "opponent3":
        return [-2.85, tileY, 0.6 - index * 0.21]; // Moved -1 unit west
      default:
        return [0, tileY, 0];
    }
  };

  const getRackRotation = (player: string): [number, number, number] => {
    switch (player) {
      case "opponent1":
        return [Math.PI / 2, 0, Math.PI / 2];
      case "opponent2":
        return [Math.PI / 2, 0, Math.PI];
      case "opponent3":
        return [Math.PI / 2, 0, -Math.PI / 2];
      default:
        return [0, 0, 0];
    }
  };

  const nextWallTile = tiles.find((t) => t.owner === "wall");

  return (
    <>
      {/* Opponent racks - switch between empty and filled */}
      {!showFilledRacks ? (
        <>
          {/* Empty racks */}
          <TileRack position={[2.95, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} color="blue" />
          <TileRack position={[0, 0.06, -1.95]} rotation={[0, Math.PI, 0]} color="pink" />
          <TileRack position={[-2.95, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]} color="green" />
        </>
      ) : (
        <>
          {/* Filled racks with 6 tiles each */}
          <FilledTileRack position={[2.95, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} color="blue" />
          <FilledTileRack position={[0, 0.06, -1.95]} rotation={[0, Math.PI, 0]} color="pink" />
          <FilledTileRack position={[-2.95, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]} color="green" />
        </>
      )}

      {/* Charleston animations */}
      {charlestonAnimations.map((anim) => (
        <CharlestonTileAnimation
          key={anim.id}
          tiles={anim.tiles}
          direction={anim.direction}
          playerPosition={anim.playerPosition}
          onAnimationComplete={() => clearCharlestonAnimations(anim.id)}
        />
      ))}

      {/* Wall and opponent tiles only */}
      {tiles.map((tile) => {
        const isNextWallTile = nextWallTile?.id === tile.id;
        // Use parent game phase to control wall tile interaction - should NOT show during Charleston
        const effectivePhase = parentGamePhase || gamePhase;
        const showWallRing = isNextWallTile && canStartDealing &&
          effectivePhase !== "charleston" &&
          ((effectivePhase === "dealing" && playerHand.length < 12) || 
           (effectivePhase === "playing" && currentPlayer === "player" && !hasDrawnThisTurn));
        
        const isDummyTile = tile.id.includes("dummy");

        return (
          <group key={tile.id} position={tile.position} rotation={tile.rotation}>
            {/* Golden ring on drawable wall tile */}
            {showWallRing && (
              <>
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.12, 0.15, 32]} />
                  <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
                </mesh>
                <pointLight
                  position={[0, 0.15, 0]}
                  color="#FFD700"
                  intensity={0.6}
                  distance={0.5}
                />
              </>
            )}

            {/* Clickable hitbox for wall tiles */}
            {showWallRing && (
              <mesh
                position={[0, 0, 0]}
                onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  drawTileFromWall();
                }}
                visible={false}
              >
                <boxGeometry args={[0.15, 0.04, 0.2]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
            )}

            {/* The actual tile */}
            <MahjongTile3D
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              tileName={tile.tileName}
              faceUp={tile.faceUp}
              scale={1}
              neutralColor={isDummyTile}
            />
          </group>
        );
      })}
    </>
  );
}

