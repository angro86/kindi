// Core Data Types

export interface Video {
  id: number;
  title: string;
  channel: string;
  ageMin: number;
  ageMax: number;
  cat: Category;
  youtubeId: string;
}

export type Category =
  | 'songs'
  | 'movement'
  | 'social'
  | 'math'
  | 'reading'
  | 'science'
  | 'stories'
  | 'nature'
  | 'geography'
  | 'coding'
  | 'space'
  | 'history';

export type AgeGroup = 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type QuizAgeGroup = 2 | 4 | 6;

export type CategoriesByAge = Record<number, Record<string, string>>;

// Quiz Types

export interface QuizQuestion {
  q: string;
  answers: [string, string, string];
  correct: 0 | 1 | 2;
  emoji: string;
}

export type QuestionsByAge = Record<QuizAgeGroup, QuizQuestion[]>;

// User/Profile Types

export type AvatarIndex = 0 | 1 | 2 | 3;

export interface ChildProfile {
  id: number;
  name: string;
  age: number;
  avatar: AvatarIndex;
}

// Session Types

export type SessionDuration = 15 | 30 | 45 | 60;
export type StarGoal = 3 | 5 | 10;

export interface RewardSettings {
  enabled: boolean;
  goal: StarGoal;
}

export interface SessionConfig {
  child: ChildProfile;
  duration: SessionDuration;
  categories: string[];
  rewards: RewardSettings;
}

// Component Props

export interface AvatarProps {
  size?: number;
  happy?: boolean;
  className?: string;
}

export interface IconProps {
  className?: string;
}

export interface VideoThumbnailProps {
  video: Video;
  onClick: () => void;
}

export interface TimedQuestion {
  startSec: number;
  question: QuizQuestion;
}

export type VideoQuestions = Record<string, TimedQuestion[]>;

export interface YouTubePlayerProps {
  video: Video;
  onBack: () => void;
  onQuizTime: (watchTime: number, videoTime: number) => void;
  rewards: boolean;
  quizActive: boolean;
}

export interface QuestionModalProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

export interface ChildModalProps {
  child?: ChildProfile;
  onSave: (profile: ChildProfile) => void;
  onClose: () => void;
}

export interface JarFullModalProps {
  name: string;
  onClaim: () => void;
}

export interface SetupPageProps {
  kids: ChildProfile[];
  onStart: (child: ChildProfile, duration: SessionDuration, categories: string[], rewards: RewardSettings) => void;
  onAdd: (profile: ChildProfile) => void;
}

export interface WatchPageProps {
  child: ChildProfile;
  duration: SessionDuration;
  categories: string[];
  rewards: RewardSettings;
  onEnd: () => void;
}
