"use client";

import React from "react";
import { MahjongTile3D } from "./MahjongTile3D";

interface FilledTileRackProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: "blue" | "pink" | "green";
}

export function FilledTileRack({ position, rotation, color }: FilledTileRackProps) {
  // Match TileRack dimensions exactly
  const rackWidth = 4.0;
  const rackBaseHeight = 0.03;
  const rackDepth = 0.3;
  const backHeight = 0.25;
  const sideHeight = 0.25;
  const topSlabDepth = 0.4;

  // Color mapping - Custom colors
  const colorMap = {
    blue: "#0a559e",
    pink: "#c6080c",
    green: "#0b9d58",
  };

  const rackColor = colorMap[color];

  // 12 tiles centered in rack (in LOCAL coordinates)
  // Spacing: 0.21 between tiles
  // Total span: 11 * 0.21 = 2.31 units
  // Center offset: ±1.155 from center
  // Tiles sit on base at Y = rackBaseHeight + 0.115
  const tilePositions: [number, number, number][] = [
    [-1.155, rackBaseHeight + 0.115, 0],
    [-0.945, rackBaseHeight + 0.115, 0],
    [-0.735, rackBaseHeight + 0.115, 0],
    [-0.525, rackBaseHeight + 0.115, 0],
    [-0.315, rackBaseHeight + 0.115, 0],
    [-0.105, rackBaseHeight + 0.115, 0],
    [0.105, rackBaseHeight + 0.115, 0],
    [0.315, rackBaseHeight + 0.115, 0],
    [0.525, rackBaseHeight + 0.115, 0],
    [0.735, rackBaseHeight + 0.115, 0],
    [0.945, rackBaseHeight + 0.115, 0],
    [1.155, rackBaseHeight + 0.115, 0],
  ];

  return (
    <group position={position} rotation={rotation}>
      {/* Base platform - where tiles sit */}
      <mesh position={[0, rackBaseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[rackWidth, rackBaseHeight, rackDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Back wall (tall wall behind tiles) */}
      <mesh
        position={[0, backHeight / 2 + rackBaseHeight, -rackDepth / 2 + 0.015]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[rackWidth, backHeight, 0.03]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Left side wall */}
      <mesh
        position={[-rackWidth / 2 + 0.015, sideHeight / 2 + rackBaseHeight, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.03, sideHeight, rackDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
        />
      </mesh>

      {/* Right side wall */}
      <mesh
        position={[rackWidth / 2 - 0.015, sideHeight / 2 + rackBaseHeight, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.03, sideHeight, rackDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
        />
      </mesh>

      {/* TOP SLAB - For exposed combinations */}
      <mesh
        position={[0, rackBaseHeight / 2, rackDepth / 2 + topSlabDepth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[rackWidth, rackBaseHeight, topSlabDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Top slab left edge */}
      <mesh
        position={[-rackWidth / 2 + 0.015, 0.06, rackDepth / 2 + topSlabDepth / 2]}
        castShadow
      >
        <boxGeometry args={[0.03, 0.06, topSlabDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
        />
      </mesh>

      {/* Top slab right edge */}
      <mesh
        position={[rackWidth / 2 - 0.015, 0.06, rackDepth / 2 + topSlabDepth / 2]}
        castShadow
      >
        <boxGeometry args={[0.03, 0.06, topSlabDepth]} />
        <meshStandardMaterial
          color={rackColor}
          opacity={1.0}
          roughness={0.4}
        />
      </mesh>

      {/* 6 tiles standing in rack (in LOCAL coordinates) */}
      {tilePositions.map((tilePos, index) => (
        <MahjongTile3D
          key={`filled-tile-${index}`}
          position={tilePos}
          rotation={[Math.PI / 2, 0, 0]} // Standing upright
          tileName="Man1"
          faceUp={false}
          neutralColor={true}
          scale={1}
        />
      ))}
    </group>
  );
}

