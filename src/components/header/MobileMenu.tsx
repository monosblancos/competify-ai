import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useStandardsSuggestions } from '../../hooks/useStandardsSuggestions';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { suggestions, isLoading } = useStandardsSuggestions(query);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSubmitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    const standardCodeMatch = q.match(/^EC\d{4}$/i);
    if (standardCodeMatch) {
      navigate(`/estandares/${standardCodeMatch[0].toUpperCase()}`);
      setQuery("");
      onClose();
      return;
    }

    if (suggestions.length > 0) {
      navigate(`/estandares/${suggestions[0].code}`);
    } else {
      navigate(`/estandares?q=${encodeURIComponent(q)}`);
    }
    setQuery("");
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onClose();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border shadow-2xl z-50 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold">Menú</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-border">
            <form onSubmit={handleSubmitSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar estándar..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              
              {query && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.code}
                      onClick={() => {
                        navigate(`/estandares/${suggestion.code}`);
                        setQuery("");
                        onClose();
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-left text-sm"
                    >
                      <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                        {suggestion.code}
                      </span>
                      <span>{suggestion.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-b border-border">
            {!user ? (
              <div className="space-y-2">
                <Button asChild className="w-full bg-gradient-primary">
                  <Link to="/diagnostico" onClick={onClose}>
                    Comienza Gratis
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/login" onClick={onClose}>Entrar</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/register" onClick={onClose}>Registro</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">¡Hola, {user.name}!</p>
              </div>
            )}
          </div>

          {/* Navigation Content */}
          <div className="flex-1 p-4 space-y-6">
            {/* Diagnóstico Section */}
            <div>
              <button
                onClick={() => toggleSection('diagnostico')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-xs font-semibold uppercase text-primary mb-2">Diagnóstico</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSection === 'diagnostico' ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === 'diagnostico' && (
                <div className="space-y-1 mt-2">
                  <Link
                    to="/diagnostico"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Análisis de CV con IA
                  </Link>
                  <Link
                    to="/diagnostico/chatbot"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Chatbot de exploración
                  </Link>
                </div>
              )}
            </div>

            {/* Certificaciones Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-primary mb-2">Certificaciones</h3>
              <div className="space-y-1">
                <Link
                  to="/estandares"
                  className="block py-2 text-sm hover:text-primary"
                  onClick={onClose}
                >
                  Explorar estándares
                </Link>
                <Link
                  to="/estandares/EC0217"
                  className="block py-2 text-sm hover:text-primary"
                  onClick={onClose}
                >
                  EC0217 - Impartición de cursos
                </Link>
                <Link
                  to="/estandares/EC0301"
                  className="block py-2 text-sm hover:text-primary"
                  onClick={onClose}
                >
                  EC0301 - Diseño curricular
                </Link>
              </div>
            </div>

            {user && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-primary mb-2">Comunidad</h3>
                <div className="space-y-1">
                  <Link
                    to="/comunidad"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Feed de la comunidad
                  </Link>
                  <Link
                    to="/networking"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Networking profesional
                  </Link>
                </div>
              </div>
            )}

            {/* User Account Section */}
            {user && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-primary mb-2">Mi Cuenta</h3>
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Mi Panel
                  </Link>
                  <Link
                    to="/mis-cursos"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Mis Cursos
                  </Link>
                  <Link
                    to="/mi-biblioteca"
                    className="block py-2 text-sm hover:text-primary"
                    onClick={onClose}
                  >
                    Mi Biblioteca
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm hover:text-primary"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};