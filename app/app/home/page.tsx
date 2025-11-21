"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { Button } from "@/components/ui/button";
import {
  Home,
  BookOpen,
  Zap,
  Users,
  Menu,
  X,
  Crown,
  Flame,
  Star,
  ArrowRight,
  User,
  Award,
  Trophy,
  GraduationCap,
  Globe,
  UserCircle2,
  Boxes,
} from "lucide-react";
import { useLessonProgressStore, useUserStatsStore } from "@/lib/store/onboarding";

// Lesson metadata for display
const LESSONS = [
  { id: 1, title: "Welcome to Mahjong", duration: "3-5 min", tileSymbol: "Chun" },
  { id: 2, title: "Know Your Tiles", duration: "5-8 min", tileSymbol: "Sou1" },
  { id: 3, title: "Building the Walls", duration: "5-7 min", tileSymbol: "Ton" },
  { id: 4, title: "The Deal", duration: "5-7 min", tileSymbol: "Pin1" },
];

export default function HomePage() {
  const router = useRouter();
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  
  const { lessonsProgress } = useLessonProgressStore();
  const { level, totalXP, currentStreak, lessonsCompleted } = useUserStatsStore();

  // Calculate next lesson to take
  const getNextLesson = () => {
    for (const lesson of LESSONS) {
      const progress = lessonsProgress[lesson.id];
      if (!progress || !progress.completed) {
        return lesson;
      }
    }
    return LESSONS[0]; // Default to first lesson
  };

  const nextLesson = getNextLesson();
  
  // Calculate XP progress to next level
  const currentLevelXP = level * level * 100;
  const nextLevelXP = (level + 1) * (level + 1) * 100;
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;

  const dailyChallenge = {
    title: "Which Hand Is This?",
    tileSymbol: "Chun",
    difficulty: "Medium",
    duration: "3-5 min",
  };

  return (
    <MobileContainer>
      {/* Top Header */}
      <div className="mobile-header">
        <button
          onClick={() => router.push("/profile")}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Mahj Club
        </h1>
        <button
          onClick={() => router.push("/friends")}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="mobile-content space-y-4 pb-24 pt-16">
        {/* Premium Banner */}
        {showPremiumBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary via-accent to-secondary rounded-xl p-4 text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6" />
                <div>
                  <p className="font-bold text-sm">Try Premium</p>
                  <p className="text-xs opacity-90">Master Mahjong faster!</p>
                </div>
              </div>
              <button
                onClick={() => setShowPremiumBanner(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          </motion.div>
        )}

        {/* Level & Streak Section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <GraduationCap className="w-6 h-6 mb-2" style={{ color: "rgb(140, 100, 230)" }} />
            <p className="text-xs text-muted-foreground mb-1">Your Level</p>
            <h3 className="text-2xl font-bold mb-2">{level}</h3>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${(xpInCurrentLevel / xpNeededForNextLevel) * 100}%`,
                  background: "linear-gradient(to right, rgb(140, 100, 230), rgb(175, 87, 219))"
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </p>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <Flame className="w-6 h-6 mb-2" style={{ color: "rgb(255, 107, 53)" }} />
            <p className="text-xs text-muted-foreground mb-1">Day Streak</p>
            <h3 className="text-2xl font-bold mb-2">{currentStreak} Days</h3>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    background: i < 3
                      ? "linear-gradient(to right, rgb(255, 107, 53), rgb(255, 140, 80))"
                      : "hsl(var(--muted))"
                  }}
                ></div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Continue Learning */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => router.push(`/lesson/${nextLesson.id}`)}
          className="w-full bg-card border border-border rounded-xl p-4 text-left hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MahjongTile
              tileSymbol={nextLesson.tileSymbol as any}
              size={48}
              variant="regular"
              alt={nextLesson.title}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Continue Learning</p>
              <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{nextLesson.title}</h3>
              <span className="text-xs text-muted-foreground">{nextLesson.duration}</span>
            </div>
            <ArrowRight className="h-5 w-5" style={{ color: "rgb(175, 87, 219)" }} />
          </div>
        </motion.button>

        {/* Daily Challenge */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => router.push("/challenges")}
          className="w-full rounded-xl p-4 text-left border transition-colors"
          style={{
            background: "linear-gradient(to right, rgba(233, 99, 121, 0.1), rgba(233, 99, 121, 0.05))",
            borderColor: "rgba(233, 99, 121, 0.2)"
          }}
        >
          <div className="flex items-center gap-3">
            <MahjongTile
              tileSymbol={dailyChallenge.tileSymbol as any}
              size={48}
              variant="regular"
              alt={dailyChallenge.title}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Daily Challenge</p>
              <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{dailyChallenge.title}</h3>
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: "rgba(233, 99, 121, 0.2)", 
                    color: "rgb(233, 99, 121)" 
                  }}
                >
                  {dailyChallenge.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">{dailyChallenge.duration}</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5" style={{ color: "rgb(233, 99, 121)" }} />
          </div>
        </motion.button>

        {/* 3D Gameplay Demo */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => router.push("/gameplay-3d")}
          className="w-full rounded-xl p-4 text-left border transition-colors"
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
            borderColor: "rgba(99, 102, 241, 0.3)"
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))"
            }}>
              <Boxes className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">New! Preview</p>
              <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">3D Gameplay Demo</h3>
              <span className="text-xs text-muted-foreground">Interactive 3D table experience</span>
            </div>
            <ArrowRight className="h-5 w-5" style={{ color: "rgb(99, 102, 241)" }} />
          </div>
        </motion.button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center">
              <BookOpen className="h-6 w-6 flex-shrink-0" style={{ color: "rgb(175, 87, 219)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Lessons</p>
            <p className="text-lg font-bold">{lessonsCompleted}/13</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-6 w-6" style={{ color: "rgb(233, 99, 121)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Challenges</p>
            <p className="text-lg font-bold">12/32</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2">
              <Trophy className="h-6 w-6" style={{ color: "rgb(218, 165, 32)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Achievements</p>
            <p className="text-lg font-bold">8/25</p>
          </motion.div>
        </div>

        {/* Recent Friend Activity */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3">Recent Friend Activity</h3>
          <div className="space-y-2">
            {[
              { name: "Sarah Johnson", action: "Completed Lesson 4", time: "2h ago", bgColor: "rgb(175, 87, 219)" },
              { name: "Linda Martinez", action: "Earned a 7-day streak", time: "5h ago", bgColor: "rgb(233, 99, 121)" },
              { name: "Patricia Chen", action: "Mastered Pattern Recognition", time: "1d ago", bgColor: "rgb(64, 175, 175)" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-3 pb-2 border-b border-border/50 last:border-b-0 last:pb-0"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <UserCircle2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">{item.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={{ color: activeTab === "home" ? "rgb(64, 175, 175)" : "hsl(var(--muted-foreground))" }}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push("/lessons")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "lessons" ? "rgb(175, 87, 219)" : undefined }}
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
