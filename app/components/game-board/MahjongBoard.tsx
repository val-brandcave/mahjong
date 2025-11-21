"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Tile as TileType, BoardState, ActionType } from '@/lib/game-engine/types';
import { InteractiveTile } from './InteractiveTile';
import { toast } from 'sonner';

interface MahjongBoardProps {
  boardState: BoardState;
  onAction: (action: {
    type: ActionType;
    tileIds?: string[];
    targetPosition?: { x: number; y: number; z?: number };
  }) => void;
  instruction?: string;
  showBins?: boolean; // For sorting exercises
  readonly?: boolean;
  binCounts?: {
    suits: number;
    honor: number;
    special: number;
  };
  showWallGuide?: boolean; // For wall building in Lesson 3
}

export function MahjongBoard({
  boardState,
  onAction,
  instruction,
  showBins = false,
  readonly = false,
  binCounts,
  showWallGuide = false
}: MahjongBoardProps) {
  const [draggedTile, setDraggedTile] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Pan and zoom state
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTileTap = useCallback((tileId: string) => {
    if (readonly) return;
    
    const tile = boardState.centerTiles.find(t => t.id === tileId);
    if (!tile || tile.locked) return;

    onAction({
      type: 'tap-tile',
      tileIds: [tileId]
    });
  }, [boardState, onAction, readonly]);

  const handleDragStart = useCallback((tileId: string, offsetX: number, offsetY: number) => {
    if (readonly) return;
    
    const tile = boardState.centerTiles.find(t => t.id === tileId);
    if (!tile || tile.locked) return;

    setDraggedTile(tileId);
    setDragOffset({ x: offsetX, y: offsetY });
  }, [boardState, readonly]);

  const handleDragEnd = useCallback((x: number, y: number, screenX: number, screenY: number) => {
    if (!draggedTile || readonly) return;

    // Check if dropped in sorting bins (if enabled)
    if (showBins && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeY = screenY - containerRect.top;
      const relativeX = screenX - containerRect.left;
      
      // Bins are at the bottom of the container
      const binsTop = containerRect.height - 120; // 120px from bottom
      
      if (relativeY > binsTop) {
        // Determine which bin the tile was dropped into
        const binWidth = containerRect.width / 3;
        let binType: 'suits' | 'honor' | 'special' = 'suits';
        
        if (relativeX < binWidth) binType = 'suits';
        else if (relativeX < binWidth * 2) binType = 'honor';
        else binType = 'special';
        
        // Accept ANY tile dropped into ANY bin for practice mode
        // Position the tile off-screen (removed from play area)
        onAction({
          type: 'drag-tile',
          tileIds: [draggedTile],
          targetPosition: { x: -1000, y: -1000 }, // Move off-screen
          metadata: { binType } // Pass bin type for tracking
        } as any);
        setDraggedTile(null);
        return;
      }
    }

    // Adjust for current pan and zoom
    const finalX = (x - boardOffset.x) / zoom - dragOffset.x;
    const finalY = (y - boardOffset.y) / zoom - dragOffset.y;

    // Check if dropped on another tile (for stacking)
    const targetTile = boardState.centerTiles.find(tile =>
      tile.id !== draggedTile &&
      Math.abs(tile.position.x - finalX) < 40 &&
      Math.abs(tile.position.y - finalY) < 40
    );

    if (targetTile) {
      // Stacking tiles
      onAction({
        type: 'stack-tiles',
        tileIds: [draggedTile, targetTile.id]
      });
    } else {
      // Moving to a position
      onAction({
        type: 'drag-tile',
        tileIds: [draggedTile],
        targetPosition: { x: finalX, y: finalY }
      });
    }

    setDraggedTile(null);
  }, [draggedTile, dragOffset, boardState, onAction, readonly, boardOffset, zoom, showBins]);

  // Board panning handlers
  const handleBoardPanStart = useCallback(() => {
    if (!draggedTile) {
      setIsPanning(true);
    }
  }, [draggedTile]);

  const handleBoardPan = useCallback((_: any, info: PanInfo) => {
    if (isPanning && !draggedTile) {
      setBoardOffset(prev => ({
        x: prev.x + info.delta.x,
        y: prev.y + info.delta.y
      }));
    }
  }, [isPanning, draggedTile]);

  const handleBoardPanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Wheel zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
  }, []);

  // Setup wheel zoom listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-2xl overflow-hidden"
    >
      {/* Table surface pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Instruction banner */}
      {instruction && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg z-10 pointer-events-none"
        >
          <p className="text-sm font-medium text-center leading-relaxed whitespace-pre-line">
            {instruction}
          </p>
        </motion.div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-30 bg-white/90 px-3 py-1 rounded-full shadow-lg pointer-events-none">
        <span className="text-xs font-semibold text-green-800">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Fixed sorting bins (if enabled) - stays in place while board pans */}
      {showBins && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-4 z-20 pointer-events-none">
          <div className="flex-1 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded-xl p-3 min-h-[100px] flex flex-col items-center justify-center relative">
            <span className="text-white font-semibold text-sm">Suits</span>
            {binCounts && binCounts.suits > 0 && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {binCounts.suits}
              </div>
            )}
          </div>
          <div className="flex-1 bg-purple-500/20 border-2 border-purple-500 border-dashed rounded-xl p-3 min-h-[100px] flex flex-col items-center justify-center relative">
            <span className="text-white font-semibold text-sm">Honor Tiles</span>
            {binCounts && binCounts.honor > 0 && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {binCounts.honor}
              </div>
            )}
          </div>
          <div className="flex-1 bg-pink-500/20 border-2 border-pink-500 border-dashed rounded-xl p-3 min-h-[100px] flex flex-col items-center justify-center relative">
            <span className="text-white font-semibold text-sm">Special</span>
            {binCounts && binCounts.special > 0 && (
              <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {binCounts.special}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pannable and zoomable game area */}
      <motion.div
        ref={boardRef}
        drag={!draggedTile}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleBoardPanStart}
        onDrag={handleBoardPan}
        onDragEnd={handleBoardPanEnd}
        animate={{
          x: boardOffset.x,
          y: boardOffset.y,
          scale: zoom
        }}
        transition={{
          type: "tween",
          duration: 0.1
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: 'center center'
        }}
      >
        {/* Wall guide line (for Lesson 3 Step 3) */}
        {showWallGuide && (
          <div className="absolute left-0 right-0 pointer-events-none" style={{ top: 550 }}>
            <div className="h-20 border-2 border-yellow-400 border-dashed rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <span className="text-yellow-200 text-sm font-semibold">Wall Area - Drag pairs here</span>
            </div>
          </div>
        )}

        {/* Center tiles (the main play area) */}
        <div className="relative w-[800px] h-[800px] pointer-events-auto">
          <AnimatePresence>
            {boardState.centerTiles
              .filter(tile => tile.position.x >= 0 && tile.position.y >= 0) // Only show tiles on-screen
              .map((tile) => (
                <InteractiveTile
                  key={tile.id}
                  tile={tile}
                  onTap={handleTileTap}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedTile === tile.id}
                  readonly={readonly}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Walls (displayed separately) */}
        {boardState.walls.map((wall, index) => (
          <div
            key={`wall-${wall.direction}`}
            className="absolute pointer-events-none"
            style={{
              left: wall.position.x,
              top: wall.position.y,
            }}
          >
            <div className="flex gap-0.5">
              {wall.tiles.slice(0, 19).map((tile, tileIndex) => (
                <div key={tile.id} className="relative w-6 h-8">
                  <div className="absolute inset-0 bg-amber-100 border border-amber-300 rounded-sm"></div>
                  <div className="absolute inset-0 bg-amber-50 border border-amber-300 rounded-sm translate-y-[-2px]"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

    </div>
  );
}

