import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType, CVAnalysisResult, UserProgress } from '../types';
import { standardsData } from '../data/standardsData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAnalysis, setLastAnalysis] = useState<CVAnalysisResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('certifica-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const storedProgress = localStorage.getItem(`certifica-progress-${parsedUser.email}`);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
        const storedAnalysis = localStorage.getItem(`certifica-analysis-${parsedUser.email}`);
        if(storedAnalysis) {
          setLastAnalysis(JSON.parse(storedAnalysis));
        }
      }
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSetAnalysis = (analysis: CVAnalysisResult | null) => {
    setLastAnalysis(analysis);
    if(user && analysis) {
        localStorage.setItem(`certifica-analysis-${user.email}`, JSON.stringify(analysis));
    } else if (user && !analysis) {
        localStorage.removeItem(`certifica-analysis-${user.email}`);
    }
  }
  
  const updateProgress = (newProgress: UserProgress) => {
      setProgress(newProgress);
      if (user) {
          localStorage.setItem(`certifica-progress-${user.email}`, JSON.stringify(newProgress));
      }
  }

  const login = (name: string, email: string) => {
    const userData = { name, email };
    localStorage.setItem('certifica-user', JSON.stringify(userData));
    setUser(userData);
    const storedProgress = localStorage.getItem(`certifica-progress-${email}`);
    setProgress(storedProgress ? JSON.parse(storedProgress) : {});
    const storedAnalysis = localStorage.getItem(`certifica-analysis-${email}`);
    setLastAnalysis(storedAnalysis ? JSON.parse(storedAnalysis) : null);
  };

  const logout = () => {
    localStorage.removeItem('certifica-user');
    setUser(null);
    setLastAnalysis(null);
    setProgress({});
  };

  const register = (name: string, email: string) => {
    const userData = { name, email };
    localStorage.setItem('certifica-user', JSON.stringify(userData));
    setUser(userData);
    setLastAnalysis(null);
    setProgress({});
  };
  
  const startCertification = (standardCode: string) => {
      const newProgress = { ...progress, [standardCode]: { completedModules: [] } };
      updateProgress(newProgress);
  }
  
  const toggleModuleCompletion = (standardCode: string, moduleId: string) => {
      const standardProgress = progress[standardCode];
      if(!standardProgress) return;
      
      const completed = standardProgress.completedModules;
      const newCompleted = completed.includes(moduleId) 
          ? completed.filter(id => id !== moduleId)
          : [...completed, moduleId];
      
      const newProgress = { ...progress, [standardCode]: { completedModules: newCompleted } };
      updateProgress(newProgress);
  }

  const isEnrolled = (standardCode: string) => {
      return progress.hasOwnProperty(standardCode);
  }

  const getModuleStatus = (standardCode: string, moduleId: string, moduleIndex: number) => {
    if (!isEnrolled(standardCode)) return 'locked';
    if (progress[standardCode].completedModules.includes(moduleId)) return 'completed';

    if (moduleIndex === 0) return 'unlocked';
    
    const standard = standardsData.find(s => s.code === standardCode);
    if(!standard) return 'locked';

    const previousModuleId = standard.modules[moduleIndex - 1].id;
    if (progress[standardCode].completedModules.includes(previousModuleId)) return 'unlocked';

    return 'locked';
  }

  const getCertificationProgress = (standardCode: string) => {
    if (!isEnrolled(standardCode)) return 0;
    
    const standard = standardsData.find(s => s.code === standardCode);
    if (!standard || standard.modules.length === 0) return 0;
    
    const completedCount = progress[standardCode].completedModules.length;
    return Math.round((completedCount / standard.modules.length) * 100);
  }


  const value = { user, isLoading, login, logout, register, lastAnalysis, setLastAnalysis: handleSetAnalysis, progress, startCertification, toggleModuleCompletion, isEnrolled, getModuleStatus, getCertificationProgress };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};