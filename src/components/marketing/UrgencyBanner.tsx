import React, { useState, useEffect } from 'react';
import { Timer, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UrgencyBannerProps {
  type: 'limited_time' | 'limited_stock' | 'demand';
  endTime?: Date;
  stockLeft?: number;
  studentsCount?: number;
}

const UrgencyBanner: React.FC<UrgencyBannerProps> = ({
  type,
  endTime,
  stockLeft = Math.floor(Math.random() * 15) + 5, // Random between 5-20
  studentsCount = Math.floor(Math.random() * 50) + 20 // Random between 20-70
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (type === 'limited_time' && endTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = endTime.getTime();
        const distance = end - now;

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('¡Oferta expirada!');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [type, endTime]);

  const getBannerContent = () => {
    switch (type) {
      case 'limited_time':
        return {
          icon: <Timer className="w-4 h-4" />,
          text: `⏰ Oferta por tiempo limitado: ${timeLeft}`,
          bgColor: 'bg-red-100 border-red-300 text-red-800',
          pulse: true
        };
      case 'limited_stock':
        return {
          icon: <Users className="w-4 h-4" />,
          text: `🔥 Solo quedan ${stockLeft} cupos disponibles`,
          bgColor: 'bg-orange-100 border-orange-300 text-orange-800',
          pulse: stockLeft <= 10
        };
      case 'demand':
        return {
          icon: <TrendingUp className="w-4 h-4" />,
          text: `📈 ${studentsCount} personas vieron este recurso en las últimas 24h`,
          bgColor: 'bg-green-100 border-green-300 text-green-800',
          pulse: false
        };
      default:
        return null;
    }
  };

  const content = getBannerContent();
  if (!content) return null;

  return (
    <div className={`
      border rounded-lg p-3 mb-4 
      ${content.bgColor} 
      ${content.pulse ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        {content.icon}
        <span>{content.text}</span>
      </div>
    </div>
  );
};

export default UrgencyBanner;