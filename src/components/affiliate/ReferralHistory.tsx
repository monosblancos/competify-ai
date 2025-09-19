import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, DollarSign } from 'lucide-react';
import { AffiliateReferral } from '@/types/affiliate';

interface ReferralHistoryProps {
  referrals: AffiliateReferral[];
  loading?: boolean;
}

const ReferralHistory: React.FC<ReferralHistoryProps> = ({ referrals, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historial de Referidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                  <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Historial de Referidos
          <Badge variant="secondary" className="ml-auto">
            {referrals.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No tienes referidos aún
            </h3>
            <p className="text-muted-foreground">
              Comparte tus enlaces de referido para empezar a ganar comisiones
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      Código: {referral.referral_code}
                    </span>
                    {referral.order_id && (
                      <Badge variant="outline" className="text-xs">
                        Compra realizada
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(referral.created_at)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-foreground">
                      {formatCurrency(referral.commission_cents)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(referral.status)}>
                    {getStatusLabel(referral.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;