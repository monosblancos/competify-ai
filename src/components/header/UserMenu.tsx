import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <>
        <Button
          asChild
          variant="default"
          className="bg-gradient-primary text-white hover:shadow-glow"
          data-analytics="nav_cta_comienza_gratis"
        >
          <Link to="/diagnostico">Comienza Gratis</Link>
        </Button>
        <Button asChild variant="ghost" data-analytics="nav_login">
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild variant="outline" data-analytics="nav_register">
          <Link to="/register">Crear cuenta</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        asChild
        variant="default"
        className="bg-gradient-primary text-white"
        data-analytics="nav_inscribete"
      >
        <Link to="/checkout">Inscríbete</Link>
      </Button>
      
      {/* Notifications */}
      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* User Menu */}
      <div className="relative group">
        <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
        
        {/* User Dropdown */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm hover:bg-muted"
            data-analytics="nav_user_dashboard"
          >
            Mi Panel
          </Link>
          <Link
            to="/mis-cursos"
            className="block px-4 py-2 text-sm hover:bg-muted"
            data-analytics="nav_user_courses"
          >
            Mis Cursos
          </Link>
          <Link
            to="/mi-biblioteca"
            className="block px-4 py-2 text-sm hover:bg-muted"
            data-analytics="nav_user_library"
          >
            Mi Biblioteca
          </Link>
          <Link
            to="/afiliados"
            className="block px-4 py-2 text-sm hover:bg-muted"
            data-analytics="nav_user_affiliate"
          >
            Programa de Afiliados
          </Link>
          <hr className="my-2 border-border" />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
            data-analytics="nav_logout"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};