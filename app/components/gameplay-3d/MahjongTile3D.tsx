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
  neutralColor?: boolean; // If true, no pink tint on back
}

export function MahjongTile3D({
  position,
  rotation = [0, 0, 0],
  tileName,
  faceUp = true,
  scale = 1,
  onClick,
  neutralColor = false,
}: MahjongTile3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures
  const faceTexture = useTexture(`/tiles/regular/${tileName}.png`);
  const backTexture = useTexture("/tiles/regular/Back.png");

  // Mahjong tile dimensions (in units, scaled appropriately)
  // Portrait orientation to match tile PNG aspect ratios - scaled down by half
  const tileWidth = 0.1 * scale;   // Width (thin side)
  const tileHeight = 0.04 * scale; // Height (vertical)
  const tileDepth = 0.15 * scale;   // Depth (long side - portrait)
  const tileFaceLength = 0.2 * scale; // Face length for portrait aspect

  // Create rounded box geometry
  const radius = 0.02 * scale; // Rounded edge radius
  const smoothness = 8; // Segments for rounding

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Main tile body with rounded edges */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[tileDepth, tileHeight, tileFaceLength, 16, 16, 16]} />
        <meshStandardMaterial
          color="#F5E6D3" // Creamy tile color
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Edge lines for better distinction */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(tileDepth, tileHeight, tileFaceLength)]} />
        <lineBasicMaterial color="#C4B5A0" linewidth={2} transparent opacity={0.6} />
      </lineSegments>

      {/* Top face (tile face) - Portrait orientation */}
      <mesh
        position={[0, tileHeight / 2 + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileFaceLength * 0.95]} />
        <meshStandardMaterial
          map={faceUp ? faceTexture : backTexture}
          color={faceUp ? "#FFFFFF" : (neutralColor ? "#F5E6D3" : "#e44184")} // Beige for neutral, pink top for game tiles
          transparent={true}
          alphaTest={0.1}
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
        <planeGeometry args={[tileDepth * 0.95, tileFaceLength * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>

      {/* Back face (portrait - long side) */}
      <mesh
        position={[0, 0, -tileFaceLength / 2 - 0.001]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial
          map={backTexture}
          color={neutralColor ? "#F5E6D3" : "#FFB6C1"} // Beige for neutral, pink for game tiles
          transparent={true}
          alphaTest={0.1}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Front face (portrait - long side) */}
      <mesh
        position={[0, 0, tileFaceLength / 2 + 0.001]}
        rotation={[0, Math.PI, 0]}
        castShadow
      >
        <planeGeometry args={[tileDepth * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial
          map={backTexture}
          color={neutralColor ? "#F5E6D3" : "#FFB6C1"} // Beige for neutral, pink for game tiles
          transparent={true}
          alphaTest={0.1}
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
        <planeGeometry args={[tileFaceLength * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>

      {/* Right side (short end) */}
      <mesh
        position={[tileDepth / 2 + 0.001, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
      >
        <planeGeometry args={[tileFaceLength * 0.95, tileHeight * 0.95]} />
        <meshStandardMaterial color="#E8D4B8" roughness={0.4} />
      </mesh>
    </group>
  );
}

