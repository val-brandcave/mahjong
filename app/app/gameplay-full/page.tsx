"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import { Suspense, useState } from "react";
import { MahjongTable } from "@/components/gameplay-3d/MahjongTable";
import { FullGameplayV2 } from "@/components/gameplay-3d/FullGameplayV2";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, ArrowLeft, Map, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GameplayFullPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gamePhase, setGamePhase] = useState<"dealing" | "playing" | "won" | "transition">("dealing");
  const [phaseInfo, setPhaseInfo] = useState<any>({});
  const [showScorecard, setShowScorecard] = useState(false);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Top Nav Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/gameplay-3d">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link href="/gameplay-landscape">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/90 hover:text-white hover:bg-white/10 text-xs"
              >
                Landscape Mode
              </Button>
            </Link>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Scorecard Button */}
      <div className="absolute top-16 right-4 z-10">
        <Button
          size="icon"
          onClick={() => setShowScorecard(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
        >
          <Map className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Camera - player perspective */}
          <PerspectiveCamera
            makeDefault
            position={[0, 3, 4]}
            fov={50}
          />
          
          {/* Controls */}
          <OrbitControls
            enabled={!isDragging}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2.5}
            maxDistance={8}
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
          <FullGameplayV2 
            onDraggingChange={setIsDragging}
            onWin={() => setGameWon(true)}
            onPhaseChange={(phase, info) => {
              setGamePhase(phase as any);
              setPhaseInfo(info);
            }}
          />

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

      {/* Transition Popup */}
      {gamePhase === "transition" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 rounded-2xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Dealing Complete!</h2>
            <p className="text-white/90 text-lg">
              {phaseInfo?.message || "Pick a new tile from the wall and discard"}
            </p>
          </div>
        </div>
      )}

      {/* Scorecard Modal */}
      {showScorecard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              onClick={() => setShowScorecard(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scorecard title */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-500">
              <h2 className="text-2xl font-bold text-white">Winning Combinations</h2>
              <p className="text-white/80 text-sm mt-1">American Mahjong Scorecard</p>
            </div>

            {/* Scorecard image */}
            <div className="p-6">
              <img
                src="/score-card/score-card.jpg"
                alt="American Mahjong Scorecard"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {gameWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-2xl p-8 max-w-md mx-4 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Mahjong!</h2>
            <p className="text-white/80 mb-6">You won the game!</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Play Again
              </Button>
              <Button
                onClick={() => router.push("/home")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

