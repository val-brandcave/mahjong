"use client";

import React, { useState } from "react";
import { Hand, ArrowRight, ArrowUp, ArrowLeft } from "lucide-react";

interface PlayerRack2DCleanProps {
  tiles: string[];
  onTileDiscard: (index: number) => void;
  onTileReorder: (fromIndex: number, toIndex: number) => void;
  canDiscard: boolean;
  isWinningHand?: boolean;
  onReveal?: () => void;
  // Charleston mode
  isCharlestonMode?: boolean;
  onCharlestonPass?: (selectedIndices: number[]) => void;
  charlestonPassDirection?: "right" | "across" | "left";
}

export function PlayerRack2DClean({ 
  tiles, 
  onTileDiscard, 
  onTileReorder, 
  canDiscard, 
  isWinningHand = false, 
  onReveal,
  isCharlestonMode = false,
  onCharlestonPass,
  charlestonPassDirection = "right"
}: PlayerRack2DCleanProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [charlestonSelected, setCharlestonSelected] = useState<number[]>([]);

  // Clear Charleston selection when mode changes
  React.useEffect(() => {
    if (!isCharlestonMode) {
      setCharlestonSelected([]);
      console.log("🔄 Charleston mode OFF - cleared charleston selections");
    }
  }, [isCharlestonMode]);

  // Debug canDiscard
  React.useEffect(() => {
    console.log("🎯 PlayerRack2DClean render - tiles:", tiles.length, "canDiscard:", canDiscard, "selectedIndex:", selectedIndex, "isCharlestonMode:", isCharlestonMode);
  }, [tiles.length, canDiscard, selectedIndex, isCharlestonMode]);

  console.log("🎯 PlayerRack2DClean - tiles:", tiles.length, "canDiscard:", canDiscard, "selected:", selectedIndex, "isWinningHand:", isWinningHand);
  
  // Determine gaps for winning hand grouping
  const getGapClass = (index: number) => {
    if (!isWinningHand) return "gap-1.5";
    // Triplets at 0-2, 3-5, 6-8; Pairs at 9-10, 11-12
    // Add gap after indices 2, 5, 8, 10
    if (index === 2 || index === 5 || index === 8 || index === 10) {
      return "mr-3"; // Margin right for gap after set
    }
    return "";
  };

  const handleTileClick = (index: number) => {
    console.log("✅ Tile clicked:", index, "isCharlestonMode:", isCharlestonMode, "canDiscard:", canDiscard);
    
    // Charleston mode - multi-select up to 3 tiles
    if (isCharlestonMode) {
      setCharlestonSelected((prev) => {
        if (prev.includes(index)) {
          // Deselect
          return prev.filter((i) => i !== index);
        } else if (prev.length < 3) {
          // Select if under 3
          return [...prev, index];
        }
        return prev; // Already have 3 selected
      });
      return;
    }
    
    // Normal mode - single select for discard
    console.log("Normal mode - current selected:", selectedIndex, "new selection:", index);
    if (selectedIndex === index) {
      console.log("Deselecting tile");
      setSelectedIndex(null);
    } else {
      console.log("Selecting tile:", index, "canDiscard:", canDiscard);
      setSelectedIndex(index);
    }
  };

  const handleDiscardClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🗑️ Discard button clicked for tile:", index, "tileName:", tiles[index]);
    onTileDiscard(index);
    setSelectedIndex(null);
  };

  if (tiles.length === 0) {
    return null;
  }

  const handleCharlestonPass = (direction: "right" | "across" | "left") => {
    // Only allow passing if correct direction and 3 tiles selected
    if (direction === charlestonPassDirection && charlestonSelected.length === 3 && onCharlestonPass) {
      console.log("🎴 Passing Charleston tiles:", charlestonSelected, "direction:", direction);
      onCharlestonPass(charlestonSelected);
      setCharlestonSelected([]);
    } else if (direction !== charlestonPassDirection) {
      console.log("❌ Wrong direction clicked. Expected:", charlestonPassDirection, "Got:", direction);
    }
  };

  // Color coding for Charleston passes (matching player positions)
  const charlestonColors = {
    right: { glow: "rgba(10, 85, 158, 0.7)", shadow: "0 0 30px rgba(10, 85, 158, 1), 0 0 50px rgba(10, 85, 158, 0.7)" }, // Blue #0a559e - South
    across: { glow: "rgba(198, 8, 12, 0.7)", shadow: "0 0 30px rgba(198, 8, 12, 1), 0 0 50px rgba(198, 8, 12, 0.7)" }, // Red #c6080c - West
    left: { glow: "rgba(11, 157, 88, 0.7)", shadow: "0 0 30px rgba(11, 157, 88, 1), 0 0 50px rgba(11, 157, 88, 0.7)" }, // Green #0b9d58 - North
  }[charlestonPassDirection];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30" style={{ pointerEvents: "auto" }}>
      {/* Charleston Triangle Arrow Buttons - Right side above rack, 40% smaller */}
      {isCharlestonMode && (
        <div className="absolute right-4 z-40" style={{ bottom: "90px" }}>
          <div className="relative" style={{ width: "108px", height: "72px" }}>
            {/* Top button - Across (Red) */}
            <button
              onClick={() => handleCharlestonPass("across")}
              disabled={charlestonSelected.length !== 3}
              className="absolute left-1/2 -translate-x-1/2 top-0 rounded-lg backdrop-blur-md transition-all duration-300 shadow-xl flex items-center justify-center"
              style={{
                width: "33.6px",
                height: "33.6px",
                border: "2px solid white",
                cursor: charlestonSelected.length === 3 ? "pointer" : "not-allowed",
                backgroundColor: charlestonPassDirection === "across" && charlestonSelected.length === 3
                  ? "rgba(198, 8, 12, 0.9)"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              <ArrowUp className="w-4 h-4" style={{ 
                color: charlestonPassDirection === "across" && charlestonSelected.length === 3 ? "white" : "rgba(255,255,255,0.8)"
              }} />
            </button>

            {/* Left button - Left (Green) */}
            <button
              onClick={() => handleCharlestonPass("left")}
              disabled={charlestonSelected.length !== 3}
              className="absolute left-0 bottom-0 rounded-lg backdrop-blur-md transition-all duration-300 shadow-xl flex items-center justify-center"
              style={{
                width: "33.6px",
                height: "33.6px",
                border: "2px solid white",
                cursor: charlestonSelected.length === 3 ? "pointer" : "not-allowed",
                backgroundColor: charlestonPassDirection === "left" && charlestonSelected.length === 3
                  ? "rgba(11, 157, 88, 0.9)"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              <ArrowLeft className="w-4 h-4" style={{ 
                color: charlestonPassDirection === "left" && charlestonSelected.length === 3 ? "white" : "rgba(255,255,255,0.8)"
              }} />
            </button>

            {/* Right button - Right (Blue) */}
            <button
              onClick={() => handleCharlestonPass("right")}
              disabled={charlestonSelected.length !== 3}
              className="absolute right-0 bottom-0 rounded-lg backdrop-blur-md transition-all duration-300 shadow-xl flex items-center justify-center"
              style={{
                width: "33.6px",
                height: "33.6px",
                border: "2px solid white",
                cursor: charlestonSelected.length === 3 ? "pointer" : "not-allowed",
                backgroundColor: charlestonPassDirection === "right" && charlestonSelected.length === 3
                  ? "rgba(10, 85, 158, 0.9)"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            >
              <ArrowRight className="w-4 h-4" style={{ 
                color: charlestonPassDirection === "right" && charlestonSelected.length === 3 ? "white" : "rgba(255,255,255,0.8)"
              }} />
            </button>
          </div>
        </div>
      )}

      {/* Rack background with 3D depth effect */}
      <div
        className="relative mx-auto"
        style={{
          background: "#d6af49",
          boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
          borderTop: "3px solid rgba(255, 255, 255, 0.3)",
          padding: "9.6px 24px 12px",
          userSelect: "none",
        }}
      >
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: "inset 0 8px 16px rgba(0, 0, 0, 0.2)",
        }} />

        {/* Tiles container */}
        <div className={`flex items-end justify-center ${!isWinningHand ? "gap-1.5" : ""}`}>
          {tiles.map((tileName, index) => {
            // Check if this tile is newly received (will be handled by parent with prop)
            const isNewlyReceived = (tileName as any).__newlyReceived;
            
            return <div
              key={`${tileName}-${index}`}
              data-tile-index={index}
              className={`relative ${getGapClass(index)}`}
              style={{
                zIndex: selectedIndex === index ? 20 : 10,
              }}
            >
              {/* Discard button - Centered above tile (normal mode only) */}
              {!isCharlestonMode && selectedIndex === index && canDiscard && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🖐️ Discard button mousedown");
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🖐️ Discard button click");
                    handleDiscardClick(index, e);
                  }}
                  className="absolute left-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-xl flex items-center justify-center transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                  style={{
                    top: "-44px",
                    transform: "translateX(-50%)",
                    border: "3px solid white",
                    zIndex: 10000,
                  }}
                >
                  <Hand className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Tile container with click */}
              <div
                onClick={(e) => {
                  // Don't toggle selection if clicking the discard button
                  if ((e.target as HTMLElement).closest('button')) {
                    console.log("Clicked button, ignoring tile click");
                    return;
                  }
                  console.log("Clicked tile itself");
                  handleTileClick(index);
                }}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedIndex === index ? "scale-105" : ""
                }`}
                style={{
                  transform: `perspective(600px) rotateX(5deg)`,
                  transformStyle: "preserve-3d",
                  pointerEvents: "auto",
                }}
              >
                {/* Selection glow - normal mode */}
                {!isCharlestonMode && selectedIndex === index && (
                  <div
                    className="absolute -inset-1 animate-pulse pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(251, 192, 45, 0.4) 0%, transparent 70%)",
                      boxShadow: "0 0 20px rgba(251, 192, 45, 0.8), 0 0 40px rgba(251, 192, 45, 0.4)",
                      transform: "translateZ(-2px)",
                      borderRadius: "4.8px",
                    }}
                  />
                )}
                
                {/* Charleston multi-select glow - color-coded by direction */}
                {isCharlestonMode && charlestonSelected.includes(index) && charlestonColors && (
                  <div
                    className="absolute -inset-2 animate-pulse pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${charlestonColors.glow} 0%, transparent 70%)`,
                      boxShadow: charlestonColors.shadow,
                      transform: "translateZ(-2px)",
                      borderRadius: "6px",
                    }}
                  />
                )}
                
                {/* Newly received tile glow */}
                {isNewlyReceived && charlestonColors && (
                  <div
                    className="absolute -inset-2 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${charlestonColors.glow} 0%, transparent 70%)`,
                      boxShadow: charlestonColors.shadow,
                      transform: "translateZ(-2px)",
                      borderRadius: "6px",
                      animation: "pulse 1s ease-in-out",
                    }}
                  />
                )}

                {/* Tile with 3D depth effect - Scaled to 0.6 */}
              <div
                className="relative group"
                style={{
                  width: "36px",
                  height: "48px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Tile face (front) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #FEFEFE 0%, #F5E6D3 50%, #E8D4B8 100%)",
                    borderRadius: "3px",
                    boxShadow: `
                      0 4px 8px rgba(0, 0, 0, 0.3),
                      0 1px 2px rgba(0, 0, 0, 0.2),
                      inset 0 1px 2px rgba(255, 255, 255, 0.4),
                      inset 0 -1px 2px rgba(0, 0, 0, 0.1)
                    `,
                    border: "1px solid rgba(200, 180, 160, 0.6)",
                    transform: "translateZ(4px)",
                  }}
                >
                  <img
                    src={`/tiles/regular/${tileName}.png`}
                    alt={tileName}
                    className="w-full h-full object-contain"
                    draggable={false}
                    style={{
                      filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))",
                      padding: "2.4px",
                    }}
                  />
                </div>

                {/* Tile depth/sides (left edge) - Scaled to 0.6 */}
                <div
                  className="absolute top-0 bottom-0 left-0 pointer-events-none"
                  style={{
                    width: "2.4px",
                    background: "linear-gradient(90deg, rgba(200, 180, 160, 0.8) 0%, rgba(232, 212, 184, 0.6) 100%)",
                    transform: "translateZ(0px) rotateY(-90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset -1px 0 2px rgba(0, 0, 0, 0.3)",
                  }}
                />

                {/* Tile depth/sides (right edge) - Scaled to 0.6 */}
                <div
                  className="absolute top-0 bottom-0 right-0 pointer-events-none"
                  style={{
                    width: "2.4px",
                    background: "linear-gradient(90deg, rgba(232, 212, 184, 0.6) 0%, rgba(200, 180, 160, 0.9) 100%)",
                    transform: "translateZ(0px) rotateY(90deg)",
                    transformOrigin: "right center",
                    boxShadow: "inset 1px 0 2px rgba(0, 0, 0, 0.3)",
                  }}
                />

                {/* Tile depth (bottom edge) - Scaled to 0.6 */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "2.4px",
                    background: "linear-gradient(180deg, rgba(200, 180, 160, 0.9) 0%, rgba(180, 160, 140, 1) 100%)",
                    transform: "translateZ(0px) rotateX(90deg)",
                    transformOrigin: "bottom center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  }}
                />
              </div>
              </div>
            </div>;
          })}
          
          {/* Reveal button for winning hand */}
          {isWinningHand && onReveal && (
            <button
              onClick={onReveal}
              className="ml-6 px-4 py-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-sm shadow-xl transition-all hover:scale-110 active:scale-95"
              style={{
                border: "2px solid white",
                alignSelf: "center",
              }}
            >
              Reveal
            </button>
          )}
        </div>

        {/* Rack front lip for depth */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />
      </div>
    </div>
  );
}

