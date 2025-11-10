"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useLessonProgressStore } from "@/lib/store/onboarding";

interface LessonCompletionProps {
  starsEarned: number;
  xpEarned: number;
  badge: string;
  nextLessonId: number | null;
  currentLessonId: number;
}

export function LessonCompletion({
  starsEarned,
  xpEarned,
  badge,
  nextLessonId,
  currentLessonId,
}: LessonCompletionProps) {
  const router = useRouter();
  const { resetLesson } = useLessonProgressStore();

  const handleContinue = () => {
    if (nextLessonId) {
      router.push(`/lesson/${nextLessonId}`);
    } else {
      router.push("/home");
    }
  };

  const handleClose = () => {
    router.push("/home");
  };

  const handleRetry = () => {
    resetLesson(currentLessonId);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#B565D8]/10 to-[#5DAFA0]/10"
      >

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        {/* Stars */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center gap-2 mb-6"
        >
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: i < starsEarned ? 1 : 0.3, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="text-6xl"
            >
              {i < starsEarned ? "⭐" : "☆"}
            </motion.div>
          ))}
        </motion.div>

        {/* Badge */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {badge}
        </motion.h2>

        {/* Star Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-gray-600 mb-6"
        >
          {starsEarned === 3 && "Perfect! You mastered this lesson!"}
          {starsEarned === 2 && "Great job! You did really well!"}
          {starsEarned === 1 && "Good effort! You completed the lesson!"}
        </motion.p>

        {/* XP Earned */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          className="bg-gradient-to-r from-[#B565D8]/10 to-[#5DAFA0]/10 rounded-lg p-6 mb-6"
        >
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B565D8] to-[#5DAFA0] mb-2">
            +{xpEarned} XP
          </div>
          <p className="text-sm text-gray-600">Experience Points Earned</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-[#B565D8]">
              {starsEarned}
            </div>
            <div className="text-xs text-gray-600">Stars</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-[#5DAFA0]">{xpEarned}</div>
            <div className="text-xs text-gray-600">XP</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-[#E86B8E]">✓</div>
            <div className="text-xs text-gray-600">Complete</div>
          </div>
        </motion.div>

        {/* Next Lesson Unlock */}
        {nextLessonId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="bg-[#52B788]/10 border-2 border-[#52B788] rounded-lg p-4 mb-6"
          >
            <p className="text-sm font-semibold text-gray-900 mb-1">
              🎉 New Lesson Unlocked!
            </p>
            <p className="text-xs text-gray-600">
              You can now access Lesson {nextLessonId}
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full h-14 text-lg bg-gradient-to-r from-[#B565D8] to-[#5DAFA0]"
          >
            {nextLessonId ? `Start Lesson ${nextLessonId}` : "Back to Home"}
          </Button>
        </motion.div>

        {/* Retry Option */}
        {starsEarned < 3 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            onClick={handleRetry}
            className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            ↻ Retry for 3 stars
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

