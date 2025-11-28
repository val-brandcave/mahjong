"use client";

import * as THREE from "three";

interface TileRackProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string; // "pink" | "green" | "blue" | "yellow"
}

export function TileRack({ position, rotation, color }: TileRackProps) {
  // Color mapping - Custom colors
  const colorMap: Record<string, string> = {
    pink: "#c6080c",    // Red
    green: "#0b9d58",   // Green
    blue: "#0a559e",    // Blue
    yellow: "#d6af49",  // Yellow
  };

  const rackColor = colorMap[color] || "#666666";

  // Rack dimensions - redesigned to hold tiles properly (doubled width)
  const rackWidth = 4.0;   // Width to hold ~16-18 tiles comfortably (doubled from 2.0)
  const rackBaseHeight = 0.03; // Thinner base
  const rackDepth = 0.3;   // Depth for tile area
  const backHeight = 0.25; // Back wall height (tall enough for standing tiles)
  const sideHeight = 0.25; // Side wall height
  const topSlabDepth = 0.4; // Top slab for exposed combinations

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
    </group>
  );
}

