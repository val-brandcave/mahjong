"use client";

import { RoundedBox } from "@react-three/drei";

export function MahjongTable() {
  // Table dimensions
  const tableSize = 5;
  const tableHeight = 0.1;
  const legHeight = 1;
  const legSize = 0.15;

  return (
    <group position={[0, -legHeight / 2, 0]}>
      {/* Table surface */}
      <RoundedBox
        args={[tableSize, tableHeight, tableSize]}
        radius={0.05}
        smoothness={4}
        position={[0, legHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#2D5016" // Traditional green felt
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Table legs (4 corners) */}
      {[
        [-tableSize / 2 + 0.3, 0, -tableSize / 2 + 0.3],
        [tableSize / 2 - 0.3, 0, -tableSize / 2 + 0.3],
        [-tableSize / 2 + 0.3, 0, tableSize / 2 - 0.3],
        [tableSize / 2 - 0.3, 0, tableSize / 2 - 0.3],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[legSize, legSize, legHeight, 16]} />
          <meshStandardMaterial color="#3E2723" roughness={0.6} />
        </mesh>
      ))}

      {/* Center discard area marker (optional) */}
      <mesh
        position={[0, legHeight / 2 + tableHeight / 2 + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshStandardMaterial
          color="#1A3A0F"
          transparent
          opacity={0.3}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

