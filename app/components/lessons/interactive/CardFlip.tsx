"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Card {
  id: string;
  front: { icon: string; text: string };
  back: { text: string };
}

interface CardFlipProps {
  cards: Card[];
  requireAll: boolean;
  onAllFlipped: () => void;
}

export function CardFlip({ cards, requireAll, onAllFlipped }: CardFlipProps) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [hasCalledComplete, setHasCalledComplete] = useState(false);

  useEffect(() => {
    if (requireAll && flipped.size === cards.length && !hasCalledComplete) {
      setHasCalledComplete(true);
      onAllFlipped();
    }
  }, [flipped, cards.length, requireAll, onAllFlipped, hasCalledComplete]);

  const handleCardClick = (cardId: string) => {
    setFlipped((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <div className="mb-6">
      {requireAll && (
        <p className="text-sm text-gray-600 mb-4 text-center">
          💡 Tap each card to explore all 4 features ({flipped.size}/{cards.length} explored)
        </p>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          
          return (
            <motion.div
              key={card.id}
              className="relative h-40 cursor-pointer perspective-1000"
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div
                  className="absolute w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-[#B565D8] to-[#5DAFA0] p-4 flex flex-col items-center justify-center text-white shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-4xl mb-2">{card.front.icon}</div>
                  <div className="text-sm font-semibold text-center">
                    {card.front.text}
                  </div>
                  {!isFlipped && (
                    <div className="absolute bottom-2 text-xs opacity-75">
                      Tap to learn more
                    </div>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute w-full h-full backface-hidden rounded-lg bg-white border-2 border-[#B565D8] p-4 flex items-center justify-center shadow-lg"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-sm text-gray-700 text-center">
                    {card.back.text}
                  </p>
                  {isFlipped && flipped.size === cards.length && (
                    <div className="absolute top-2 right-2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

