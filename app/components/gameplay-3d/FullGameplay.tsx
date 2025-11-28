"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MahjongTile3D } from "./MahjongTile3D";
import { TileRack } from "./TileRack";
import { ThreeEvent } from "@react-three/fiber";
import { generateFullTileSet, shuffleTiles } from "@/lib/data/tile-sets";
import * as THREE from "three";
import { Button } from "@/components/ui/button";

interface TileInPlay {
  id: string;
  tileName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  owner: "player" | "opponent1" | "opponent2" | "opponent3" | "wall" | "discard";
  faceUp: boolean;
  dragging?: boolean;
}

interface FullGameplayProps {
  onDraggingChange?: (isDragging: boolean) => void;
  onWin?: () => void;
  onPhaseChange?: (phase: "dealing" | "playing" | "won", playerDrawnCount: number) => void;
}

export function FullGameplay({ onDraggingChange, onWin, onPhaseChange }: FullGameplayProps) {
  const [tiles, setTiles] = useState<TileInPlay[]>([]);
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent1" | "opponent2" | "opponent3">("player");
  const [turnCount, setTurnCount] = useState(0);
  const [callableTile, setCallableTile] = useState<string | null>(null);
  const [draggedTile, setDraggedTile] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<"dealing" | "playing" | "won">("dealing");
  const [playerDrawnCount, setPlayerDrawnCount] = useState(0);
  const planeRef = React.useRef<THREE.Mesh>(null);

  // Initialize game
  useEffect(() => {
    // Create smaller tile set for demo (80 tiles total)
    const demoTiles = [
      // Dots 1-9 (4 of each) = 36 tiles
      ...Array(4).fill(null).flatMap(() => ["Pin1", "Pin2", "Pin3", "Pin4", "Pin5", "Pin6", "Pin7", "Pin8", "Pin9"]),
      // Bamboos 1-5 (4 of each) = 20 tiles
      ...Array(4).fill(null).flatMap(() => ["Sou1", "Sou2", "Sou3", "Sou4", "Sou5"]),
      // Characters 1-3 (4 of each) = 12 tiles
      ...Array(4).fill(null).flatMap(() => ["Man1", "Man2", "Man3"]),
      // Winds (3 of each) = 12 tiles
      ...Array(3).fill(null).flatMap(() => ["Ton", "Nan", "Shaa", "Pei"]),
    ];
    
    const allTiles = shuffleTiles(demoTiles);
    const initialTiles: TileInPlay[] = [];

    // Fallback for any undefined tiles
    const getTileName = (index: number): string => {
      return allTiles[index] || "Man1";
    };

    let tileIndex = 0;

    // Build walls - 10 stacks (20 tiles) per side = 80 tiles total
    // East wall (right side) - moved inward to avoid overlap
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-east-${i}-${layer}`,
          tileName: getTileName(tileIndex++),
          position: [1.3, 0.09 + layer * 0.05, -0.95 + i * 0.19],
          rotation: [0, Math.PI / 2, 0],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // South wall (top)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-south-${i}-${layer}`,
          tileName: getTileName(tileIndex++),
          position: [0.95 - i * 0.19, 0.09 + layer * 0.05, -1.3],
          rotation: [0, Math.PI, 0],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // West wall (left)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-west-${i}-${layer}`,
          tileName: getTileName(tileIndex++),
          position: [-1.3, 0.09 + layer * 0.05, 0.95 - i * 0.19],
          rotation: [0, -Math.PI / 2, 0],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // North wall (bottom - player side)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-north-${i}-${layer}`,
          tileName: getTileName(tileIndex++),
          position: [-0.95 + i * 0.19, 0.09 + layer * 0.05, 1.3],
          rotation: [0, 0, 0],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    // NO tiles dealt initially - all in wall, racks are empty
    setTiles(initialTiles);
  }, []);

  // Auto-deal to opponents after player draws 6 tiles
  useEffect(() => {
    if (gamePhase !== "dealing") return;
    if (playerDrawnCount < 6) return; // Wait for player to draw all 6

    // Auto-deal to opponents
    const dealToOpponents = async () => {
      // Opponent 1 draws 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 300ms per tile
        drawTileForOpponent("opponent1");
      }

      // Opponent 2 draws 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForOpponent("opponent2");
      }

      // Opponent 3 draws 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForOpponent("opponent3");
      }

      // Dealing complete, start gameplay
      setGamePhase("playing");
      onPhaseChange?.("playing", 6);
    };

    dealToOpponents();
  }, [gamePhase, playerDrawnCount, onPhaseChange]);

  // AI opponent turns (during gameplay phase)
  useEffect(() => {
    if (gamePhase !== "playing") return;
    if (currentTurn === "player") return;

    const timer = setTimeout(() => {
      // Opponent draws and discards
      handleOpponentTurn(currentTurn);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentTurn, gamePhase]);

  const handleOpponentTurn = (opponent: string) => {
    setTiles((prev) => {
      const wallTiles = prev.filter((t) => t.owner === "wall");
      if (wallTiles.length === 0) return prev;

      // Draw tile
      const drawnTile = wallTiles[0];
      const opponentTiles = prev.filter((t) => t.owner === opponent);
      
      // Discard a random tile
      const tileToDiscard = opponentTiles[Math.floor(Math.random() * opponentTiles.length)];
      
      const updated = prev.map((t): TileInPlay => {
        if (t.id === drawnTile.id) {
          // Tile drawn by opponent (add to their hand)
          return {
            ...t,
            owner: opponent as any,
            position: getOpponentHandPosition(opponent, opponentTiles.length),
            rotation: getOpponentHandRotation(opponent),
          };
        }
        if (t.id === tileToDiscard.id) {
          // Discard to center
          const discardCount = prev.filter((tile) => tile.owner === "discard").length;
          return {
            ...t,
            owner: "discard",
            position: [
              -0.3 + (discardCount % 6) * 0.2,
              0.09,
              -0.3 + Math.floor(discardCount / 6) * 0.2,
            ] as [number, number, number],
            rotation: [0, Math.random() * 0.5, 0] as [number, number, number],
            faceUp: true,
          };
        }
        return t;
      });

      return updated;
    });

    // Check for callable tile (simplified - 10% chance)
    if (Math.random() < 0.1) {
      const discarded = tiles.filter((t) => t.owner === "discard");
      if (discarded.length > 0) {
        setCallableTile(discarded[discarded.length - 1].id);
      }
    }

    // Next turn
    setTurnCount((prev) => prev + 1);
    
    // Win condition (5-7 turns, player wins)
    if (turnCount >= 5 && currentTurn === "opponent3") {
      setTimeout(() => {
        setGamePhase("won");
        onWin?.();
      }, 1000);
      return;
    }

    advanceTurn();
  };

  const advanceTurn = () => {
    setCurrentTurn((prev) => {
      if (prev === "player") return "opponent1";
      if (prev === "opponent1") return "opponent2";
      if (prev === "opponent2") return "opponent3";
      return "player";
    });
  };

  const drawTileForOpponent = (opponent: string) => {
    setTiles((prev) => {
      const wallTiles = prev.filter((t) => t.owner === "wall");
      if (wallTiles.length === 0) return prev;

      const drawnTile = wallTiles[0];
      const opponentTiles = prev.filter((t) => t.owner === opponent);
      const handIndex = opponentTiles.length;

      return prev.map((t): TileInPlay => {
        if (t.id === drawnTile.id) {
          return {
            ...t,
            owner: opponent as any,
            position: getOpponentHandPosition(opponent, handIndex),
            rotation: getOpponentHandRotation(opponent),
            faceUp: false,
          };
        }
        return t;
      });
    });
  };

  const getOpponentHandPosition = (opponent: string, index: number): [number, number, number] => {
    switch (opponent) {
      case "opponent1":
        return [1.85, 0.15, -0.6 + index * 0.21];
      case "opponent2":
        return [0.6 - index * 0.21, 0.15, -1.85];
      case "opponent3":
        return [-1.85, 0.15, 0.6 - index * 0.21];
      default:
        return [0, 0.15, 0];
    }
  };

  const getOpponentHandRotation = (opponent: string): [number, number, number] => {
    switch (opponent) {
      case "opponent1":
        return [Math.PI / 2, 0, Math.PI / 2]; // Face West (toward opponent1)
      case "opponent2":
        return [Math.PI / 2, 0, Math.PI]; // Face South (toward opponent2)
      case "opponent3":
        return [Math.PI / 2, 0, -Math.PI / 2]; // Face East (toward opponent3)
      default:
        return [0, 0, 0];
    }
  };

  // Get the next drawable wall tile
  const getNextWallTile = () => {
    return tiles.find((t) => t.owner === "wall");
  };

  // Player drag handlers
  const handleTileDragStart = (tileId: string, event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile) return;
    
    // Allow dragging from player hand or from wall (if it's the next wall tile)
    const nextWallTile = getNextWallTile();
    if (tile.owner !== "player" && tile.id !== nextWallTile?.id) return;

    setDraggedTile(tileId);
    onDraggingChange?.(true);

    // If drawing from wall, immediately add to hand
    if (tile.owner === "wall") {
      const playerTiles = tiles.filter((t) => t.owner === "player");
      const newHandPosition = playerTiles.length;
      
      // Don't allow drawing more than 6 during dealing phase
      if (gamePhase === "dealing" && newHandPosition >= 6) return;
      
      setTiles((prev) =>
        prev.map((t): TileInPlay => {
          if (t.id === tileId) {
            return {
              ...t,
              owner: "player",
              position: [-0.6 + newHandPosition * 0.21, 0.15, 1.85] as [number, number, number],
              rotation: [Math.PI / 2, 0, 0] as [number, number, number], // Face toward player (south)
              faceUp: true,
              dragging: true,
            };
          }
          return t;
        })
      );

      // Track player's drawn tiles during dealing phase
      if (gamePhase === "dealing") {
        const newCount = newHandPosition + 1;
        setPlayerDrawnCount(newCount);
        onPhaseChange?.("dealing", newCount);
      }
    }
  };

  const handleTileDragEnd = (intersectPoint: THREE.Vector3) => {
    if (!draggedTile) return;

    const tile = tiles.find((t) => t.id === draggedTile);
    if (!tile) return;

    // Determine drop zone
    const distanceFromCenter = Math.sqrt(intersectPoint.x ** 2 + intersectPoint.z ** 2);
    
    if (distanceFromCenter < 0.8 && tile.owner === "player") {
      // Dropped in center = discard
      setTiles((prev) =>
        prev.map((t): TileInPlay => {
          if (t.id === draggedTile) {
            const discardCount = prev.filter((tile) => tile.owner === "discard").length;
            return {
              ...t,
              owner: "discard",
              position: [
                -0.3 + (discardCount % 6) * 0.2,
                0.09,
                -0.3 + Math.floor(discardCount / 6) * 0.2,
              ] as [number, number, number],
              rotation: [0, Math.random() * 0.5, 0] as [number, number, number],
              faceUp: true,
              dragging: false,
            };
          }
          return t;
        })
      );

      // End player turn
      setTurnCount((prev) => prev + 1);
      advanceTurn();
    } else {
      // Return to hand position
      setTiles((prev) =>
        prev.map((t): TileInPlay => {
          if (t.id === draggedTile) {
            return { ...t, dragging: false };
          }
          return t;
        })
      );
    }

    setDraggedTile(null);
    onDraggingChange?.(false);
  };

  const nextWallTile = getNextWallTile();

  // Handle drag movement
  const handleDragMove = (event: ThreeEvent<PointerEvent>) => {
    if (!draggedTile) return;
    const intersectPoint = event.point;
    
    setTiles((prev) =>
      prev.map((t): TileInPlay => {
        if (t.id === draggedTile && t.dragging) {
          return {
            ...t,
            position: [intersectPoint.x, 0.2, intersectPoint.z] as [number, number, number],
          };
        }
        return t;
      })
    );
  };

  return (
    <>
      {/* Invisible drag plane */}
      <mesh
        ref={planeRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={handleDragMove}
        onPointerUp={(e) => handleTileDragEnd(e.point)}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Tile Racks */}
      <TileRack position={[0, 0.06, 1.95]} rotation={[0, 0, 0]} color="yellow" />
      <TileRack position={[1.95, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} color="blue" />
      <TileRack position={[0, 0.06, -1.95]} rotation={[0, Math.PI, 0]} color="pink" />
      <TileRack position={[-1.95, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]} color="green" />

      {/* All tiles */}
      {tiles.map((tile) => {
        const isNextWallTile = currentTurn === "player" && nextWallTile?.id === tile.id;
        const isPlayerTile = tile.owner === "player";
        const isClickable = isPlayerTile || isNextWallTile;

        return (
          <group key={tile.id} position={tile.position} rotation={tile.rotation}>
            {/* Golden ring indicator for drawable wall tile - pulsing */}
            {isNextWallTile && (
              <>
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.12, 0.15, 32]} />
                  <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
                </mesh>
                {/* Pulsing glow */}
                <pointLight
                  position={[0, 0.15, 0]}
                  color="#FFD700"
                  intensity={0.5 + Math.sin(Date.now() * 0.003) * 0.3}
                  distance={0.5}
                />
              </>
            )}

            {/* Clickable hitbox for interactive tiles */}
            {isClickable && (
              <mesh
                position={[0, 0, 0]}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleTileDragStart(tile.id, e);
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
            />
          </group>
        );
      })}

      {/* Call button overlay (rendered in parent) */}
      {callableTile && currentTurn === "player" && (
        <group position={[0, 0.5, 0]}>
          {/* Visual indicator only - actual button in UI */}
        </group>
      )}
    </>
  );
}

