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
  };
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
  login: (name: string, email: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  lastAnalysis: CVAnalysisResult | null;
  setLastAnalysis: (analysis: CVAnalysisResult | null) => void;
  progress: UserProgress;
  startCertification: (standardCode: string) => void;
  toggleModuleCompletion: (standardCode: string, moduleId: string) => void;
  isEnrolled: (standardCode: string) => boolean;
  getModuleStatus: (standardCode: string, moduleId: string, moduleIndex: number) => 'completed' | 'unlocked' | 'locked';
  getCertificationProgress: (standardCode: string) => number;
}