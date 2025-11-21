"use client";

import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface MahjongTile3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  tileName: string; // e.g., "Man1", "Bam3", "Chun"
  faceUp?: boolean;
  scale?: number;
  onClick?: () => void;
}

export function MahjongTile3D({
  position,
  rotation = [0, 0, 0],
  tileName,
  faceUp = true,
  scale = 1,
  onClick,
}: MahjongTile3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const faceTexture = useTexture(`/tiles/regular/${tileName}.png`);
  const backTexture = useTexture("/tiles/regular/Back.png");

  // Mahjong tile dimensions (in units, scaled appropriately)
  // Real tiles are roughly 30mm x 22mm x 16mm (L x W x H)
  const tileWidth = 0.22 * scale;
  const tileHeight = 0.16 * scale;
  const tileDepth = 0.3 * scale;

  // Create rounded box geometry
  const radius = 0.02 * scale; // Rounded edge radius
  const smoothness = 8; // Segments for rounding

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Main tile body with rounded edges */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[tileDepth, tileHeight, tileWidth, 16, 16, 16]} />
        <meshStandardMaterial
          color="#F5E6D3" // Creamy tile color
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Top face (tile face) */}
      <mesh
        position={[0, tileHeight / 2 + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileWidth * 0.95]} />
        <meshStandardMaterial
          map={faceUp ? faceTexture : backTexture}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Bottom face */}
      <mesh
        position={[0, -tileHeight / 2 - 0.001, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileWidth * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>

      {/* Back face (long side) */}
      <mesh
        position={[0, 0, -tileWidth / 2 - 0.001]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial
          map={backTexture}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Front face (long side) */}
      <mesh
        position={[0, 0, tileWidth / 2 + 0.001]}
        rotation={[0, Math.PI, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial
          map={backTexture}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Left side (short end) */}
      <mesh
        position={[-tileDepth / 2 - 0.001, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <planeGeometry args={[tileWidth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>

      {/* Right side (short end) */}
      <mesh
        position={[tileDepth / 2 + 0.001, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
      >
        <planeGeometry args={[tileWidth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>
    </group>
  );
}

