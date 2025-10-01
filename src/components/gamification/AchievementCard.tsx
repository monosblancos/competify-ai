import React from 'react';
import { Badge } from './Badge';
import { Badge as BadgeType } from '../../types';
import { Clock, Trophy, Gift } from 'lucide-react';

interface AchievementCardProps {
  badges: BadgeType[];
  totalModulesCompleted: number;
  className?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  badges,
  totalModulesCompleted,
  className
}) => {
  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const recentBadge = unlockedBadges.sort((a, b) => 
    new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
  )[0];

  // Count badges with benefits
  const badgesWithBenefits = unlockedBadges.filter((b: any) => 
    b.benefits && (
      b.benefits.discount_pct > 0 || 
      b.benefits.premium_access_days > 0 ||
      (b.benefits.special_features && b.benefits.special_features.length > 0)
    )
  );

  return (
    <div className={`card-elegant p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-primary" />
          Logros
        </h3>
        <span className="text-sm text-muted-foreground">
          {unlockedBadges.length}/{badges.length}
        </span>
      </div>

      {/* Recent Achievement */}
      {recentBadge && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 mb-4 border border-primary/20">
          <div className="flex items-center space-x-3">
            <Badge badge={recentBadge} size="md" showTooltip={false} />
            <div className="flex-1">
              <p className="font-medium text-foreground">¡Nuevo logro!</p>
              <p className="text-sm text-primary">{recentBadge.name}</p>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(recentBadge.unlockedAt!).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Summary */}
      {badgesWithBenefits.length > 0 && (
        <div className="bg-gradient-to-r from-warning/10 to-accent/10 rounded-lg p-3 mb-4 border border-warning/20">
          <div className="flex items-center text-sm">
            <Gift className="w-4 h-4 mr-2 text-warning" />
            <span className="text-foreground font-medium">
              {badgesWithBenefits.length} {badgesWithBenefits.length === 1 ? 'logro con beneficio activo' : 'logros con beneficios activos'}
            </span>
          </div>
        </div>
      )}

      {/* Badge Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {badges.slice(0, 8).map((badge, index) => (
          <div key={badge.id} className="flex justify-center">
            <Badge badge={badge} size="sm" />
          </div>
        ))}
      </div>

      {/* Progress Stats */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Módulos completados</span>
          <span className="font-medium text-foreground">{totalModulesCompleted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Logros desbloqueados</span>
          <span className="font-medium text-primary">{unlockedBadges.length}</span>
        </div>
      </div>

      {badges.length > 8 && (
        <button className="w-full text-center text-sm text-primary hover:text-primary/80 mt-3 py-2 rounded-lg hover:bg-primary/5 transition-colors">
          Ver todos los logros ({badges.length})
        </button>
      )}
    </div>
  );
};