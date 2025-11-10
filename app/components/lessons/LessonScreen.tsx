"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LessonScreen as LessonScreenType } from "@/lib/data/lessons.types";
import { Button } from "../ui/button";
import { CardFlip } from "./interactive/CardFlip";
import { IconAppear } from "./interactive/IconAppear";
import { ProgressRoadmap } from "./interactive/ProgressRoadmap";
import { ConfidenceRatingComponent } from "./interactive/ConfidenceRating";

interface LessonScreenProps {
  screen: LessonScreenType;
  onContinue: () => void;
  onInteractionComplete?: (interactionId: string) => void;
}

export function LessonScreen({ screen, onContinue, onInteractionComplete }: LessonScreenProps) {
  const [interactionComplete, setInteractionComplete] = useState(false);

  const handleInteractionComplete = (interactionId: string) => {
    setInteractionComplete(true);
    onInteractionComplete?.(interactionId);
  };
  const renderVisual = () => {
    // Placeholder for visual/video content
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#B565D8]/20 to-[#5DAFA0]/20 rounded-lg flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-6xl mb-2">🀄</div>
          <p className="text-sm text-gray-500">
            {screen.visual || 'Visual Placeholder'}
          </p>
        </div>
      </div>
    );
  };

  const renderText = () => {
    if (!screen.text) return null;
    
    if (Array.isArray(screen.text)) {
      return (
        <ul className="space-y-3 mb-6">
          {screen.text.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-start gap-3"
            >
              <span className="text-[#52B788] text-xl">✓</span>
              <span className="text-gray-700 leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      );
    }
    
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-700 leading-relaxed mb-6"
      >
        {screen.text}
      </motion.p>
    );
  };

  const renderInteractive = () => {
    if (screen.type !== 'interactive' || !screen.interactiveType) return null;

    switch (screen.interactiveType) {
      case 'card-flip':
        return (
          <CardFlip
            cards={screen.interactiveData.cards}
            requireAll={screen.interactiveData.requireAll}
            onAllFlipped={() => handleInteractionComplete('card-flip-complete')}
          />
        );
      
      case 'icon-appear':
        return (
          <IconAppear
            icons={screen.interactiveData.icons}
            onAllAppeared={() => handleInteractionComplete('icon-appear-complete')}
          />
        );
      
      case 'progress-roadmap':
        return (
          <ProgressRoadmap
            currentLesson={screen.interactiveData.currentLesson}
            totalLessons={screen.interactiveData.totalLessons}
            upcomingTopics={screen.interactiveData.upcomingTopics}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      {/* Title */}
      {screen.title && (
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          {screen.title}
        </motion.h2>
      )}

      {/* Visual */}
      {screen.visual && screen.type !== 'interactive' && renderVisual()}

      {/* Text Content */}
      {renderText()}

      {/* Interactive Content */}
      {renderInteractive()}

      {/* Narration Text (if provided) */}
      {screen.narration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-[#B565D8]"
        >
          <p className="text-sm text-gray-600 leading-relaxed italic">
            🎧 {screen.narration}
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      {screen.button && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onContinue}
            className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0] hover:opacity-90 transition-opacity"
          >
            {screen.button}
          </Button>
        </motion.div>
      )}

      {/* Continue button for completed interactive screens */}
      {!screen.button && screen.type === 'interactive' && interactionComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={onContinue}
            className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0] hover:opacity-90 transition-opacity"
          >
            Continue
          </Button>
        </motion.div>
      )}

      {/* Auto-continue for non-button, non-interactive screens */}
      {!screen.button && screen.type !== 'interactive' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onContinue}
          className="w-full mt-6 py-4 text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          Tap anywhere to continue →
        </motion.button>
      )}
    </motion.div>
  );
}

