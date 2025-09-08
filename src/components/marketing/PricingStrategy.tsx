import React from 'react';
import { Shield, Zap, Gift, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PricingStrategyProps {
  originalPrice: number;
  discountedPrice?: number;
  discountPercent?: number;
  guaranteeDays: number;
  showValue?: boolean;
}

const PricingStrategy: React.FC<PricingStrategyProps> = ({
  originalPrice,
  discountedPrice,
  discountPercent,
  guaranteeDays,
  showValue = true
}) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100);
  };

  const finalPrice = discountedPrice || originalPrice;
  const savings = discountedPrice ? originalPrice - discountedPrice : 0;

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="text-center">
        {discountedPrice && (
          <>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge className="bg-red-500 text-white px-2 py-1">
                -{discountPercent}%
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Precio regular
            </div>
          </>
        )}
        
        <div className="text-4xl font-bold text-primary mb-2">
          {formatPrice(finalPrice)}
        </div>
        
        {discountedPrice && (
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Ahorras {formatPrice(savings)}
          </div>
        )}
        
        <div className="text-sm text-gray-600 mt-2">
          Acceso de por vida • Sin pagos recurrentes
        </div>
      </div>

      {/* Value Proposition */}
      {showValue && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Valor total del paquete</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-2">
              {formatPrice(originalPrice * 3)} <span className="text-sm font-normal">en valor</span>
            </div>
            <div className="text-sm text-blue-600">
              Incluyendo bonos, plantillas y soporte
            </div>
          </div>
        </div>
      )}

      {/* Payment Security & Guarantees */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium text-green-800">
              Garantía de satisfacción
            </div>
            <div className="text-sm text-green-600">
              {guaranteeDays} días para solicitar reembolso completo
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Gift className="w-5 h-5 text-yellow-600" />
          <div>
            <div className="font-medium text-yellow-800">
              Bonos incluidos sin costo
            </div>
            <div className="text-sm text-yellow-600">
              Plantillas, checklists y recursos adicionales
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <Star className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-medium text-purple-800">
              Soporte especializado
            </div>
            <div className="text-sm text-purple-600">
              Acceso directo con expertos CONOCER
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center pt-4 border-t">
        <div className="text-sm text-gray-600 mb-2">Pago seguro con:</div>
        <div className="flex items-center justify-center gap-2">
          <img src="/placeholder.svg" alt="Visa" className="h-6" />
          <img src="/placeholder.svg" alt="Mastercard" className="h-6" />
          <img src="/placeholder.svg" alt="PayPal" className="h-6" />
          <div className="text-xs text-gray-500 ml-2">SSL Seguro</div>
        </div>
      </div>
    </div>
  );
};

export default PricingStrategy;