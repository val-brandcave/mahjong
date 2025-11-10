"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { LessonContainer } from "@/components/lessons/LessonContainer";
import { LessonScreen } from "@/components/lessons/LessonScreen";
import { LessonQuiz } from "@/components/lessons/LessonQuiz";
import { LessonCompletion } from "@/components/lessons/LessonCompletion";
import { ConfidenceRatingComponent } from "@/components/lessons/interactive/ConfidenceRating";
import { useLessonProgressStore } from "@/lib/store/onboarding";
import { lesson01 } from "@/lib/data/lesson-01";
import { lesson02 } from "@/lib/data/lesson-02";
import { lesson03 } from "@/lib/data/lesson-03";
import { LessonData } from "@/lib/data/lessons.types";

// Map of lesson data (add more as they're created)
const LESSONS_MAP: Record<number, LessonData> = {
  1: lesson01,
  2: lesson02,
  3: lesson03,
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = Number(params.id);
  
  const {
    startLesson,
    goToScreen,
    markScreenComplete,
    markInteractionComplete,
    completeLesson,
    currentLessonId,
    getLessonProgress,
  } = useLessonProgressStore();

  const lessonData = LESSONS_MAP[lessonId];
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showConfidenceRating, setShowConfidenceRating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [quizResults, setQuizResults] = useState({ correct: 0, total: 0 });

  // Initialize lesson on mount
  useEffect(() => {
    if (lessonData && currentLessonId !== lessonId) {
      const totalScreens = lessonData.screens.length + 
        lessonData.quiz.length + 
        (lessonData.confidenceRating ? 1 : 0);
      startLesson(lessonId, totalScreens);
    }
  }, [lessonData, lessonId, currentLessonId, startLesson]);

  if (!lessonData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            This lesson isn't available yet.
          </p>
          <button
            onClick={() => router.push("/home")}
            className="text-[#B565D8] hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex((prev) => prev - 1);
      goToScreen(currentScreenIndex);
    } else {
      router.push("/home");
    }
  };

  const handleContinue = () => {
    markScreenComplete(currentScreenIndex + 1);

    if (currentScreenIndex < lessonData.screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1);
      goToScreen(currentScreenIndex + 2);
    } else {
      // Move to quiz
      setShowQuiz(true);
    }
  };

  const handleInteractionComplete = (interactionId: string) => {
    markInteractionComplete(interactionId);
  };

  const handleQuizComplete = (correctCount: number, totalCount: number) => {
    setQuizResults({ correct: correctCount, total: totalCount });
    setShowQuiz(false);

    if (lessonData.confidenceRating) {
      setShowConfidenceRating(true);
    } else {
      finishLesson(correctCount, totalCount);
    }
  };

  const handleConfidenceRatingComplete = () => {
    finishLesson(quizResults.correct, quizResults.total);
  };

  const finishLesson = (correctCount: number, totalCount: number) => {
    // Calculate stars based on quiz performance
    const percentage = (correctCount / totalCount) * 100;
    let stars = 1;
    if (percentage === 100) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;
    else stars = 0;

    completeLesson(stars);
    setShowCompletion(true);
  };

  // Show completion screen
  if (showCompletion) {
    const percentage = (quizResults.correct / quizResults.total) * 100;
    let stars = 1;
    if (percentage === 100) stars = 3;
    else if (percentage >= 70) stars = 2;
    else if (percentage >= 50) stars = 1;

    const xpEarned = lessonData.rewards.baseXP + lessonData.rewards.starBonusXP[stars];

    return (
      <LessonCompletion
        starsEarned={stars}
        xpEarned={xpEarned}
        badge={lessonData.rewards.badge}
        nextLessonId={lessonData.metadata.unlocks}
        currentLessonId={lessonId}
      />
    );
  }

  // Show confidence rating
  if (showConfidenceRating && lessonData.confidenceRating) {
    return (
      <ConfidenceRatingComponent
        question={lessonData.confidenceRating.question}
        options={lessonData.confidenceRating.options}
        response={lessonData.confidenceRating.response}
        onComplete={handleConfidenceRatingComplete}
      />
    );
  }

  // Show quiz
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-white">
        <LessonQuiz
          questions={lessonData.quiz}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  // Show lesson screens
  const currentScreen = lessonData.screens[currentScreenIndex];
  const totalScreens = lessonData.screens.length;

  return (
    <LessonContainer
      lessonTitle={lessonData.metadata.title}
      currentScreen={currentScreenIndex + 1}
      totalScreens={totalScreens}
      onBack={handleBack}
    >
      <AnimatePresence mode="wait">
        <LessonScreen
          key={currentScreenIndex}
          screen={currentScreen}
          onContinue={handleContinue}
          onInteractionComplete={handleInteractionComplete}
        />
      </AnimatePresence>
    </LessonContainer>
  );
}

