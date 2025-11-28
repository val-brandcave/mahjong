"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CharlestonTileAnimationProps {
  tiles: string[];
  direction: "right" | "across" | "left";
  playerPosition: "east" | "south" | "west" | "north";
  onAnimationComplete: () => void;
}

export function CharlestonTileAnimation({
  tiles,
  direction,
  playerPosition,
  onAnimationComplete
}: CharlestonTileAnimationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  const animationDone = useRef(false);

  // Calculate starting and target positions based on direction
  const getPositions = () => {
    const tableRadius = 1.2;
    
    // Player positions (East = bottom)
    const positions = {
      east: new THREE.Vector3(0, 0.02, tableRadius),
      south: new THREE.Vector3(tableRadius, 0.02, 0),
      west: new THREE.Vector3(0, 0.02, -tableRadius),
      north: new THREE.Vector3(-tableRadius, 0.02, 0),
    };

    const startPos = positions[playerPosition];
    let targetPos: THREE.Vector3;

    // Determine target based on direction
    if (direction === "right") {
      const targetPlayer = { east: "south", south: "west", west: "north", north: "east" }[playerPosition] as keyof typeof positions;
      targetPos = positions[targetPlayer];
    } else if (direction === "across") {
      const targetPlayer = { east: "west", south: "north", west: "east", north: "south" }[playerPosition] as keyof typeof positions;
      targetPos = positions[targetPlayer];
    } else {
      const targetPlayer = { east: "north", south: "east", west: "south", north: "west" }[playerPosition] as keyof typeof positions;
      targetPos = positions[targetPlayer];
    }

    return { startPos, targetPos };
  };

  const { startPos, targetPos } = getPositions();

  useFrame(({ clock }) => {
    if (!groupRef.current || animationDone.current) return;

    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTime.current;
    const duration = 2.0; // 2 seconds for animation
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const easedProgress = easeInOutCubic(progress);

    // Interpolate position
    const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, easedProgress);
    
    // Add slight arc motion
    currentPos.y += Math.sin(easedProgress * Math.PI) * 0.15;
    
    groupRef.current.position.copy(currentPos);

    // Fade out near the end
    if (progress > 0.8) {
      const fadeProgress = (progress - 0.8) / 0.2;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.opacity = 1 - fadeProgress;
          material.transparent = true;
        }
      });
    }

    // Complete animation
    if (progress >= 1 && !animationDone.current) {
      animationDone.current = true;
      onAnimationComplete();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Three face-down tiles stacked slightly */}
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[index * 0.08 - 0.08, index * 0.005, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.06, 0.08, 0.008]} />
          <meshStandardMaterial 
            color="#2d5016" 
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

