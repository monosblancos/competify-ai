import { useState, useMemo, useEffect } from 'react';
import { GamificationData, Badge, UserProgress } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Mock badges system - in real app this would come from backend
const mockBadges: Badge[] = [
  {
    id: 'first-module',
    name: 'Primer Paso',
    description: 'Completa tu primer módulo',
    icon: 'star',
    category: 'completion',
    rarity: 'common'
  },
  {
    id: 'week-streak',
    name: 'Constancia',
    description: 'Mantén una racha de 7 días',
    icon: 'flame',
    category: 'streak',
    rarity: 'rare'
  },
  {
    id: 'speed-learner',
    name: 'Aprendiz Veloz',
    description: 'Completa 3 módulos en un día',
    icon: 'zap',
    category: 'speed',
    rarity: 'epic'
  },
  {
    id: 'first-certification',
    name: 'Certificado',
    description: 'Completa tu primera certificación',
    icon: 'trophy',
    category: 'milestone',
    rarity: 'rare'
  },
  {
    id: 'dedication',
    name: 'Dedicación Total',
    description: 'Completa 50 módulos',
    icon: 'target',
    category: 'milestone',
    rarity: 'epic'
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Mantén una racha de 30 días',
    icon: 'award',
    category: 'streak',
    rarity: 'legendary'
  },
  {
    id: 'scholar',
    name: 'Erudito',
    description: 'Completa 5 certificaciones',
    icon: 'trophy',
    category: 'milestone',
    rarity: 'legendary'
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Completa módulos antes de las 8 AM',
    icon: 'clock',
    category: 'speed',
    rarity: 'common'
  }
];

export const useGamification = (progress: UserProgress): GamificationData => {
  const [badgeBenefits, setBadgeBenefits] = useState<Record<string, any>>({});

  // Fetch badge benefits from database
  useEffect(() => {
    const fetchBadgeBenefits = async () => {
      const { data, error } = await supabase
        .from('badge_benefits')
        .select('*')
        .eq('active', true);

      if (!error && data) {
        const benefitsMap = data.reduce((acc, benefit) => {
          acc[benefit.badge_id] = benefit;
          return acc;
        }, {} as Record<string, any>);
        setBadgeBenefits(benefitsMap);
      }
    };

    fetchBadgeBenefits();
  }, []);

  // Calculate total modules completed
  const totalModulesCompleted = useMemo(() => {
    return Object.values(progress).reduce(
      (total, standardProgress) => total + (standardProgress.completedModules?.length || 0),
      0
    );
  }, [progress]);

  // Calculate XP based on completed modules (100 XP per module)
  const xp = totalModulesCompleted * 100;

  // Calculate level (every 500 XP = 1 level)
  const level = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const xpToNextLevel = 500 - xpInCurrentLevel;

  // Calculate streaks (mock data for demo)
  const currentStreak = useMemo(() => {
    // In real app, calculate based on consecutive days of activity
    const hasRecentActivity = Object.values(progress).some(p => p.lastActivity);
    return hasRecentActivity ? Math.floor(Math.random() * 15) + 1 : 0;
  }, [progress]);

  const longestStreak = Math.max(currentStreak, 21); // Mock longest streak

  // Weekly progress (mock data)
  const weeklyGoal = 5; // 5 modules per week
  const weeklyProgress = Math.min(totalModulesCompleted % 7, weeklyGoal);

  // Determine unlocked badges
  const badges = useMemo(() => {
    return mockBadges.map(badge => {
      let unlocked = false;
      let unlockedAt: string | undefined;

      switch (badge.id) {
        case 'first-module':
          unlocked = totalModulesCompleted >= 1;
          break;
        case 'week-streak':
          unlocked = currentStreak >= 7;
          break;
        case 'speed-learner':
          // Mock: unlock if completed more than 5 modules
          unlocked = totalModulesCompleted >= 5;
          break;
        case 'first-certification':
          // Check if any standard is completed (assuming 8 modules per standard)
          unlocked = Object.values(progress).some(p => (p.completedModules?.length || 0) >= 8);
          break;
        case 'dedication':
          unlocked = totalModulesCompleted >= 50;
          break;
        case 'perfectionist':
          unlocked = currentStreak >= 30;
          break;
        case 'scholar':
          const completedCertifications = Object.values(progress).filter(
            p => (p.completedModules?.length || 0) >= 8
          ).length;
          unlocked = completedCertifications >= 5;
          break;
        case 'early-bird':
          // Mock unlock based on some activity
          unlocked = totalModulesCompleted >= 3;
          break;
      }

      if (unlocked && !badge.unlockedAt) {
        // Mock unlock date (in real app this would be stored)
        const daysAgo = Math.floor(Math.random() * 30);
        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() - daysAgo);
        unlockedAt = unlockDate.toISOString();
      }

      return {
        ...badge,
        unlockedAt: unlocked ? unlockedAt : undefined,
        benefits: badgeBenefits[badge.id] // Attach benefits from database
      };
    });
  }, [totalModulesCompleted, currentStreak, progress]);

  return {
    level,
    xp,
    xpToNextLevel,
    currentStreak,
    longestStreak,
    totalModulesCompleted,
    badges,
    weeklyGoal,
    weeklyProgress
  };
};