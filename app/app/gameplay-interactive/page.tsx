"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import { Suspense, useState } from "react";
import { MahjongTable } from "@/components/gameplay-3d/MahjongTable";
import { InteractiveTileDemo } from "@/components/gameplay-3d/InteractiveTileDemo";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GameplayInteractivePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const handleReset = () => {
    // Refresh the page to reset
    window.location.reload();
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/gameplay-3d" className="text-white/80 hover:text-white text-sm flex items-center gap-2">
              ← Back to Showcase
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">
              Interactive Tile Demo
            </h1>
            <p className="text-white/70 text-sm">Click and drag tiles • Full interactivity</p>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Camera - positioned to see player's tiles from their perspective */}
          <PerspectiveCamera
            makeDefault
            position={[0, 2.5, 3.5]}
            fov={50}
          />
          
          {/* Controls - disabled when dragging tiles */}
          <OrbitControls
            enabled={!isDragging}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 0]}
          />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          <pointLight position={[-3, 3, 3]} intensity={0.3} />
          <pointLight position={[3, 3, -3]} intensity={0.3} />

          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />

          {/* Scene */}
          <MahjongTable />
          <InteractiveTileDemo onDraggingChange={setIsDragging} />

          {/* Ground */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.55, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </Suspense>
      </Canvas>

    </div>
  );
}

