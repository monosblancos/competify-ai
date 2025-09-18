import React from 'react';
import { LevelProgress } from './LevelProgress';
import { StreakCounter } from './StreakCounter';
import { AchievementCard } from './AchievementCard';
import { Badge } from './Badge';
import { GamificationData } from '../../types';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

interface GamifiedProgressDashboardProps {
  gamificationData: GamificationData;
  className?: string;
}

export const GamifiedProgressDashboard: React.FC<GamifiedProgressDashboardProps> = ({
  gamificationData,
  className
}) => {
  const {
    level,
    xp,
    xpToNextLevel,
    currentStreak,
    longestStreak,
    totalModulesCompleted,
    badges,
    weeklyGoal,
    weeklyProgress
  } = gamificationData;

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const nextBadges = badges.filter(b => !b.unlockedAt).slice(0, 3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Level Progress */}
      <div className="card-glow p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary" />
          Tu Progreso
        </h2>
        <LevelProgress 
          level={level}
          xp={xp}
          xpToNextLevel={xpToNextLevel}
        />
      </div>

      {/* Streaks and Goals */}
      <div className="card-glow p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Metas y Rachas
        </h2>
        <StreakCounter
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          weeklyGoal={weeklyGoal}
          weeklyProgress={weeklyProgress}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-elegant p-4 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalModulesCompleted}</div>
          <div className="text-sm text-muted-foreground">Módulos completados</div>
        </div>

        <div className="card-elegant p-4 text-center">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-foreground">{xp}</div>
          <div className="text-sm text-muted-foreground">Puntos totales</div>
        </div>
      </div>

      {/* Achievements */}
      <AchievementCard
        badges={badges}
        totalModulesCompleted={totalModulesCompleted}
      />

      {/* Next Badges to Unlock */}
      {nextBadges.length > 0 && (
        <div className="card-elegant p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-muted-foreground" />
            Próximos Logros
          </h3>
          <div className="space-y-3">
            {nextBadges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Badge badge={badge} size="sm" showTooltip={false} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};