export interface User {
  name: string;
  email: string;
}

export enum DemandLevel {
  Alta = 'Alta',
  Media = 'Media',
  Baja = 'Baja',
}

export interface ModuleContent {
  type: 'video' | 'pdf' | 'text';
  url?: string;
  text?: string;
  title?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration?: string;
  isPractical?: boolean;
  content?: ModuleContent[];
}

export interface Standard {
  code: string;
  title: string;
  description: string;
  category: string;
  modules: Module[];
  isCoreOffering?: boolean;
}

export interface CVAnalysisResult {
  strengths: string[];
  opportunities: string[];
  recommendedStandard: {
    code: string;
    title: string;
  };
}

export interface UserProgress {
  [standardCode: string]: {
    completedModules: string[];
    lastActivity?: string;
    streak?: number;
    totalTimeSpent?: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'streak' | 'speed' | 'milestone';
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalModulesCompleted: number;
  badges: Badge[];
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredStandards: string[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error: any }>;
  lastAnalysis: CVAnalysisResult | null;
  setLastAnalysis: (analysis: CVAnalysisResult) => Promise<void>;
  progress: UserProgress;
  startCertification: (standardCode: string) => void;
  toggleModuleCompletion: (standardCode: string, moduleId: string) => void;
  isEnrolled: (standardCode: string) => boolean;
  getModuleStatus: (standardCode: string, moduleId: string, moduleIndex: number) => 'completed' | 'unlocked' | 'locked';
  getCertificationProgress: (standardCode: string) => number;
}