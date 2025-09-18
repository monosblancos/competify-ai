import React from 'react';
import { Flame, Target } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  weeklyGoal,
  weeklyProgress,
  className
}) => {
  const weeklyProgressPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {/* Current Streak */}
      <div className="card-elegant p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStreak > 0 
              ? 'bg-gradient-to-br from-warning to-accent shadow-[0_0_20px_hsl(var(--warning)/0.3)]' 
              : 'bg-muted'
          }`}>
            <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{currentStreak}</div>
        <div className="text-xs text-muted-foreground">Racha actual</div>
        {longestStreak > currentStreak && (
          <div className="text-xs text-primary mt-1">
            Récord: {longestStreak} días
          </div>
        )}
      </div>

      {/* Weekly Goal */}
      <div className="card-elegant p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            weeklyProgress >= weeklyGoal
              ? 'bg-gradient-to-br from-success to-primary shadow-[0_0_20px_hsl(var(--success)/0.3)]'
              : 'bg-primary/10'
          }`}>
            <Target className={`w-5 h-5 ${weeklyProgress >= weeklyGoal ? 'text-white' : 'text-primary'}`} />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {weeklyProgress}/{weeklyGoal}
        </div>
        <div className="text-xs text-muted-foreground">Meta semanal</div>
        <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              weeklyProgress >= weeklyGoal ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${weeklyProgressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};