"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface PlayerRack2DProps {
  tiles: string[];
  onTileDiscard: (index: number) => void;
  onTileReorder: (fromIndex: number, toIndex: number) => void;
  canDiscard: boolean;
}

export function PlayerRack2D({ tiles, onTileDiscard, onTileReorder, canDiscard }: PlayerRack2DProps) {
  console.log("PlayerRack2D render - tiles:", tiles, "canDiscard:", canDiscard);
  
  if (tiles.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-yellow-500/50 text-white text-center py-4">
        No tiles yet - waiting for tiles...
      </div>
    );
  }
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const rackRef = useRef<HTMLDivElement>(null);

  const handleTileClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Tile clicked:", index, "canDiscard:", canDiscard);
    
    // Always allow selection to test
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleTileMouseDown = (index: number, e: React.MouseEvent) => {
    console.log("Mouse down on tile:", index, "canDiscard:", canDiscard);
    
    // Always allow drag
    e.preventDefault();
    e.stopPropagation();
    setSelectedIndex(index); // Auto-select on drag
    setDraggedIndex(index);
    setDragStartY(e.clientY);
    setDragPosition({ x: e.clientX, y: e.clientY });
    setIsDragging(false);
    console.log("Drag started, waiting for move...");
  };


  // Attach global listeners for dragging - simplified
  useEffect(() => {
    if (draggedIndex === null) return;
    
    console.log("✅ Adding global mouse listeners for tile:", draggedIndex);
    
    let startPos = dragPosition;
    let currentlyDragging = false;
    
    const onMove = (e: MouseEvent) => {
      console.log("🟢 Mousemove:", e.clientX, e.clientY);
      
      if (!startPos) {
        startPos = { x: e.clientX, y: e.clientY };
      }
      
      const deltaX = Math.abs(e.clientX - startPos.x);
      const deltaY = Math.abs(e.clientY - startPos.y);
      
      if (!currentlyDragging && (deltaX > 3 || deltaY > 3)) {
        console.log("✅ DRAGGING STARTED");
        currentlyDragging = true;
        setIsDragging(true);
      }
      
      setDragPosition({ x: e.clientX, y: e.clientY });
    };
    
    const onUp = (e: MouseEvent) => {
      console.log("🔴 Mouseup - isDragging:", currentlyDragging);
      
      const rackRect = rackRef.current?.getBoundingClientRect();
      
      if (currentlyDragging && rackRect) {
        if (e.clientY < rackRect.top - 30) {
          console.log("✅ DISCARD");
          onTileDiscard(draggedIndex);
        } else {
          console.log("Check reorder");
          // Reorder logic here
        }
      }
      
      setDraggedIndex(null);
      setIsDragging(false);
      setDragPosition(null);
      setSelectedIndex(null);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [draggedIndex]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30" style={{ pointerEvents: "auto" }}>
      {/* Rack background with 3D depth effect */}
      <div
        ref={rackRef}
        className="relative mx-auto"
        style={{
          background: "linear-gradient(180deg, #FBC02D 0%, #F9A825 50%, #F57F17 100%)",
          boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
          borderTop: "3px solid rgba(255, 255, 255, 0.3)",
          padding: "16px 24px 20px",
          userSelect: "none",
        }}
      >
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{
          boxShadow: "inset 0 8px 16px rgba(0, 0, 0, 0.2)",
        }} />

        {/* Tiles container */}
        <div className="flex items-end justify-center gap-2 relative">
          {tiles.map((tileName, index) => (
            <div
              key={`${tileName}-${index}`}
              data-tile-index={index}
              onClick={(e) => handleTileClick(index, e)}
              onMouseDown={(e) => handleTileMouseDown(index, e)}
              className={`relative transition-all duration-200 cursor-pointer ${
                draggedIndex === index && isDragging ? "opacity-0" : ""
              }`}
              style={{
                transform: `perspective(600px) rotateX(5deg)`,
                transformStyle: "preserve-3d",
                userSelect: "none",
                pointerEvents: "auto",
                touchAction: "none",
              }}
            >
              {/* Selection glow */}
              {selectedIndex === index && (
                <div
                  className="absolute -inset-1 rounded-lg animate-pulse pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(251, 192, 45, 0.4) 0%, transparent 70%)",
                    boxShadow: "0 0 20px rgba(251, 192, 45, 0.8), 0 0 40px rgba(251, 192, 45, 0.4)",
                    transform: "translateZ(10px)",
                  }}
                />
              )}

              {/* Tile with 3D depth effect */}
              <div
                className="relative group"
                style={{
                  width: "60px",
                  height: "80px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Tile face (front) */}
                <div
                  className="absolute inset-0 rounded-md overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #FEFEFE 0%, #F5E6D3 50%, #E8D4B8 100%)",
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
                    className="w-full h-full object-contain p-1"
                    style={{
                      filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))",
                    }}
                  />
                </div>

                {/* Tile depth/sides (left edge) */}
                <div
                  className="absolute top-0 bottom-0 left-0"
                  style={{
                    width: "4px",
                    background: "linear-gradient(90deg, rgba(200, 180, 160, 0.8) 0%, rgba(232, 212, 184, 0.6) 100%)",
                    transform: "translateZ(0px) rotateY(-90deg)",
                    transformOrigin: "left center",
                    boxShadow: "inset -1px 0 2px rgba(0, 0, 0, 0.3)",
                  }}
                />

                {/* Tile depth/sides (right edge) */}
                <div
                  className="absolute top-0 bottom-0 right-0"
                  style={{
                    width: "4px",
                    background: "linear-gradient(90deg, rgba(232, 212, 184, 0.6) 0%, rgba(200, 180, 160, 0.9) 100%)",
                    transform: "translateZ(0px) rotateY(90deg)",
                    transformOrigin: "right center",
                    boxShadow: "inset 1px 0 2px rgba(0, 0, 0, 0.3)",
                  }}
                />

                {/* Tile depth (bottom edge) */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "4px",
                    background: "linear-gradient(180deg, rgba(200, 180, 160, 0.9) 0%, rgba(180, 160, 140, 1) 100%)",
                    transform: "translateZ(0px) rotateX(90deg)",
                    transformOrigin: "bottom center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                  }}
                />

                {/* Hover glow */}
                {canDiscard && (
                  <div
                    className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: "0 0 20px rgba(251, 192, 45, 0.6)",
                      transform: "translateZ(5px)",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rack front lip for depth */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          }}
        />
      </div>

      {/* Floating dragged tile */}
      {draggedIndex !== null && isDragging && dragPosition && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragPosition.x - 30,
            top: dragPosition.y - 40,
            transform: "perspective(600px) rotateX(5deg) scale(1.1)",
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))",
          }}
        >
          <div
            className="relative"
            style={{
              width: "60px",
              height: "80px",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0 rounded-md overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #FEFEFE 0%, #F5E6D3 50%, #E8D4B8 100%)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(200, 180, 160, 0.6)",
                transform: "translateZ(4px)",
              }}
            >
              <img
                src={`/tiles/regular/${tiles[draggedIndex]}.png`}
                alt={tiles[draggedIndex]}
                className="w-full h-full object-contain p-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

