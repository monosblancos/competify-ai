import React from 'react';
import { Badge as BadgeType } from '../../types';
import { Trophy, Zap, Target, Star, Award, Clock, Gift } from 'lucide-react';

interface BadgeProps {
  badge: BadgeType & { benefits?: any };
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  showBenefits?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ badge, size = 'md', showTooltip = true, showBenefits = false }) => {
  const hasBenefits = badge.benefits && badge.unlockedAt && (
    badge.benefits.discount_pct > 0 || 
    badge.benefits.premium_access_days > 0 ||
    (badge.benefits.special_features && badge.benefits.special_features.length > 0)
  );

  const getBenefitText = () => {
    if (!badge.benefits) return '';
    const benefits = [];
    if (badge.benefits.discount_pct > 0) {
      benefits.push(`${badge.benefits.discount_pct}% descuento`);
    }
    if (badge.benefits.premium_access_days > 0) {
      benefits.push(`${badge.benefits.premium_access_days} días premium`);
    }
    if (badge.benefits.special_features && badge.benefits.special_features.length > 0) {
      benefits.push('Funciones especiales');
    }
    return benefits.join(' + ');
  };
  const getIcon = () => {
    switch (badge.icon) {
      case 'trophy': return Trophy;
      case 'zap': return Zap;
      case 'target': return Target;
      case 'star': return Star;
      case 'award': return Award;
      case 'clock': return Clock;
      default: return Trophy;
    }
  };

  const Icon = getIcon();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const rarityColors = {
    common: 'from-secondary to-muted',
    rare: 'from-primary to-primary-light',
    epic: 'from-accent to-warning',
    legendary: 'from-warning to-accent'
  };

  const glowClasses = {
    common: '',
    rare: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
    epic: 'shadow-[0_0_25px_hsl(var(--accent)/0.4)]',
    legendary: 'shadow-[0_0_30px_hsl(var(--warning)/0.5)] animate-pulse'
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${sizeClasses[size]} ${glowClasses[badge.rarity]}`}
        title={showTooltip ? `${badge.name}: ${badge.description}${hasBenefits ? `\n🎁 ${getBenefitText()}` : ''}` : undefined}
      >
        <div className={`
          w-full h-full rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]}
          flex items-center justify-center border-2 border-border
          ${badge.unlockedAt ? 'opacity-100' : 'opacity-30 grayscale'}
          transition-all duration-300 hover:scale-110
        `}>
          <Icon className={`${iconSizes[size]} text-white drop-shadow-sm`} />
        </div>
        
        {badge.unlockedAt && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background">
            <div className="w-full h-full rounded-full bg-success animate-ping opacity-50"></div>
          </div>
        )}

        {hasBenefits && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-warning rounded-full border-2 border-background flex items-center justify-center">
            <Gift className="w-3 h-3 text-warning-foreground" />
          </div>
        )}
      </div>

      {showBenefits && hasBenefits && (
        <div className="mt-2 text-xs text-center">
          <div className="px-2 py-1 bg-warning/10 text-warning-foreground rounded-md border border-warning/20">
            {getBenefitText()}
          </div>
        </div>
      )}
    </div>
  );
};