import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';

export const Logo: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <Link 
      to={user ? "/dashboard" : "/"} 
      className="flex items-center gap-3 group"
      data-analytics="nav_logo_click"
    >
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
          C
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold text-foreground">
            Certifica<span className="text-primary">Global</span>
          </span>
          {!isMobile && (
            <span className="text-xs text-muted-foreground font-medium">
              Desarrolla Competencias con IA + CONOCER
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};