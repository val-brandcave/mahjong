"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { MobileContainer } from "../mobile/MobileContainer";
import { ArrowLeft } from "lucide-react";

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
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </MobileContainer>
  );
}

