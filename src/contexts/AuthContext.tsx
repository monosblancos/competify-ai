import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { AuthContextType, CVAnalysisResult, UserProgress } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAnalysis, setLastAnalysis] = useState<CVAnalysisResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST (synchronous only!)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // Important: set loading false on any auth change
        
        // Defer any Supabase calls to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
            }
          }, 0);
        } else {
          setUserProfile(null);
          setLastAnalysis(null);
          setProgress({});
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            fetchUserProfile(session.user.id);
          }
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (profile) {
        setUserProfile(profile);
        setLastAnalysis(profile.last_analysis_result as unknown as CVAnalysisResult | null);
        setProgress((profile.progress as unknown as UserProgress) || {});
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    // Demo mode - bypass authentication for demo users
    if (email === 'demo@certificaglobal.mx' || email === 'demo') {
      const demoUser: any = {
        id: 'demo-user',
        email: 'demo@certificaglobal.mx',
        user_metadata: { name: 'Usuario Demo' }
      };
      
      setUser(demoUser);
      setSession({ user: demoUser } as any);
      setIsLoading(false);
      
      // Set demo data for CV analysis and progress
      setLastAnalysis({
        strengths: ['Liderazgo de equipos', 'Gestión de proyectos', 'Comunicación efectiva'],
        opportunities: ['Análisis financiero', 'Certificación en competencias digitales'],
        recommendedStandard: { code: 'EC0301', title: 'Gestión de Proyectos' }
      });
      
      setProgress({
        'EC0301': { completedModules: ['modulo1'] },
        'EC0366': { completedModules: [] }
      });
      
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const register = async (email: string, password: string, metadata?: { name?: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const updateProgress = async (newProgress: UserProgress) => {
    if (!user) return;
    
    // For demo user, just update in memory
    if (user.id === 'demo-user') {
      setProgress(newProgress);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ progress: newProgress })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating progress:', error);
        return;
      }

      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const updateLastAnalysis = async (analysis: CVAnalysisResult) => {
    if (!user) return;
    
    // For demo user, just update in memory
    if (user.id === 'demo-user') {
      setLastAnalysis(analysis);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ last_analysis_result: analysis as any })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating analysis:', error);
        return;
      }

      setLastAnalysis(analysis);
    } catch (error) {
      console.error('Error updating analysis:', error);
    }
  };

  const startCertification = (standardCode: string) => {
    const newProgress = {
      ...progress,
      [standardCode]: { completedModules: [] }
    };
    updateProgress(newProgress);
  };

  const toggleModuleCompletion = (standardCode: string, moduleId: string) => {
    if (!progress[standardCode]) {
      startCertification(standardCode);
      return;
    }

    const currentModules = progress[standardCode].completedModules;
    const updatedModules = currentModules.includes(moduleId)
      ? currentModules.filter(id => id !== moduleId)
      : [...currentModules, moduleId];

    const newProgress = {
      ...progress,
      [standardCode]: { completedModules: updatedModules }
    };
    updateProgress(newProgress);
  };

  const isEnrolled = (standardCode: string): boolean => {
    return Boolean(progress[standardCode]);
  };

  const getModuleStatus = (standardCode: string, moduleId: string, moduleIndex: number): 'completed' | 'unlocked' | 'locked' => {
    if (!progress[standardCode]) return 'locked';
    
    const completedModules = progress[standardCode].completedModules;
    
    if (completedModules.includes(moduleId)) {
      return 'completed';
    }
    
    if (moduleIndex === 0 || completedModules.length >= moduleIndex) {
      return 'unlocked';
    }
    
    return 'locked';
  };

  const getCertificationProgress = (standardCode: string): number => {
    if (!progress[standardCode]) return 0;
    
    // This is a simplified calculation - in real implementation, 
    // you would get the total modules from the standards data
    const completedCount = progress[standardCode].completedModules.length;
    const totalModules = 3; // Hardcoded for demo, should be dynamic
    
    return (completedCount / totalModules) * 100;
  };

  const value: AuthContextType = {
    user: user ? { 
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario', 
      email: user.email || ''
    } : null,
    isLoading,
    login,
    logout,
    register,
    lastAnalysis,
    setLastAnalysis: updateLastAnalysis,
    progress,
    startCertification,
    toggleModuleCompletion,
    isEnrolled,
    getModuleStatus,
    getCertificationProgress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};