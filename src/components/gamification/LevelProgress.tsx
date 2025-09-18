import React from 'react';
import { Progress } from '../ui/progress';
import { Star, Zap } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  className?: string;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ 
  level, 
  xp, 
  xpToNextLevel, 
  className 
}) => {
  const progress = (xp / (xp + xpToNextLevel)) * 100;
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {level}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Nivel {level}</h3>
            <p className="text-sm text-muted-foreground">
              {xp} / {xp + xpToNextLevel} XP
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-warning">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">+{Math.floor(xp / 100)} pts</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-3 bg-secondary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progreso al siguiente nivel</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};