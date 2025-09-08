import React, { useState, useEffect } from 'react';
import { Users, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocialProofWidgetProps {
  totalPurchases: number;
  rating: number;
  recentPurchases?: number;
}

const SocialProofWidget: React.FC<SocialProofWidgetProps> = ({
  totalPurchases,
  rating,
  recentPurchases = Math.floor(Math.random() * 8) + 3 // Random 3-10
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(0);

  const notifications = [
    `María G. de CDMX acaba de comprar este recurso`,
    `Carlos R. de Guadalajara se unió hace 2 minutos`,
    `Ana L. de Monterrey completó su compra`,
    `Roberto M. de Tijuana adquirió este contenido`,
    `Lucia P. de Puebla se inscribió exitosamente`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setShowNotification(true);
      setCurrentNotification(Math.floor(Math.random() * notifications.length));
      
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    }, 15000); // Show every 15 seconds

    return () => clearInterval(timer);
  }, [notifications.length]);

  return (
    <div className="space-y-4">
      {/* Social Proof Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{totalPurchases}</span>
          </div>
          <p className="text-xs text-green-600">Estudiantes certificados</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-600 fill-current" />
            <span className="text-2xl font-bold text-yellow-700">{rating.toFixed(1)}</span>
          </div>
          <p className="text-xs text-yellow-600">Calificación promedio</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Actividad reciente</span>
        </div>
        <p className="text-xs text-blue-600">
          {recentPurchases} personas compraron este recurso en las últimas 2 horas
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Contenido actualizado 2024</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Certificado oficial CONOCER</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Garantía de 7 días</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Soporte técnico incluido</span>
        </div>
      </div>

      {/* Live Notification */}
      {showNotification && (
        <div className="fixed bottom-6 left-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-left-5 z-50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {notifications[currentNotification]}
              </p>
              <p className="text-xs text-gray-500 mt-1">Hace un momento</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialProofWidget;