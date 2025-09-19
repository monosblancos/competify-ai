import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigate } from 'react-router-dom';
import AffiliateStats from '@/components/affiliate/AffiliateStats';
import ReferralLinks from '@/components/affiliate/ReferralLinks';
import ReferralHistory from '@/components/affiliate/ReferralHistory';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AffiliatePage: React.FC = () => {
  const { user } = useAuth();
  const { 
    affiliate, 
    referrals, 
    stats, 
    loading, 
    joinAffiliateProgram, 
    generateReferralLink 
  } = useAffiliate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'pending':
        return 'Pendiente';
      case 'suspended':
        return 'Suspendido';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-8 bg-muted rounded animate-pulse w-64"></div>
            <AffiliateStats stats={stats} loading={true} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded animate-pulse"></div>
              <div className="h-96 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="card-elegant text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Programa de Afiliados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    ¡Únete a nuestro programa de afiliados!
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Gana dinero refiriendo usuarios a nuestra plataforma. Recibe comisiones 
                    por cada venta que generes y ayuda a más personas a certificarse 
                    profesionalmente.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-lg font-bold text-primary">10%</span>
                    </div>
                    <h4 className="font-semibold">Comisión Atractiva</h4>
                    <p className="text-sm text-muted-foreground">
                      Gana hasta 10% de comisión por cada venta
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">Audiencia Amplia</h4>
                    <p className="text-sm text-muted-foreground">
                      Productos dirigidos a profesionales de todos los sectores
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">Pagos Puntuales</h4>
                    <p className="text-sm text-muted-foreground">
                      Recibe tus comisiones mensualmente
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={joinAffiliateProgram}
                    size="lg"
                    className="text-lg px-8"
                  >
                    Unirse al Programa de Afiliados
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Tu solicitud será revisada en un plazo de 24-48 horas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Panel de Afiliado
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Estado:</span>
                <Badge className={getStatusColor(affiliate.status)}>
                  {getStatusIcon(affiliate.status)}
                  {getStatusLabel(affiliate.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Notice */}
          {affiliate.status === 'pending' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">
                      Solicitud en Revisión
                    </h3>
                    <p className="text-yellow-700">
                      Tu solicitud para unirte al programa de afiliados está siendo revisada. 
                      Te notificaremos cuando sea aprobada.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <AffiliateStats stats={stats} />

          {/* Main Content */}
          {affiliate.status === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReferralLinks 
                generateReferralLink={generateReferralLink}
                affiliateCode={affiliate.affiliate_code}
              />
              <ReferralHistory referrals={referrals} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;