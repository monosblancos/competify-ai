import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-primary text-primary-foreground";
  const inactiveLinkClasses = "text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <header className="bg-card shadow-md fixed w-full z-30 top-0 border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold text-primary">
              Certifica<span className="text-foreground">Global</span> <span className="text-xs font-light text-muted-foreground">POWERED BY AI</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             <NavLink to="/analisis-cv" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Análisis CV</NavLink>
             <NavLink to="/estandares" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Estándares</NavLink>
             <NavLink to="/oportunidades" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>Oportunidades</NavLink>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="relative ml-3 group">
                  <button className="flex items-center text-sm rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="mr-2 hidden sm:block">Hola, {user.name}</span>
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-border ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Dashboard</Link>
                     <Link to="/mis-cursos" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Mis Cursos</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary">Cerrar Sesión</button>
                  </div>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className={`${inactiveLinkClasses} ${navLinkClasses}`}>Iniciar Sesión</Link>
                <Link to="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;