import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NetworkingHub } from '@/components/community/NetworkingHub';

const NetworkingPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Acceso requerido
          </h1>
          <p className="text-muted-foreground">
            Debes iniciar sesión para acceder al networking profesional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <NetworkingHub />
      </div>
    </div>
  );
};

export default NetworkingPage;