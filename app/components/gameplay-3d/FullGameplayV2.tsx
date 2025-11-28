"use client";

import React, { useState, useEffect } from "react";
import { MahjongTile3D } from "./MahjongTile3D";
import { TileRack } from "./TileRack";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface TileInPlay {
  id: string;
  tileName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  owner: "player" | "opponent1" | "opponent2" | "opponent3" | "wall" | "discard";
  faceUp: boolean;
  rackIndex?: number; // Position index in player's rack
}

interface FullGameplayV2Props {
  onDraggingChange?: (isDragging: boolean) => void;
  onWin?: () => void;
  onPhaseChange?: (phase: string, info: any) => void;
}

export function FullGameplayV2({ onDraggingChange, onWin, onPhaseChange }: FullGameplayV2Props) {
  const [tiles, setTiles] = useState<TileInPlay[]>([]);
  const [gamePhase, setGamePhase] = useState<"dealing" | "playing" | "won">("dealing");
  const [currentPlayer, setCurrentPlayer] = useState<"player" | "opponent1" | "opponent2" | "opponent3">("player");
  const [playerDrawnCount, setPlayerDrawnCount] = useState(0);
  const [draggedTile, setDraggedTile] = useState<string | null>(null);
  const [playRounds, setPlayRounds] = useState(0);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false); // Track if player drew this turn
  const planeRef = React.useRef<THREE.Mesh>(null);

  // Create initial 80-tile set
  const createTileSet = () => {
    const tileSet: string[] = [];
    // Dots 1-9 (4 each)
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Pin1", "Pin2", "Pin3", "Pin4", "Pin5", "Pin6", "Pin7", "Pin8", "Pin9"]);
    }
    // Bamboos 1-5 (4 each)
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Sou1", "Sou2", "Sou3", "Sou4", "Sou5"]);
    }
    // Characters 1-3 (4 each)
    for (let i = 0; i < 4; i++) {
      tileSet.push(...["Man1", "Man2", "Man3"]);
    }
    // Winds (3 each)
    for (let i = 0; i < 3; i++) {
      tileSet.push(...["Ton", "Nan", "Shaa", "Pei"]);
    }
    // Shuffle
    return tileSet.sort(() => Math.random() - 0.5);
  };

  // Initialize game - only walls, no dealt tiles
  useEffect(() => {
    const allTiles = createTileSet();
    const initialTiles: TileInPlay[] = [];
    let tileIndex = 0;

    // Build walls - 10 stacks × 2 high per side
    // East wall (right side)
    for (let i = 0; i < 10; i++) {
      for (let layer = 0; layer < 2; layer++) {
        initialTiles.push({
          id: `wall-east-${i}-${layer}`,
          tileName: allTiles[tileIndex++] || "Man1",
          position: [1.3, 0.09 + layer * 0.05, -0.95 + i * 0.19] as [number, number, number],
          rotation: [0, Math.PI / 2, 0] as [number, number, number],
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
          tileName: allTiles[tileIndex++] || "Man1",
          position: [0.95 - i * 0.19, 0.09 + layer * 0.05, -1.3] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
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
          tileName: allTiles[tileIndex++] || "Man1",
          position: [-1.3, 0.09 + layer * 0.05, 0.95 - i * 0.19] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
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
          tileName: allTiles[tileIndex++] || "Man1",
          position: [-0.95 + i * 0.19, 0.09 + layer * 0.05, 1.3] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          owner: "wall",
          faceUp: false,
        });
      }
    }

    setTiles(initialTiles);
    onPhaseChange?.("dealing", { drawn: 0, total: 6 });
  }, []);

  // Auto-deal to opponents after player draws 6
  useEffect(() => {
    if (gamePhase !== "dealing" || playerDrawnCount !== 6) return;

    const dealToOpponents = async () => {
      // Opponent 1 - draws exactly 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForPlayer("opponent1");
      }

      // Opponent 2 - draws exactly 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForPlayer("opponent2");
      }

      // Opponent 3 - draws exactly 6 tiles
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        drawTileForPlayer("opponent3");
      }

      // Show transition message, then start playing
      setGamePhase("playing");
      onPhaseChange?.("transition", { message: "Pick a new tile from the wall and discard" });
      
      setTimeout(() => {
        onPhaseChange?.("playing", {});
      }, 3000);
    };

    dealToOpponents();
  }, [gamePhase, playerDrawnCount]);

  // Opponent turns during gameplay
  useEffect(() => {
    if (gamePhase !== "playing" || currentPlayer === "player") return;

    const timer = setTimeout(() => {
      performOpponentTurn(currentPlayer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentPlayer, gamePhase]);

  const drawTileForPlayer = (player: string) => {
    setTiles((prev) => {
      const wallTiles = prev.filter((t) => t.owner === "wall");
      if (wallTiles.length === 0) return prev;

      const drawnTile = wallTiles[0];
      const playerTiles = prev.filter((t) => t.owner === player);
      const handIndex = playerTiles.length;

      return prev.map((t): TileInPlay => {
        if (t.id === drawnTile.id) {
          return {
            ...t,
            owner: player as any,
            position: getRackPosition(player, handIndex),
            rotation: getRackRotation(player),
            faceUp: player === "player",
            rackIndex: handIndex,
          };
        }
        return t;
      });
    });
  };

  const getRackPosition = (player: string, index: number): [number, number, number] => {
    // Rack base is at Y=0.06, base height=0.03, so top of base is at 0.075
    // Tile height=0.04, so tile center should be at 0.075 + 0.02 = 0.095
    // But tiles are rotated 90° (standing), so we need height at 0.075 + 0.1 (half of 0.2 face length) = 0.175
    const tileY = 0.175; // Sitting on rack base, standing upright
    
    switch (player) {
      case "player":
        return [-0.6 + index * 0.21, tileY, 1.85];
      case "opponent1":
        return [1.85, tileY, -0.6 + index * 0.21];
      case "opponent2":
        return [0.6 - index * 0.21, tileY, -1.85];
      case "opponent3":
        return [-1.85, tileY, 0.6 - index * 0.21];
      default:
        return [0, tileY, 0];
    }
  };

  const getRackRotation = (player: string): [number, number, number] => {
    switch (player) {
      case "player":
        return [Math.PI / 2, 0, 0]; // Face south
      case "opponent1":
        return [Math.PI / 2, 0, Math.PI / 2]; // Face west
      case "opponent2":
        return [Math.PI / 2, 0, Math.PI]; // Face south
      case "opponent3":
        return [Math.PI / 2, 0, -Math.PI / 2]; // Face east
      default:
        return [0, 0, 0];
    }
  };

  const performOpponentTurn = (opponent: string) => {
    // Draw one tile
    drawTileForPlayer(opponent);

    setTimeout(() => {
      // Discard one tile
      setTiles((prev) => {
        const opponentTiles = prev.filter((t) => t.owner === opponent);
        if (opponentTiles.length === 0) return prev;

        const tileToDiscard = opponentTiles[Math.floor(Math.random() * opponentTiles.length)];
        const discardCount = prev.filter((t) => t.owner === "discard").length;

        return prev.map((t): TileInPlay => {
          if (t.id === tileToDiscard.id) {
            // Place in center, near player's side
            return {
              ...t,
              owner: "discard",
              position: [
                -0.4 + (discardCount % 4) * 0.25,
                0.09,
                0.3 + Math.floor(discardCount / 4) * 0.2,
              ] as [number, number, number],
              rotation: [0, Math.random() * 0.3, 0] as [number, number, number],
              faceUp: true,
            };
          }
          return t;
        });
      });

      // Advance to next player
      setTimeout(() => {
        const nextPlayer = getNextPlayer(opponent);
        setCurrentPlayer(nextPlayer);

        // Check for win after player's turn
        if (nextPlayer === "player") {
          const newRoundCount = playRounds + 1;
          setPlayRounds(newRoundCount);
          setHasDrawnThisTurn(false); // Reset for new round
          
          if (newRoundCount >= 5) {
            setGamePhase("won");
            onWin?.();
          }
        }
      }, 500);
    }, 1000);
  };

  const getNextPlayer = (current: string) => {
    if (current === "player") return "opponent1";
    if (current === "opponent1") return "opponent2";
    if (current === "opponent2") return "opponent3";
    return "player";
  };

  // Handle player dragging tile from wall
  const handleWallTileDrag = (tileId: string, event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    const wallTiles = tiles.filter((t) => t.owner === "wall");
    if (wallTiles.length === 0 || wallTiles[0].id !== tileId) return;

    setDraggedTile(tileId);
    onDraggingChange?.(true);

    const playerTiles = tiles.filter((t) => t.owner === "player");
    const newIndex = playerTiles.length;

    // During dealing phase
    if (gamePhase === "dealing" && playerDrawnCount < 6) {
      setTiles((prev) =>
        prev.map((t): TileInPlay => {
          if (t.id === tileId) {
            return {
              ...t,
              owner: "player",
              position: getRackPosition("player", newIndex),
              rotation: getRackRotation("player"),
              faceUp: true,
              rackIndex: newIndex,
            };
          }
          return t;
        })
      );

      setPlayerDrawnCount(newIndex + 1);
      onPhaseChange?.("dealing", { drawn: newIndex + 1, total: 6 });
      setDraggedTile(null);
      onDraggingChange?.(false);
    }
    
    // During playing phase - draw one tile
    if (gamePhase === "playing" && currentPlayer === "player" && !hasDrawnThisTurn) {
      setTiles((prev) =>
        prev.map((t): TileInPlay => {
          if (t.id === tileId) {
            return {
              ...t,
              owner: "player",
              position: getRackPosition("player", newIndex),
              rotation: getRackRotation("player"),
              faceUp: true,
              rackIndex: newIndex,
            };
          }
          return t;
        })
      );

      setHasDrawnThisTurn(true); // Mark as drawn
      setDraggedTile(null);
      onDraggingChange?.(false);
    }
  };

  // Handle player dragging tile from their hand
  const handleHandTileDrag = (tileId: string, event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (gamePhase !== "playing" || currentPlayer !== "player") return;
    
    // Can only drag from hand AFTER drawing
    if (!hasDrawnThisTurn) return;

    setDraggedTile(tileId);
    onDraggingChange?.(true);
  };

  // Handle drag movement
  const handleDragMove = (event: ThreeEvent<PointerEvent>) => {
    if (!draggedTile || gamePhase !== "playing") return;
    
    const intersectPoint = event.point;
    setTiles((prev) =>
      prev.map((t): TileInPlay => {
        if (t.id === draggedTile) {
          return {
            ...t,
            position: [intersectPoint.x, 0.2, intersectPoint.z] as [number, number, number],
          };
        }
        return t;
      })
    );
  };

  // Handle drop
  const handleDrop = (event: ThreeEvent<PointerEvent>) => {
    if (!draggedTile) return;

    const intersectPoint = event.point;
    const tile = tiles.find((t) => t.id === draggedTile);
    
    if (!tile) {
      setDraggedTile(null);
      onDraggingChange?.(false);
      return;
    }

    // Check if dropped in center (discard zone)
    const distanceFromCenter = Math.sqrt(intersectPoint.x ** 2 + (intersectPoint.z - 0.4) ** 2);
    
    if (distanceFromCenter < 0.7 && tile.owner === "player" && gamePhase === "playing") {
      // Discard tile to center
      const discardCount = tiles.filter((t) => t.owner === "discard").length;
      
      setTiles((prev) => {
        // Remove from hand and add to discard
        const newHand = prev
          .filter((t) => t.owner === "player" && t.id !== draggedTile)
          .map((t, idx): TileInPlay => ({
            ...t,
            position: getRackPosition("player", idx),
            rackIndex: idx,
          }));

        return prev.map((t): TileInPlay => {
          if (t.id === draggedTile) {
            return {
              ...t,
              owner: "discard",
              position: [
                -0.4 + (discardCount % 4) * 0.25,
                0.09,
                0.3 + Math.floor(discardCount / 4) * 0.2,
              ] as [number, number, number],
              rotation: [0, Math.random() * 0.3, 0] as [number, number, number],
              faceUp: true,
              rackIndex: undefined,
            };
          }
          // Reindex other player tiles
          const updatedTile = newHand.find((nt) => nt.id === t.id);
          return updatedTile || t;
        });
      });

      // Reset draw flag and advance to next opponent
      setHasDrawnThisTurn(false);
      setCurrentPlayer("opponent1");
    } else if (tile.owner === "player") {
      // Dropped back in rack - allow rearranging
      const playerTiles = tiles.filter((t) => t.owner === "player" && t.id !== draggedTile);
      
      // Find insertion index based on X position
      let insertIndex = 0;
      for (let i = 0; i < playerTiles.length; i++) {
        const tileX = playerTiles[i].position[0];
        if (intersectPoint.x > tileX) {
          insertIndex = i + 1;
        } else {
          break;
        }
      }

      setTiles((prev) => {
        const draggedTileData = prev.find((t) => t.id === draggedTile);
        if (!draggedTileData) return prev;

        const otherPlayerTiles = prev.filter((t) => t.owner === "player" && t.id !== draggedTile);
        const newOrder = [
          ...otherPlayerTiles.slice(0, insertIndex),
          draggedTileData,
          ...otherPlayerTiles.slice(insertIndex),
        ];

        return prev.map((t): TileInPlay => {
          const newIndex = newOrder.findIndex((nt) => nt.id === t.id);
          if (newIndex !== -1) {
            return {
              ...t,
              position: getRackPosition("player", newIndex),
              rackIndex: newIndex,
            };
          }
          return t;
        });
      });
    }

    setDraggedTile(null);
    onDraggingChange?.(false);
  };

  const nextWallTile = tiles.find((t) => t.owner === "wall");

  return (
    <>
      {/* Invisible drag plane */}
      <mesh
        ref={planeRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={handleDragMove}
        onPointerUp={handleDrop}
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
        const isNextWallTile = nextWallTile?.id === tile.id;
        const isPlayerTile = tile.owner === "player";
        
        // Show golden ring during dealing OR during playing if player hasn't drawn yet
        const showWallRing = isNextWallTile && 
          ((gamePhase === "dealing") || 
           (gamePhase === "playing" && currentPlayer === "player" && !hasDrawnThisTurn));
        
        const canDragFromWall = isNextWallTile && 
          ((gamePhase === "dealing") || 
           (gamePhase === "playing" && currentPlayer === "player" && !hasDrawnThisTurn));
        
        const canDragFromHand = isPlayerTile && 
          gamePhase === "playing" && 
          currentPlayer === "player" && 
          hasDrawnThisTurn; // Can only drag from hand AFTER drawing

        return (
          <group key={tile.id} position={tile.position} rotation={tile.rotation}>
            {/* Golden ring on next drawable wall tile */}
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
            {canDragFromWall && (
              <mesh
                position={[0, 0, 0]}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleWallTileDrag(tile.id, e);
                }}
                visible={false}
              >
                <boxGeometry args={[0.15, 0.04, 0.2]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
            )}

            {/* Clickable hitbox for player hand tiles */}
            {canDragFromHand && (
              <mesh
                position={[0, 0, 0]}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleHandTileDrag(tile.id, e);
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
    </>
  );
}

