"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { BookOpen, Play, RotateCcw, Lock, Star, Home, Zap, Menu } from "lucide-react";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { useLessonProgressStore, useUserStatsStore } from "@/lib/store/onboarding";

// All lessons metadata
const ALL_LESSONS = [
  { id: 1, title: "Welcome to Mahjong", phase: "Foundation", difficulty: "Beginner", duration: "3-5 min", starsRequired: 0, tileSymbol: "Chun" },
  { id: 2, title: "Know Your Tiles", phase: "Foundation", difficulty: "Beginner", duration: "5-8 min", starsRequired: 0, tileSymbol: "Sou1" },
  { id: 3, title: "Building the Walls", phase: "Setup & Structure", difficulty: "Beginner", duration: "5-7 min", starsRequired: 0, tileSymbol: "Ton" },
  { id: 4, title: "The Deal", phase: "Setup & Structure", difficulty: "Beginner", duration: "4-6 min", starsRequired: 5, tileSymbol: "Pin1" },
  { id: 5, title: "Charleston Part 1 - The Right Pass", phase: "The Charleston", difficulty: "Intermediate", duration: "6-8 min", starsRequired: 10, tileSymbol: "Nan" },
  { id: 6, title: "Charleston Part 2 - Across and Left", phase: "The Charleston", difficulty: "Intermediate", duration: "7-10 min", starsRequired: 15, tileSymbol: "Pei" },
  { id: 7, title: "Charleston Part 3 - Second Charleston", phase: "The Charleston", difficulty: "Intermediate", duration: "8-10 min", starsRequired: 15, tileSymbol: "Shaa" },
  { id: 8, title: "Understanding the Card", phase: "Reading the Card", difficulty: "Intermediate", duration: "8-10 min", starsRequired: 20, tileSymbol: "Man5" },
  { id: 9, title: "Gameplay Basics", phase: "Basic Gameplay", difficulty: "Intermediate", duration: "10-12 min", starsRequired: 20, tileSymbol: "Pin5" },
  { id: 10, title: "Winning & Scoring", phase: "Basic Gameplay", difficulty: "Intermediate", duration: "6-8 min", starsRequired: 25, tileSymbol: "Sou5" },
  { id: 11, title: "Strategy - Choosing Your Hand", phase: "Strategy & Advanced", difficulty: "Advanced", duration: "8-10 min", starsRequired: 50, tileSymbol: "Man9" },
  { id: 12, title: "Advanced Strategy - Reading the Game", phase: "Strategy & Advanced", difficulty: "Advanced", duration: "10-12 min", starsRequired: 75, tileSymbol: "Sou9" },
];

export default function LessonsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("lessons");
  
  const { lessonsProgress } = useLessonProgressStore();
  const { totalStars } = useUserStatsStore();

  // Define phase order
  const phaseOrder = [
    "Foundation",
    "Setup & Structure",
    "The Charleston",
    "Reading the Card",
    "Basic Gameplay",
    "Strategy & Advanced",
  ];

  // Group lessons by phase
  const lessonsByPhase = ALL_LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.phase]) {
      acc[lesson.phase] = [];
    }
    acc[lesson.phase].push(lesson);
    return acc;
  }, {} as Record<string, typeof ALL_LESSONS>);

  const handleLessonClick = (lessonId: number) => {
    const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return;
    
    const progress = lessonsProgress[lessonId];
    const isLocked = totalStars < lesson.starsRequired && (!progress || !progress.completed);
    
    // Only navigate if lesson is available (not locked) or if lessons 1-3
    if (lessonId <= 3 || !isLocked || progress?.completed) {
      router.push(`/lesson/${lessonId}`);
    }
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Lessons"
        centered
        rightAction={
          <BookOpen className="h-6 w-6" style={{ color: "rgb(175, 87, 219)" }} />
        }
      />

      {/* Content */}
      <div className="mobile-content space-y-8 pb-24 pt-16">
        {/* Phase Sections */}
        {phaseOrder.map((phase) => {
          const phaseLessons = lessonsByPhase[phase];
          if (!phaseLessons) return null;

          return (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Phase Header */}
              <h2 className="text-lg font-bold text-foreground mb-4 px-2">{phase}</h2>

              {/* Lessons in this phase */}
              <div className="space-y-3">
                {phaseLessons.map((lesson, index) => {
                  const progress = lessonsProgress[lesson.id];
                  const isCompleted = progress?.completed || false;
                  const starsEarned = progress?.starsEarned || 0;
                  const isLocked = totalStars < lesson.starsRequired && !isCompleted;
                  const isNextAvailable = !isCompleted && totalStars >= lesson.starsRequired;
                  const isAvailable = lesson.id <= 3; // Lessons 1-3 always available

                  let cardBgColor = "bg-card border-border";
                  let cardHoverColor = "";
                  let cardBorderStyle = {};
                  const canClick = isAvailable || isCompleted || isNextAvailable;

                  if (isCompleted) {
                    cardBgColor = "bg-success/10";
                    cardBorderStyle = { borderColor: "rgba(76, 175, 80, 0.3)" };
                  } else if (isAvailable || isNextAvailable) {
                    cardBgColor = "bg-card";
                    cardBorderStyle = { borderColor: "rgba(175, 87, 219, 0.5)" };
                    cardHoverColor = "hover:bg-accent/5";
                  } else if (isLocked) {
                    cardBgColor = "bg-muted/40 border-muted/50 opacity-60";
                    cardHoverColor = "";
                  }

                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => canClick && handleLessonClick(lesson.id)}
                      disabled={!canClick}
                      className={`w-full text-left rounded-xl p-4 transition-all border ${cardBgColor} ${!isLocked ? cardHoverColor : ""}`}
                      style={cardBorderStyle}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left Side - Icon and Content */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Mahjong Tile Icon */}
                          <div className="flex-shrink-0">
                            <MahjongTile
                              tileSymbol={lesson.tileSymbol as any}
                              size={48}
                              variant="regular"
                              alt={lesson.title}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                              {lesson.title}
                            </h3>

                            {/* Difficulty and Duration */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                lesson.difficulty === "Beginner"
                                  ? "bg-blue-100 text-blue-700"
                                  : lesson.difficulty === "Intermediate"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>

                            {/* Stars for completed lessons */}
                            {isCompleted && (
                              <div className="flex items-center gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3"
                                    style={{ 
                                      fill: i < starsEarned ? "rgb(175, 87, 219)" : "hsl(var(--muted-foreground))",
                                      color: i < starsEarned ? "rgb(175, 87, 219)" : "hsl(var(--muted-foreground))"
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Action Icon */}
                        <div className="flex-shrink-0 relative">
                          {isLocked && !isAvailable ? (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Lock className="h-5 w-5 text-muted-foreground" />
                              {lesson.starsRequired > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {lesson.starsRequired}
                                </div>
                              )}
                            </div>
                          ) : isCompleted ? (
                            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                              <RotateCcw className="h-5 w-5 text-success" />
                            </div>
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "rgba(175, 87, 219, 0.2)" }}
                            >
                              <Play className="h-5 w-5" style={{ color: "rgb(175, 87, 219)", fill: "rgb(175, 87, 219)" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "home" ? "rgb(64, 175, 175)" : undefined }}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={{ color: activeTab === "lessons" ? "rgb(175, 87, 219)" : "hsl(var(--muted-foreground))" }}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs font-medium">Lessons</span>
          </button>

          <button
            onClick={() => router.push("/challenges")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "challenges" ? "rgb(233, 99, 121)" : undefined }}
          >
            <Zap className="h-6 w-6" />
            <span className="text-xs font-medium">Challenges</span>
          </button>

          <button
            onClick={() => router.push("/more-options")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "more" ? "rgb(140, 100, 80)" : undefined }}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
