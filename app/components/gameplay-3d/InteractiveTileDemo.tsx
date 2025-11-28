"use client";

import { useState, useRef } from "react";
import { MahjongTile3D } from "./MahjongTile3D";
import { ThreeEvent } from "@react-three/fiber";
import { SAMPLE_TILES } from "@/lib/data/tile-sets";
import * as THREE from "three";

interface TileState {
  id: string;
  tileName: string;
  position: [number, number, number];
  selected: boolean;
  dragging: boolean;
}

interface InteractiveTileDemoProps {
  onDraggingChange?: (isDragging: boolean) => void;
}

export function InteractiveTileDemo({ onDraggingChange }: InteractiveTileDemoProps) {
  // Player's hand (13 tiles - interactive)
  const playerTiles = SAMPLE_TILES.mixed.slice(0, 13);
  
  const [tiles, setTiles] = useState<TileState[]>(
    playerTiles.map((tileName, i) => ({
      id: `player-${i}`,
      tileName,
      position: [-1.2 + i * 0.19, 0.07, 1.2] as [number, number, number], // Player at bottom
      selected: false,
      dragging: false,
    }))
  );

  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; z: number } | null>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  const handleTileClick = (tileId: string, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    // Toggle selection
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        selected: tile.id === tileId ? !tile.selected : false,
      }))
    );
    
    const tile = tiles.find((t) => t.id === tileId);
    if (tile) {
      setSelectedTileId(tile.selected ? null : tileId);
    }
  };

  const handlePointerDown = (tileId: string, event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        dragging: tile.id === tileId,
        selected: tile.id === tileId,
      }))
    );
    
    const tile = tiles.find((t) => t.id === tileId);
    if (tile) {
      setDragStart({ x: tile.position[0], z: tile.position[2] });
      setSelectedTileId(tileId);
      onDraggingChange?.(true); // Disable camera controls
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const draggingTile = tiles.find((t) => t.dragging);
    if (!draggingTile || !dragStart) return;

    // Get pointer position on the table plane
    const intersectPoint = event.point;
    
      setTiles((prevTiles) =>
      prevTiles.map((tile) =>
        tile.id === draggingTile.id
          ? {
              ...tile,
              position: [
                intersectPoint.x,
                0.07 + 0.08, // Lift tile while dragging (scaled lift)
                intersectPoint.z,
              ] as [number, number, number],
            }
          : tile
      )
    );
  };

  const handlePointerUp = () => {
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        dragging: false,
        position: [tile.position[0], 0.07, tile.position[2]] as [number, number, number], // Drop back to table
      }))
    );
    setDragStart(null);
    onDraggingChange?.(false); // Re-enable camera controls
  };

  const handleTableClick = () => {
    // Deselect all tiles when clicking the table
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        selected: false,
      }))
    );
    setSelectedTileId(null);
  };

  // Other players' tiles (face down, non-interactive)
  const opponentTiles = Array(13).fill("Back");

  return (
    <group>
      {/* Interactive invisible plane for dragging */}
      <mesh
        ref={planeRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleTableClick}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* OPPONENT 1 - Right side (East) - Tiles facing left */}
      {opponentTiles.map((_, i) => (
        <group key={`right-${i}`}>
          <MahjongTile3D
            position={[1.2, 0.07, -1.2 + i * 0.19]}
            rotation={[0, Math.PI / 2, 0]}
            tileName="Back"
            faceUp={false}
            scale={1}
          />
        </group>
      ))}

      {/* OPPONENT 2 - Top side (North) - Tiles facing down */}
      {opponentTiles.map((_, i) => (
        <group key={`top-${i}`}>
          <MahjongTile3D
            position={[1.2 - i * 0.19, 0.07, -1.2]}
            rotation={[0, Math.PI, 0]}
            tileName="Back"
            faceUp={false}
            scale={1}
          />
        </group>
      ))}

      {/* OPPONENT 3 - Left side (West) - Tiles facing right */}
      {opponentTiles.map((_, i) => (
        <group key={`left-${i}`}>
          <MahjongTile3D
            position={[-1.2, 0.07, 1.2 - i * 0.19]}
            rotation={[0, -Math.PI / 2, 0]}
            tileName="Back"
            faceUp={false}
            scale={1}
          />
        </group>
      ))}

      {/* PLAYER (You) - Bottom side (South) - Interactive tiles */}
      {tiles.map((tile) => (
        <group key={tile.id}>
          {/* Tile with clickable hitbox */}
          <group position={tile.position}>
            {/* Invisible clickable box matching tile dimensions (portrait: 0.15 x 0.04 x 0.2) - scaled by half */}
            <mesh
              onPointerDown={(e) => {
                e.stopPropagation();
                handlePointerDown(tile.id, e);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTileClick(tile.id, e);
              }}
              visible={false}
            >
              <boxGeometry args={[0.15, 0.04, 0.2]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            
            {/* Actual tile visual */}
            <MahjongTile3D
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              tileName={tile.tileName}
              faceUp={true}
              scale={1}
            />
          </group>

          {/* Selection indicator - scaled by half */}
          {tile.selected && (
            <mesh position={[tile.position[0], 0.06, tile.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.11, 0.13, 32]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
            </mesh>
          )}

          {/* Hover glow effect */}
          {tile.selected && (
            <pointLight
              position={[tile.position[0], tile.position[1] + 0.3, tile.position[2]]}
              color="#FFD700"
              intensity={0.5}
              distance={0.8}
            />
          )}
        </group>
      ))}

      {/* Instructions hint */}
      <group position={[0, 0.3, -0.5]}>
        {/* We'll add text instructions via the UI instead */}
      </group>
    </group>
  );
}

