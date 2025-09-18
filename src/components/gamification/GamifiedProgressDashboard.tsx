import React from 'react';
import { LevelProgress } from './LevelProgress';
import { StreakCounter } from './StreakCounter';
import { AchievementCard } from './AchievementCard';
import { Badge } from './Badge';
import { GamificationData } from '../../types';
import { Trophy, Target, Zap, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge as UIBadge } from '../ui/badge';

interface GamifiedProgressDashboardProps {
  gamificationData: GamificationData;
  className?: string;
}

export const GamifiedProgressDashboard: React.FC<GamifiedProgressDashboardProps> = ({
  gamificationData,
  className
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-purple-800/90"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Tu Progreso de
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Certificación CONOCER
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Avanza hacia tu certificación mientras ganas puntos y desbloqueas logros profesionales
            </p>
          </div>
        </div>
      </section>

      {/* Progress Cards */}
      <section className="relative -mt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Level Progress Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Progreso General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LevelProgress 
                  level={gamificationData.level}
                  xp={gamificationData.xp}
                  xpToNextLevel={gamificationData.xpToNextLevel}
                />
              </CardContent>
            </Card>

            {/* Streak Counter Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Racha y Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreakCounter 
                  currentStreak={gamificationData.currentStreak}
                  longestStreak={gamificationData.longestStreak}
                  weeklyGoal={gamificationData.weeklyGoal}
                  weeklyProgress={gamificationData.weeklyProgress}
                />
              </CardContent>
            </Card>
          </div>

          {/* Badges Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden mb-8 hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                Logros Desbloqueados
                <UIBadge className="bg-purple-100 text-purple-700 ml-auto">
                  {gamificationData.badges.filter(b => b.unlockedAt).length} / {gamificationData.badges.length}
                </UIBadge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {gamificationData.badges.map((badge, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 group">
                    <Badge badge={badge} size="lg" />
                    <span className="text-xs text-center font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AchievementCard 
                badges={gamificationData.badges}
                totalModulesCompleted={gamificationData.totalModulesCompleted}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};