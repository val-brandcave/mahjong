"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { MahjongTable } from "@/components/gameplay-3d/MahjongTable";
import { FullGameplayHybridWithRef } from "@/components/gameplay-3d/FullGameplayHybrid";
import { PlayerRack2DClean } from "@/components/gameplay-3d/PlayerRack2DClean";
import { SequentialDiceRolls } from "@/components/gameplay-3d/SequentialDiceRolls";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Map, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// Camera zoom animation component
function CameraZoomAnimation({ onComplete }: { onComplete: () => void }) {
  const startTime = useRef<number | null>(null);
  const animationDone = useRef(false);

  useFrame(({ camera, clock }) => {
    if (animationDone.current) return;

    // Initialize start time on first frame
    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTime.current;
    const duration = 1.4;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-in-out cubic for smooth motion)
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const easedProgress = easeInOutCubic(progress);

    // Zoom from distance 10 (max zoom out) to distance 3 (max zoom in)
    const startDistance = 10;
    const endDistance = 3;
    const currentDistance = startDistance - (startDistance - endDistance) * easedProgress;

    // Final resting position: FOV 60°, Elevation 60°, Distance 3
    const finalElevationDeg = 60;
    const finalElevationRad = (finalElevationDeg * Math.PI) / 180;
    
    // Calculate camera position using elevation angle
    const horizontalDistance = currentDistance * Math.cos(finalElevationRad);
    const height = currentDistance * Math.sin(finalElevationRad);
    
    // Z distance (back from table)
    const zDistance = horizontalDistance;
    
    camera.position.set(0, height, zDistance);

    // Mark as done when animation completes
    if (progress >= 1 && !animationDone.current) {
      animationDone.current = true;
      console.log("🎬 ZOOM ANIMATION COMPLETE - calling onComplete");
      onComplete(); // Notify parent that animation is done
    }
  });

  return null;
}

// Camera angle auto-reset controller (both azimuth and polar)
function CameraAngleAutoReset({ orbitControlsRef, enabled }: { orbitControlsRef: any; enabled: boolean }) {
  const isMouseDown = useRef(false);
  const resetStartTime = useRef<number | null>(null);
  const targetPolarAngle = (60 * Math.PI) / 180; // Default 60 degrees

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
      resetStartTime.current = null;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      resetStartTime.current = null; // Start reset on next frame
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useFrame(({ clock, camera }) => {
    if (!orbitControlsRef.current || !enabled) return; // Only run if enabled

    const controls = orbitControlsRef.current;

    // If mouse is up, animate both angles back to defaults
    if (!isMouseDown.current) {
      const currentAzimuth = controls.getAzimuthalAngle();
      const currentPolar = controls.getPolarAngle();
      
      const needsAzimuthReset = Math.abs(currentAzimuth) > 0.01;
      const needsPolarReset = Math.abs(currentPolar - targetPolarAngle) > 0.01;

      if (needsAzimuthReset || needsPolarReset) {
        // Initialize reset timer
        if (resetStartTime.current === null) {
          resetStartTime.current = clock.getElapsedTime();
        }

        const elapsed = clock.getElapsedTime() - resetStartTime.current;
        const resetDuration = 0.5; // 0.5 seconds to snap back
        const progress = Math.min(elapsed / resetDuration, 1);

        // Ease out (smooth deceleration)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        // Reset azimuth to 0
        if (needsAzimuthReset) {
          const newAzimuth = currentAzimuth * (1 - easeOut);
          const deltaAzimuth = newAzimuth - currentAzimuth;
          controls.object.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaAzimuth);
        }

        // Reset polar to 60 degrees
        if (needsPolarReset) {
          const newPolar = currentPolar + (targetPolarAngle - currentPolar) * easeOut;
          
          // Get current camera position relative to target
          const target = new THREE.Vector3();
          controls.target.clone(target);
          
          const offset = camera.position.clone().sub(target);
          const radius = offset.length();
          
          // Calculate new position with target polar angle
          const currentAzimuthAngle = controls.getAzimuthalAngle();
          
          const x = radius * Math.sin(newPolar) * Math.sin(currentAzimuthAngle);
          const y = radius * Math.cos(newPolar);
          const z = radius * Math.sin(newPolar) * Math.cos(currentAzimuthAngle);
          
          camera.position.copy(target).add(new THREE.Vector3(x, y, z));
        }
        
        controls.update();
      } else {
        resetStartTime.current = null;
      }
    }
  });

  return null;
}

export default function GameplayLandscapePage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gamePhase, setGamePhase] = useState<"dealing" | "charleston" | "playing" | "won" | "transition" | "readyToReveal">("dealing");
  const [phaseInfo, setPhaseInfo] = useState<any>({});
  const [showScorecard, setShowScorecard] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDiceAnimation, setShowDiceAnimation] = useState(false);
  const [diceAnimationComplete, setDiceAnimationComplete] = useState(false);
  const [showDrawTilesPopup, setShowDrawTilesPopup] = useState(false);
  const [drawTilesPopupShown, setDrawTilesPopupShown] = useState(false);
  const [canStartDealing, setCanStartDealing] = useState(false);
  const [winningCombination, setWinningCombination] = useState<string[]>([]);
  const orbitControlsRef = useRef<any>(null);
  const gameRef = React.useRef<any>(null);
  
  // Charleston state
  const [charlestonPass, setCharlestonPass] = useState<"right" | "across" | "left">("right");
  const [charlestonComplete, setCharlestonComplete] = useState(false);
  const [showCharlestonPopup, setShowCharlestonPopup] = useState(false);
  const [charlestonUIReady, setCharlestonUIReady] = useState(false);

  const handleReset = () => {
    window.location.reload();
  };

  const handleCharlestonPass = (selectedIndices: number[]) => {
    console.log("🎴 Charleston pass initiated - indices:", selectedIndices);
    console.log("🎴 Current pass:", charlestonPass);
    
    // Get the actual tiles being passed
    const tilesToPass = selectedIndices.map((i) => playerHand[i]);
    console.log("🎴 Tiles being passed:", tilesToPass);
    
    // Immediately remove selected tiles from hand (dissolve effect)
    const newHand = playerHand.filter((_, i) => !selectedIndices.includes(i));
    setPlayerHand(newHand);
    
    // Trigger 3D animation: face-down tiles on table
    gameRef.current?.showCharlestonPass(tilesToPass, charlestonPass);
    
    // Simulate receiving tiles from the opposite direction after animation
    setTimeout(() => {
      // Generate 3 random replacement tiles (in real game, these come from other players)
      const replacementTiles = ["Sou7", "Man4", "Pin9"].map(tile => ({
        name: tile,
        __newlyReceived: true, // Mark for glow effect
      }));
      
      // Add new tiles to the rightmost position
      const updatedHand = [...newHand, ...replacementTiles.map(t => t.name)];
      
      console.log("🎴 Received replacement tiles at rightmost position:", replacementTiles.map(t => t.name));
      console.log("🎴 Updated hand:", updatedHand);
      
      setPlayerHand(updatedHand);
      gameRef.current?.syncPlayerHand(updatedHand);
      
      // Remove the glow marker after 1 second
      setTimeout(() => {
        setPlayerHand(updatedHand); // Reset without markers
        
        // Show next direction popup after glow fades
        setTimeout(() => {
          if (charlestonPass === "right") {
            console.log("🎴 Moving to ACROSS pass");
            setCharlestonPass("across");
            setShowCharlestonPopup(true);
            setTimeout(() => setShowCharlestonPopup(false), 3000);
          } else if (charlestonPass === "across") {
            console.log("🎴 Moving to LEFT pass");
            setCharlestonPass("left");
            setShowCharlestonPopup(true);
            setTimeout(() => setShowCharlestonPopup(false), 3000);
          } else {
            // Charleston complete!
            console.log("🎉 Charleston complete - transitioning to playing phase");
            setCharlestonComplete(true);
            setCharlestonUIReady(false);
            
            // Show completion message
            setShowCharlestonPopup(true);
            setTimeout(() => setShowCharlestonPopup(false), 2000);
            
            setTimeout(() => {
              console.log("🎮 Setting gamePhase to 'playing' and resetting draw state");
              console.log("🎮 Current playerHand length:", playerHand.length);
              setGamePhase("playing");
              setHasDrawnThisTurn(false); // Player hasn't drawn yet - must draw from wall first
              
              // Notify the game engine as well
              if (gameRef.current?.setGamePhase) {
                gameRef.current.setGamePhase("playing");
              }
              
              console.log("✅ Now in PLAYING phase. Player should:");
              console.log("   1. Draw a tile from the wall (playerHand becomes 13)");
              console.log("   2. THEN select a tile to discard");
            }, 1000);
          }
        }, 200);
      }, 1000);
    }, 2500); // Wait for 3D animation
  };

  const handlePlayerTileDiscard = (index: number) => {
    console.log("🎯 handlePlayerTileDiscard called - index:", index, "tile:", playerHand[index]);
    console.log("   Current hand BEFORE:", JSON.stringify(playerHand));
    console.log("   Hand size before discard:", playerHand.length);
    
    // Simplified - just allow discard if 13 tiles
    if (playerHand.length !== 13) {
      console.log("❌ Can't discard - have", playerHand.length, "tiles, need 13");
      return;
    }

    // Remove tile from 2D hand
    const discardedTile = playerHand[index];
    console.log("✅ Discarding tile:", discardedTile, "at index:", index);
    
    // CRITICAL: Create completely new array
    const newHand = playerHand.filter((_, i) => i !== index);
    console.log("   New hand AFTER filter:", JSON.stringify(newHand), "length:", newHand.length);
    
    // Force state update
    setPlayerHand(newHand);
    
    // CRITICAL: Notify child component to sync its state
    gameRef.current?.syncPlayerHand(newHand);
    
    // Verify after state update
    setTimeout(() => {
      console.log("   ⏱️ After setState - playerHand should now be 6 tiles");
    }, 100);
    
    // Add to 3D discard pile
    gameRef.current?.addDiscardTile(discardedTile, "player");
    
    setHasDrawnThisTurn(false);
    console.log("   Reset hasDrawnThisTurn to false");
    
    // Advance to next opponent
    setTimeout(() => {
      console.log("⏭️ Advancing to next player");
      gameRef.current?.advanceToNextPlayer();
    }, 500);
  };

  const handleTileReorder = (fromIndex: number, toIndex: number) => {
    setPlayerHand((prev) => {
      const newHand = [...prev];
      const [removed] = newHand.splice(fromIndex, 1);
      newHand.splice(toIndex, 0, removed);
      return newHand;
    });
  };

  const handleDrawFromWall = () => {
    console.log("Draw from wall called, gamePhase:", gamePhase);
    gameRef.current?.drawTileFromWall();
    
    if (gamePhase === "playing") {
      console.log("Setting hasDrawnThisTurn to TRUE");
      setHasDrawnThisTurn(true);
    }
  };

  // Start dice animation after zoom completes
  useEffect(() => {
    console.log(`🎬 useEffect check: animationComplete=${animationComplete}, showDiceAnimation=${showDiceAnimation}, diceAnimationComplete=${diceAnimationComplete}`);
    
    if (animationComplete && !showDiceAnimation && !diceAnimationComplete) {
      console.log("🎬 ✅ STARTING DICE SEQUENCE IN 0.5s");
      const timer = setTimeout(() => {
        console.log("🎲 SETTING showDiceAnimation = true");
        setShowDiceAnimation(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [animationComplete, showDiceAnimation, diceAnimationComplete]);

  // Show "draw tiles" popup after all dice complete
  useEffect(() => {
    if (diceAnimationComplete && !drawTilesPopupShown) {
      console.log("🎲 All dice done - showing draw tiles popup");
      const showTimer = setTimeout(() => {
        setShowDrawTilesPopup(true);
        setDrawTilesPopupShown(true);
        
        // Hide popup after 2.5 seconds and enable dealing
        const hideTimer = setTimeout(() => {
          console.log("💬 Hiding popup - enabling yellow glow for dealing");
          setShowDrawTilesPopup(false);
          setCanStartDealing(true);
        }, 2500);
        
        return () => clearTimeout(hideTimer);
      }, 500);
      
      return () => clearTimeout(showTimer);
    }
  }, [diceAnimationComplete, drawTilesPopupShown]);


  // Debug: log state changes
  useEffect(() => {
    console.log("📊 Parent State - hasDrawnThisTurn:", hasDrawnThisTurn, "gamePhase:", gamePhase, "playerHand length:", playerHand.length);
    console.log("   playerHand tiles:", JSON.stringify(playerHand));
    
    if (playerHand.length === 13) {
      console.log("🎯 PLAYER HAS 13 TILES - canDiscard should be TRUE");
    } else if (playerHand.length === 12) {
      console.log("✅ PLAYER HAS 12 TILES - normal state");
    } else {
      console.log("⚠️ UNEXPECTED TILE COUNT:", playerHand.length);
    }
  }, [hasDrawnThisTurn, gamePhase, playerHand]);

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden" style={{ 
      width: '100vw',
      maxWidth: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    }}>
      {/* Hover trigger zone at top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-10"
        onMouseEnter={() => setShowNav(true)}
        onTouchStart={() => setShowNav(true)}
      />

      {/* Auto-hiding Top Nav Bar */}
      <div
        className="absolute left-0 right-0 z-20 bg-black/15 backdrop-blur-sm transition-transform duration-300 ease-in-out"
        style={{
          top: 0,
          transform: showNav ? 'translateY(0)' : 'translateY(-100%)',
        }}
        onMouseLeave={() => setShowNav(false)}
        onTouchEnd={() => setTimeout(() => setShowNav(false), 2000)}
      >
        <div className="flex items-center justify-between px-6 py-2">
          <Link href="/gameplay-full">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Scorecard button in nav */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowScorecard(true)}
              className="text-white/90 hover:text-white hover:bg-white/10 text-xs"
            >
              <Map className="w-3 h-3 mr-1" />
              Card
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="text-white/90 hover:text-white hover:bg-white/10 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              New
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas - 19:9 Aspect Ratio, Full Width */}
      <div className="absolute inset-0" style={{ paddingTop: '47.37%' }}>
        {/* 19:9 ratio = 9/19 = 0.4737 or 47.37% */}
        <div className="absolute top-0 left-0 right-0" style={{ height: '47.37vw', maxHeight: '100vh' }}>
          <Canvas shadows>
            <Suspense fallback={null}>
              {/* Camera - starts at distance 10 (zoomed out) */}
              <PerspectiveCamera
                makeDefault
                position={[0, 8.66, 5.0]}
                fov={60}
              />
              
              {/* Smooth zoom animation on load */}
              <CameraZoomAnimation onComplete={() => setAnimationComplete(true)} />
              
              {/* Camera angle auto-reset (azimuth to 0°, polar to 60°) - only after animation */}
              <CameraAngleAutoReset orbitControlsRef={orbitControlsRef} enabled={animationComplete} />
              
              {/* Controls */}
              <OrbitControls
                ref={orbitControlsRef}
                enabled={!isDragging && animationComplete}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={10}
                minPolarAngle={animationComplete ? (20 * Math.PI) / 180 : 0}
                maxPolarAngle={animationComplete ? (90 * Math.PI) / 180 : Math.PI}
                minAzimuthAngle={animationComplete ? -Math.PI / 7.2 : -Math.PI * 2}
                maxAzimuthAngle={animationComplete ? Math.PI / 7.2 : Math.PI * 2}
                target={[0, 0, 0]}
              />

              {/* Lighting */}
              <ambientLight intensity={0.9} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={1.65}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
              />
              <pointLight position={[-3, 3, 3]} intensity={0.6} />
              <pointLight position={[3, 3, -3]} intensity={0.6} />

          {/* Scene - No player rack in 3D */}
          <MahjongTable />
          
          {/* Sequential dice throw animations */}
          {showDiceAnimation && (
            <SequentialDiceRolls 
              onAllComplete={() => {
                console.log("🎲 All dice complete!");
                setDiceAnimationComplete(true);
                setShowDiceAnimation(false);
              }}
            />
          )}
          
          <FullGameplayHybridWithRef 
            ref={gameRef}
            canStartDealing={canStartDealing}
            parentGamePhase={gamePhase}
            onDraggingChange={setIsDragging}
            onWin={() => setGameWon(true)}
            onPhaseChange={(phase, info) => {
              console.log("📢 Phase change:", phase, info);
              
              // Don't override gamePhase during Charleston or after it completes
              if (phase !== "botsAutoDrawComplete" && gamePhase !== "charleston" && gamePhase !== "playing") {
                setGamePhase(phase as any);
                setPhaseInfo(info);
              } else {
                console.log("🚫 Ignoring phase change to", phase, "- parent controls phase now (current:", gamePhase, ")");
              }
              
              // Update hasDrawnThisTurn when player draws
              if (phase === "playerDrew") {
                console.log("✅ Setting hasDrawnThisTurn to TRUE");
                setHasDrawnThisTurn(true);
              }
              
              // When bots finish auto-dealing, add dummy tiles
              if (phase === "botsAutoDrawComplete") {
                console.log("🎴 CALLBACK RECEIVED: Bots finished drawing - adding dummy tiles NOW");
                if (gameRef.current?.addDummyTilesToRacks) {
                  gameRef.current.addDummyTilesToRacks();
                  console.log("🎴 Dummy tiles function called successfully");
                } else {
                  console.error("❌ addDummyTilesToRacks function not available");
                }
                
                // Transition to Charleston phase after dealing complete
                setTimeout(() => {
                  console.log("🎴 Dealing complete - starting Charleston phase");
                  setGamePhase("charleston");
                  setShowCharlestonPopup(true);
                  
                  // Enable Charleston UI after popup has been shown
                  setTimeout(() => {
                    setShowCharlestonPopup(false);
                    setCharlestonUIReady(true);
                    console.log("✅ Charleston UI ready - user can now select tiles");
                  }, 4000);
                }, 1000);
              }
              
              // Arrange winning hand when ready to reveal
              if (phase === "readyToReveal") {
                console.log("🎊 Arranging winning hand combination!");
                const winningHand = [
                  "Pin1", "Pin1", "Pin1",  // Triplet 1
                  "Sou5", "Sou5", "Sou5",  // Triplet 2
                  "Man3", "Man3", "Man3",  // Triplet 3
                  "Ton", "Ton",            // Pair 1
                  "Hatsu", "Hatsu"         // Pair 2
                ];
                setPlayerHand(winningHand);
                setWinningCombination(winningHand);
              }
            }}
            onPlayerHandChange={setPlayerHand}
          />

          {/* Ground - Charcoal */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.55, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#36454F" roughness={0.9} />
          </mesh>
            </Suspense>
          </Canvas>
        </div>
      </div>

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

      {/* Draw Tiles Popup - After Dice */}
      {showDrawTilesPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 rounded-2xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">You Rolled the Highest!</h2>
            <p className="text-white/90 text-lg">
              Your turn to draw tiles
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

      {/* Charleston Phase Popup */}
      {showCharlestonPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 rounded-2xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {charlestonComplete ? "Charleston Complete!" : "Charleston Phase"}
            </h2>
            <p className="text-white/90 text-lg">
              {charlestonComplete 
                ? "Starting gameplay - draw a tile from the wall!"
                : `Select 3 tiles to pass ${charlestonPass === "right" ? "RIGHT →" : charlestonPass === "across" ? "ACROSS ↔" : "← LEFT"}`
              }
            </p>
          </div>
        </div>
      )}

      {/* 2D Player Rack - Fixed at Bottom */}
      <PlayerRack2DClean
        tiles={playerHand}
        onTileDiscard={handlePlayerTileDiscard}
        onTileReorder={handleTileReorder}
        canDiscard={
          gamePhase === "playing" && 
          playerHand.length === 13
        }
        isWinningHand={gamePhase === "readyToReveal"}
        onReveal={() => {
          console.log("🎊 Reveal clicked! Showing win modal");
          setGameWon(true);
        }}
        isCharlestonMode={gamePhase === "charleston" && charlestonUIReady}
        onCharlestonPass={handleCharlestonPass}
        charlestonPassDirection={charlestonPass}
      />

      {/* Win Modal - Compact Landscape Layout */}
      {gameWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
          <div className="relative bg-gradient-to-br from-blue-500/20 to-pink-500/20 border-2 border-blue-400 rounded-2xl p-6 max-w-4xl w-full"
            style={{
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-pink-400/20 animate-pulse" />
            
            {/* Content */}
            <div className="relative flex flex-col gap-4">
              {/* Top: Trophy and Title */}
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Mahjong!</h2>
                  <p className="text-white/80 text-sm">You won!</p>
                </div>
              </div>
              
              {/* Middle: Winning Combination and Stats */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="text-white font-bold text-sm mb-2 text-center">Winning Combination</h3>
                
                {/* Tiles */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  {winningCombination.map((tileName, index) => (
                    <React.Fragment key={`win-tile-${index}`}>
                      <img
                        src={`/tiles/regular/${tileName}.png`}
                        alt={tileName}
                        className="w-7 h-9 object-contain rounded shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #FEFEFE 0%, #F5E6D3 100%)",
                        }}
                      />
                      {/* Add gap after triplets and first pair */}
                      {(index === 2 || index === 5 || index === 8 || index === 10) && (
                        <div className="w-1.5" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Stats - Horizontal */}
                <div className="flex items-center justify-center gap-8 pt-2 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-white/60 text-xs mb-1">Points</div>
                    <div className="text-lg font-bold text-white">+250</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60 text-xs mb-1">XP</div>
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">+150</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/60 text-xs mb-1">Score</div>
                    <div className="text-lg font-bold text-white">8,500</div>
                  </div>
                </div>
              </div>
              
              {/* Bottom: Actions - Always Visible */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold px-8 py-3 text-sm shadow-lg"
                >
                  Play Again
                </Button>
                <Link href="/home">
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold px-8 py-3 text-sm shadow-lg"
                  >
                    Go to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

