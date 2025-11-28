"use client";

import React from "react";
import * as THREE from "three";

interface DiceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  value: number; // 1-6
}

export function Dice({ position, rotation, value }: DiceProps) {
  // Create dot textures for each face
  const createDotTexture = (dots: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 128, 128);

    // Black dots
    ctx.fillStyle = "#000000";
    const dotRadius = 12;
    const positions: { [key: number]: [number, number][] } = {
      1: [[64, 64]],
      2: [[32, 32], [96, 96]],
      3: [[32, 32], [64, 64], [96, 96]],
      4: [[32, 32], [96, 32], [32, 96], [96, 96]],
      5: [[32, 32], [96, 32], [64, 64], [32, 96], [96, 96]],
      6: [[32, 32], [96, 32], [32, 64], [96, 64], [32, 96], [96, 96]],
    };

    positions[dots]?.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Create materials for each face
  const materials = React.useMemo(() => {
    // Standard dice: opposite faces sum to 7
    // Front(2)/Back(5), Right(3)/Left(4), Top(6)/Bottom(1)
    const faceValues = [3, 4, 6, 1, 2, 5]; // right, left, top, bottom, front, back
    
    return faceValues.map((dots, i) => {
      if (i === 2 && dots === value) {
        // Highlight the top face if it matches the value
        return new THREE.MeshStandardMaterial({
          map: createDotTexture(dots),
          color: "#FFFFFF",
        });
      }
      return new THREE.MeshStandardMaterial({
        map: createDotTexture(dots),
        color: "#F5F5F5",
      });
    });
  }, [value]);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      {materials.map((material, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} {...material} />
      ))}
    </mesh>
  );
}

