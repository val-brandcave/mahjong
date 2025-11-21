"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { MahjongTable } from "@/components/gameplay-3d/MahjongTable";
import { GameplayScenes } from "@/components/gameplay-3d/GameplayScenes";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import Link from "next/link";

const SCENES = [
  {
    id: 0,
    title: "Initial Setup",
    description: "Walls are built with tiles face down in a square formation",
    duration: 3000,
  },
  {
    id: 1,
    title: "Breaking the Wall",
    description: "Dealer rolls dice and tiles are dealt to each player",
    duration: 4000,
  },
  {
    id: 2,
    title: "The Charleston",
    description: "Players pass tiles to neighbors (right, across, left)",
    duration: 5000,
  },
  {
    id: 3,
    title: "Gameplay",
    description: "Draw a tile, discard a tile - building your hand",
    duration: 4000,
  },
  {
    id: 4,
    title: "Calling a Tile",
    description: "Player calls a discard to complete a Pung",
    duration: 4000,
  },
  {
    id: 5,
    title: "Mahjong!",
    description: "Winning hand revealed - matching a card pattern",
    duration: 5000,
  },
];

export default function Gameplay3DPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<"overview" | "player" | "closeup">("overview");

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;

    const sceneDuration = SCENES[currentScene].duration;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (16 / sceneDuration); // ~60fps
        if (newProgress >= 1) {
          // Move to next scene
          if (currentScene < SCENES.length - 1) {
            setCurrentScene((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 1;
          }
        }
        return newProgress;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene((s) => s + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      setCurrentScene((s) => s - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const getCameraPosition = (): [number, number, number] => {
    switch (cameraPreset) {
      case "overview":
        return [0, 6, 6];
      case "player":
        return [0, 2, 4];
      case "closeup":
        return [0, 3, 3];
      default:
        return [0, 6, 6];
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/home" className="text-white/80 hover:text-white text-sm">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">
              3D Mahjong Gameplay POC
            </h1>
            <p className="text-white/70 text-sm">Interactive demonstration of American Mahjong</p>
          </div>
          
          {/* Camera presets */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={cameraPreset === "overview" ? "default" : "outline"}
              onClick={() => setCameraPreset("overview")}
              className="text-xs"
            >
              Overview
            </Button>
            <Button
              size="sm"
              variant={cameraPreset === "player" ? "default" : "outline"}
              onClick={() => setCameraPreset("player")}
              className="text-xs"
            >
              Player View
            </Button>
            <Button
              size="sm"
              variant={cameraPreset === "closeup" ? "default" : "outline"}
              onClick={() => setCameraPreset("closeup")}
              className="text-xs"
            >
              Close Up
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={getCameraPosition()}
            fov={50}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2.1}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.3} />

          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />

          {/* Scene */}
          <MahjongTable />
          <GameplayScenes scene={currentScene} progress={progress} />

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

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          {/* Scene Info */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              Scene {currentScene + 1}: {SCENES[currentScene].title}
            </h2>
            <p className="text-white/70 text-sm">
              {SCENES[currentScene].description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-100"
              style={{ width: `${(currentScene / (SCENES.length - 1)) * 100}%` }}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={handleReset}
              disabled={currentScene === 0 && progress === 0}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentScene === 0}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4 text-white" />
            </Button>

            <Button
              size="icon"
              variant="default"
              onClick={handlePlayPause}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleNext}
              disabled={currentScene === SCENES.length - 1}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4 text-white" />
            </Button>

            <div className="text-white/70 text-sm ml-4">
              {currentScene + 1} / {SCENES.length}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mt-4 text-white/50 text-xs">
            <p>Drag to rotate • Scroll to zoom • Right-click to pan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

