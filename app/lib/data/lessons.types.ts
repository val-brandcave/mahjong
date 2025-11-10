// Lesson Data Types

export interface LessonScreen {
  screenNum: number;
  type: 'hero' | 'video' | 'content' | 'interactive' | 'quiz' | 'rating' | 'completion';
  title?: string;
  visual?: string; // placeholder or image URL
  narration?: string;
  text?: string | string[];
  interactiveType?: 'card-flip' | 'icon-appear' | 'progress-roadmap' | 'confidence-rating';
  interactiveData?: any; // specific to interaction type
  button?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface ConfidenceRating {
  question: string;
  options: {
    value: string;
    emoji: string;
    text: string;
  }[];
  response: string;
}

export interface LessonRewards {
  baseXP: number;
  starBonusXP: { [key: number]: number }; // 1: 0, 2: 25, 3: 50
  nextLessonUnlock: number;
  badge: string;
}

export interface LessonMetadata {
  id: number;
  code: string;
  title: string;
  phase: string;
  priority: string;
  duration: string;
  difficulty: string;
  prerequisites: string[];
  unlocks: number | null;
  starRequirement: number;
  premiumOnly: boolean;
}

export interface LessonData {
  metadata: LessonMetadata;
  screens: LessonScreen[];
  quiz: QuizQuestion[];
  confidenceRating?: ConfidenceRating;
  rewards: LessonRewards;
}

