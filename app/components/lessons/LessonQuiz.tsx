"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/lib/data/lessons.types";
import { Button } from "../ui/button";

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

export function LessonQuiz({ questions, onComplete }: LessonQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleSelect = (optionId: string) => {
    if (!showFeedback) {
      setSelected(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;

    const selectedOption = question.options.find((opt) => opt.id === selected);
    if (selectedOption?.correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(correctAnswers + (showFeedback && question.options.find(opt => opt.id === selected)?.correct ? 1 : 0), questions.length);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const selectedOption = question.options.find((opt) => opt.id === selected);
  const isCorrect = selectedOption?.correct || false;

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full
                  ${index < currentQuestion ? "bg-[#52B788]" : index === currentQuestion ? "bg-[#B565D8]" : "bg-gray-300"}
                `}
              />
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {question.question}
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3 mb-6"
        >
          {question.options.map((option, index) => {
            const isSelected = selected === option.id;
            const showResult = showFeedback && isSelected;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(option.id)}
                disabled={showFeedback}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all
                  ${
                    showResult && option.correct
                      ? "border-[#52B788] bg-[#52B788]/10"
                      : showResult && !option.correct
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-[#B565D8] bg-[#B565D8]/10"
                      : "border-gray-200 bg-white hover:border-[#5DAFA0]"
                  }
                  ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                whileHover={!showFeedback ? { scale: 1.02 } : {}}
                whileTap={!showFeedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm
                      ${
                        showResult && option.correct
                          ? "border-[#52B788] bg-[#52B788] text-white"
                          : showResult && !option.correct
                          ? "border-red-500 bg-red-500 text-white"
                          : isSelected
                          ? "border-[#B565D8] bg-[#B565D8] text-white"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {showResult && option.correct && "✓"}
                    {showResult && !option.correct && "✕"}
                    {!showFeedback && isSelected && "✓"}
                  </div>
                  <span className="text-gray-900 font-medium">{option.text}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            rounded-lg p-4 mb-6
            ${
              isCorrect
                ? "bg-[#52B788]/10 border-2 border-[#52B788]"
                : "bg-red-50 border-2 border-red-300"
            }
          `}
        >
          <p className="text-gray-900 leading-relaxed">
            {isCorrect ? question.correctFeedback : question.incorrectFeedback}
          </p>
        </motion.div>
      )}

      {!showFeedback && selected && (
        <Button
          onClick={handleSubmit}
          className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0]"
        >
          Submit Answer
        </Button>
      )}

      {showFeedback && (
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0]"
        >
          {isLastQuestion ? "Complete Lesson" : "Next Question"}
        </Button>
      )}
    </div>
  );
}

