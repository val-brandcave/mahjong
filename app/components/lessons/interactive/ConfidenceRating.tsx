"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";

interface ConfidenceOption {
  value: string;
  emoji: string;
  text: string;
}

interface ConfidenceRatingComponentProps {
  question: string;
  options: ConfidenceOption[];
  response: string;
  onComplete: (value: string) => void;
}

export function ConfidenceRatingComponent({
  question,
  options,
  response,
  onComplete,
}: ConfidenceRatingComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleContinue = () => {
    if (selected) {
      setShowResponse(true);
      setTimeout(() => {
        onComplete(selected);
      }, 2000);
    }
  };

  return (
    <div className="p-6">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 mb-6 text-center"
      >
        {question}
      </motion.h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(option.value)}
            className={`
              relative p-6 rounded-lg border-2 transition-all
              ${
                selected === option.value
                  ? "border-[#B565D8] bg-[#B565D8]/10"
                  : "border-gray-200 bg-white hover:border-[#5DAFA0]"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-3">{option.emoji}</div>
            <div className="text-sm font-medium text-gray-700">
              {option.text}
            </div>
            
            {selected === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-[#52B788] rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {selected && !showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0]"
          >
            Continue
          </Button>
        </motion.div>
      )}

      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#52B788]/10 border-2 border-[#52B788] rounded-lg p-4"
        >
          <p className="text-gray-700 leading-relaxed">{response}</p>
        </motion.div>
      )}
    </div>
  );
}

