"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { BookOpen, Play, RotateCcw, Lock, Star, Home, Zap, Menu } from "lucide-react";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { DUMMY_LESSONS } from "@/lib/data/dummy-users";

export default function LessonsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("lessons");

  // Group lessons by phase
  const lessonsByPhase = DUMMY_LESSONS.reduce((acc, lesson) => {
    if (!acc[lesson.phase]) {
      acc[lesson.phase] = [];
    }
    acc[lesson.phase].push(lesson);
    return acc;
  }, {} as Record<string, typeof DUMMY_LESSONS>);

  // Define phase order
  const phaseOrder = [
    "Foundation",
    "Setup & Structure",
    "The Charleston",
    "Reading the Card",
    "Basic Gameplay",
    "Strategy & Advanced",
  ];

  const handleLessonClick = (lessonId: string) => {
    const lesson = DUMMY_LESSONS.find((l) => l.id === lessonId);
    if (lesson && !lesson.completed && DUMMY_LESSONS.filter(l => l.completed).length > 2) {
      // Can play if it's the next lesson after completed ones
      router.push(`/lessons/${lessonId}`);
    } else if (lesson?.completed) {
      // Can redo completed lessons
      router.push(`/lessons/${lessonId}`);
    }
  };

  const totalStars = DUMMY_LESSONS.filter(l => l.completed).reduce((sum, l) => sum + l.starsEarned, 0);

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
                  const isCompleted = lesson.completed;
                  const isLocked = totalStars < lesson.starsRequired && !isCompleted;
                  const isNextAvailable = !isCompleted && totalStars >= lesson.starsRequired;

                  let cardBgColor = "bg-card border-border";
                  let cardHoverColor = "";
                  let cardBorderStyle = {};

                  if (isCompleted) {
                    cardBgColor = "bg-success/10";
                    cardBorderStyle = { borderColor: "rgba(76, 175, 80, 0.3)" };
                  } else if (isNextAvailable) {
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
                      onClick={() => handleLessonClick(lesson.id)}
                      disabled={isLocked}
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
                                      fill: i < lesson.starsEarned ? "rgb(175, 87, 219)" : "hsl(var(--muted-foreground))",
                                      color: i < lesson.starsEarned ? "rgb(175, 87, 219)" : "hsl(var(--muted-foreground))"
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Side - Action Icon */}
                        <div className="flex-shrink-0">
                          {isLocked ? (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Lock className="h-5 w-5 text-muted-foreground" />
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
