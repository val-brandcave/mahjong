"use client";

import { motion } from "framer-motion";

interface ProgressRoadmapProps {
  currentLesson: number;
  totalLessons: number;
  upcomingTopics: string[];
}

export function ProgressRoadmap({
  currentLesson,
  totalLessons,
  upcomingTopics,
}: ProgressRoadmapProps) {
  return (
    <div className="mb-6">
      {/* Visual Roadmap */}
      <div className="bg-gradient-to-br from-[#B565D8]/10 to-[#5DAFA0]/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Learning Journey
        </h3>
        
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex items-center justify-between mb-4 min-w-max">
            {Array.from({ length: totalLessons }, (_, i) => {
            const lessonNum = i + 1;
            const isCompleted = lessonNum < currentLesson;
            const isCurrent = lessonNum === currentLesson;
            const isUpcoming = lessonNum > currentLesson;

            return (
              <div key={lessonNum} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    ${
                      isCompleted
                        ? "bg-[#52B788] text-white"
                        : isCurrent
                        ? "bg-[#B565D8] text-white ring-4 ring-[#B565D8]/30"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? "✓" : lessonNum}
                  
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#B565D8]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {i < totalLessons - 1 && (
                  <div
                    className={`
                      w-8 h-1 mx-1
                      ${isCompleted ? "bg-[#52B788]" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Lesson {currentLesson} of {totalLessons} Complete
        </p>
      </div>

      {/* Upcoming Topics */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          In the next lessons, you'll learn:
        </h4>
        <ul className="space-y-2">
          {upcomingTopics.map((topic, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="text-[#B565D8] mt-0.5">✓</span>
              <span>{topic}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

