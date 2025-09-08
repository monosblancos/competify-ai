import React, { useState, useEffect } from 'react';
import { X, Timer, Gift, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExitIntentOfferProps {
  productId: string;
  productTitle: string;
  originalPrice: number;
  onClose: () => void;
  onAccept: (couponCode: string) => void;
}

const ExitIntentOffer: React.FC<ExitIntentOfferProps> = ({
  productId,
  productTitle,
  originalPrice,
  onClose,
  onAccept
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const { toast } = useToast();

  const discountPercent = 25;
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100);
  };

  const handleAcceptOffer = async () => {
    try {
      // Generate special coupon
      const couponCode = `EXIT${discountPercent}${Date.now().toString().slice(-4)}`;
      
      // Track the exit intent interaction
      await supabase
        .from('resource_offer_interactions')
        .insert({
          action: 'exit_intent_accepted',
          coupon_generated: couponCode,
          session_id: `exit_${Date.now()}`
        });

      // Apply the offer
      onAccept(couponCode);
      setIsOpen(false);
      
      toast({
        title: "¡Oferta aplicada!",
        description: `Descuento del ${discountPercent}% aplicado automáticamente.`,
      });
    } catch (error) {
      console.error('Error accepting exit offer:', error);
      toast({
        title: "Error",
        description: "No se pudo aplicar la oferta. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleClose = async () => {
    try {
      await supabase
        .from('resource_offer_interactions')
        .insert({
          action: 'exit_intent_dismissed',
          session_id: `exit_${Date.now()}`
        });
    } catch (error) {
      console.error('Error tracking exit intent dismissal:', error);
    }
    
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-red-600" />
              <DialogTitle className="text-red-800">¡Espera! Oferta Especial</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Urgency Timer */}
          <div className="text-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-red-700 mt-1">Esta oferta expira pronto</p>
          </div>

          {/* Offer Details */}
          <div className="text-center space-y-2">
            <Badge className="bg-red-600 text-white px-3 py-1 text-sm">
              <Gift className="w-4 h-4 mr-1" />
              OFERTA EXCLUSIVA
            </Badge>
            <h3 className="font-bold text-lg text-gray-800">
              ¡{discountPercent}% de descuento en {productTitle}!
            </h3>
            <p className="text-gray-600 text-sm">
              No pierdas esta oportunidad única de acceder al contenido al mejor precio.
            </p>
          </div>

          {/* Price Comparison */}
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </p>
                <p className="text-xs text-gray-400">Precio regular</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(discountedPrice)}
                </p>
                <p className="text-xs text-green-600">Con descuento</p>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                Ahorras {formatPrice(originalPrice - discountedPrice)}
              </Badge>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">+127 estudiantes satisfechos</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              "Excelente contenido, muy bien estructurado" - María G.
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-3">
            <Button
              onClick={handleAcceptOffer}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
              size="lg"
            >
              ¡SÍ! Quiero el {discountPercent}% de descuento
            </Button>
            
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                No gracias, prefiero pagar el precio completo
              </Button>
            </div>
          </div>

          {/* Guarantee */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🛡️ Garantía de 7 días • 📧 Soporte completo
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentOffer;