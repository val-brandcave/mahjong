"use client";

import { RoundedBox } from "@react-three/drei";

export function MahjongTable() {
  // Table dimensions - RECTANGULAR
  const tableWidth = 7;   // X-axis (left-right) - WIDER
  const tableDepth = 5;   // Z-axis (front-back) - original
  const tableHeight = 0.1;
  const legHeight = 1;
  const legSize = 0.15;

  return (
    <group position={[0, -legHeight / 2, 0]}>
      {/* Table surface - Teal - RECTANGULAR */}
      <RoundedBox
        args={[tableWidth, tableHeight, tableDepth]}
        radius={0.05}
        smoothness={4}
        position={[0, legHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#3e9eab" // Teal
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Table legs (4 corners) */}
      {[
        [-tableWidth / 2 + 0.3, 0, -tableDepth / 2 + 0.3],
        [tableWidth / 2 - 0.3, 0, -tableDepth / 2 + 0.3],
        [-tableWidth / 2 + 0.3, 0, tableDepth / 2 - 0.3],
        [tableWidth / 2 - 0.3, 0, tableDepth / 2 - 0.3],
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

      {/* Center ring removed per user request */}
    </group>
  );
}

