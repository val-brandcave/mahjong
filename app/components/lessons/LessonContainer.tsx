"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { MobileContainer } from "../mobile/MobileContainer";
import { ArrowLeft, Home, BookOpen, Zap, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonContainerProps {
  children: ReactNode;
  lessonTitle: string;
  currentScreen: number;
  totalScreens: number;
  onBack: () => void;
}

export function LessonContainer({
  children,
  lessonTitle,
  currentScreen,
  totalScreens,
  onBack,
}: LessonContainerProps) {
  const router = useRouter();
  
  return (
    <MobileContainer>
      {/* Custom Header with Back Button */}
      <div className="mobile-header">
        <button
          onClick={onBack}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate px-2">
          {lessonTitle}
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
      
      {/* Progress Indicator */}
      <div className="px-4 py-3 bg-white/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Screen {currentScreen} of {totalScreens}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((currentScreen / totalScreens) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B565D8] to-[#5DAFA0]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentScreen / totalScreens) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push("/lessons")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={{ color: "rgb(175, 87, 219)" }}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs font-medium">Lessons</span>
          </button>

          <button
            onClick={() => router.push("/challenges")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Zap className="h-6 w-6" />
            <span className="text-xs font-medium">Challenges</span>
          </button>

          <button
            onClick={() => router.push("/more-options")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

