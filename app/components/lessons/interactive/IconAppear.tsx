"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Icon {
  id: string;
  emoji: string;
  text: string;
  detail: string;
}

interface IconAppearProps {
  icons: Icon[];
  onAllAppeared: () => void;
}

export function IconAppear({ icons, onAllAppeared }: IconAppearProps) {
  const [appearedCount, setAppearedCount] = useState(0);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [hasCalledComplete, setHasCalledComplete] = useState(false);

  useEffect(() => {
    // Stagger icon appearance
    if (appearedCount < icons.length) {
      const timer = setTimeout(() => {
        setAppearedCount((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (appearedCount === icons.length && !hasCalledComplete) {
      setHasCalledComplete(true);
      onAllAppeared();
    }
  }, [appearedCount, icons.length, onAllAppeared, hasCalledComplete]);

  const handleCardClick = (iconId: string) => {
    setFlipped((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(iconId)) {
        newSet.delete(iconId);
      } else {
        newSet.add(iconId);
      }
      return newSet;
    });
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        {icons.map((icon, index) => {
          const isFlipped = flipped.has(icon.id);
          const hasAppeared = index < appearedCount;

          return (
            <motion.div
              key={icon.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                hasAppeared
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className="relative h-32 cursor-pointer perspective-1000"
              onClick={() => hasAppeared && handleCardClick(icon.id)}
              style={{ pointerEvents: hasAppeared ? 'auto' : 'none' }}
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
                  className="absolute w-full h-full backface-hidden rounded-lg bg-white border-2 border-gray-200 p-4 flex flex-col items-center justify-center shadow-md"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-4xl mb-2">{icon.emoji}</div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {icon.text}
                  </div>
                  {!isFlipped && hasAppeared && (
                    <div className="absolute bottom-2 text-xs text-gray-400">
                      Tap to learn more
                    </div>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-[#B565D8]/10 to-[#5DAFA0]/10 border-2 border-[#B565D8] p-4 flex items-center justify-center shadow-md"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-xs text-gray-700 text-center leading-relaxed">
                    {icon.detail}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {appearedCount === icons.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 text-center mt-4"
        >
          💡 Tap any card to flip and learn more
        </motion.p>
      )}
    </div>
  );
}

