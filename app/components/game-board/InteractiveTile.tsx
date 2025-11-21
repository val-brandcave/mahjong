"use client";

import { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Tile as TileType } from '@/lib/game-engine/types';
import { MahjongTile } from '../mahjong/MahjongTile';

interface InteractiveTileProps {
  tile: TileType;
  onTap: (tileId: string) => void;
  onDragStart: (tileId: string, offsetX: number, offsetY: number) => void;
  onDragEnd: (x: number, y: number, screenX: number, screenY: number) => void;
  isDragging: boolean;
  readonly?: boolean;
}

export function InteractiveTile({
  tile,
  onTap,
  onDragStart,
  onDragEnd,
  isDragging,
  readonly = false
}: InteractiveTileProps) {
  const [position, setPosition] = useState({ x: tile.position.x, y: tile.position.y });
  const constraintsRef = useRef(null);

  const handleTap = () => {
    if (!readonly && !tile.locked) {
      onTap(tile.id);
    }
  };

  const handleDragStart = (_: any, info: PanInfo) => {
    if (!readonly && !tile.locked) {
      onDragStart(tile.id, info.offset.x, info.offset.y);
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (!readonly && !tile.locked) {
      setPosition({
        x: tile.position.x + info.offset.x,
        y: tile.position.y + info.offset.y
      });
    }
  };

  const handleDragEndInternal = (_: any, info: PanInfo) => {
    if (!readonly && !tile.locked) {
      const finalX = tile.position.x + info.offset.x;
      const finalY = tile.position.y + info.offset.y;
      
      // Get screen coordinates for bin detection
      const screenX = info.point.x;
      const screenY = info.point.y;
      
      onDragEnd(finalX, finalY, screenX, screenY);
      
      // Reset position (parent will update via board state)
      setPosition({ x: tile.position.x, y: tile.position.y });
    }
  };

  if (tile.symbol === 'Empty') {
    return null;
  }

  const zIndex = (tile.position.z || 0) * 10 + (isDragging ? 1000 : 0);

  return (
    <motion.div
      drag={!readonly && !tile.locked}
      dragMomentum={false}
      dragElastic={0}
      onTap={handleTap}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEndInternal}
      initial={{ 
        x: tile.position.x, 
        y: tile.position.y,
        scale: 1
      }}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.1 : 1,
        rotateZ: isDragging ? 5 : 0
      }}
      style={{
        position: 'absolute',
        zIndex,
        cursor: readonly || tile.locked ? 'default' : 'grab'
      }}
      whileTap={{ scale: readonly || tile.locked ? 1 : 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {tile.faceUp ? (
        <div className={`${tile.locked ? 'opacity-50' : ''}`}>
          <MahjongTile
            tileSymbol={tile.symbol === 'FaceDown' ? 'Chun' : tile.symbol}
            size={48}
            variant="regular"
            alt={tile.symbol}
          />
        </div>
      ) : (
        // Face-down tile
        <div className="w-12 h-16 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-md shadow-md flex items-center justify-center">
          <div className="w-8 h-12 border-2 border-amber-500 rounded-sm opacity-30"></div>
        </div>
      )}

      {/* Selection indicator */}
      {tile.locked && (
        <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center">
          <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

