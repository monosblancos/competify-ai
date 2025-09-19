import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReferralLinksProps {
  generateReferralLink: (productId?: string) => string;
  affiliateCode: string;
}

const ReferralLinks: React.FC<ReferralLinksProps> = ({ 
  generateReferralLink, 
  affiliateCode 
}) => {
  const [customProductId, setCustomProductId] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "¡Copiado!",
        description: "El enlace se ha copiado al portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    }
  };

  const shareLink = async (link: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: link,
        });
      } catch (error) {
        copyToClipboard(link);
      }
    } else {
      copyToClipboard(link);
    }
  };

  const generalLink = generateReferralLink();
  const customLink = customProductId ? generateReferralLink(customProductId) : '';

  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Enlaces de Referido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Código de Afiliado */}
        <div className="space-y-2">
          <Label htmlFor="affiliate-code">Tu Código de Afiliado</Label>
          <div className="flex gap-2">
            <Input
              id="affiliate-code"
              value={affiliateCode}
              readOnly
              className="font-mono"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(affiliateCode)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Enlace General */}
        <div className="space-y-2">
          <Label htmlFor="general-link">Enlace General de Referido</Label>
          <div className="flex gap-2">
            <Input
              id="general-link"
              value={generalLink}
              readOnly
              className="text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(generalLink)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => shareLink(generalLink, 'Únete a nuestra plataforma')}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Comparte este enlace para referir usuarios a la plataforma
          </p>
        </div>

        {/* Enlace Personalizado */}
        <div className="space-y-2">
          <Label htmlFor="custom-product">Enlace para Producto Específico</Label>
          <div className="flex gap-2">
            <Input
              id="custom-product"
              placeholder="ID del producto (opcional)"
              value={customProductId}
              onChange={(e) => setCustomProductId(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!customLink}
              onClick={() => customLink && copyToClipboard(customLink)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {customLink && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm break-all">{customLink}</p>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">📋 Cómo usar tus enlaces</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Comparte tu enlace en redes sociales, blogs o emails</li>
            <li>• Cuando alguien se registre usando tu enlace, serán tu referido</li>
            <li>• Ganarás comisión por cada compra que realicen</li>
            <li>• Los pagos se procesan mensualmente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralLinks;