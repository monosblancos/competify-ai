import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    const fetchSuggestions = async (q) => {
      if (!q.trim()) return [];
      
      try {
        const { data, error } = await supabase
          .from("standards")
          .select('code, title')
          .or(`title.ilike.%${q}%,code.ilike.%${q}%`)
          .limit(8);
        
        if (error) return [];
        return data?.map(r => ({ code: r.code, title: r.title })) || [];
      } catch {
        return [];
      }
    };

    (async () => {
      const res = await fetchSuggestions(query.trim());
      if (alive) setSuggestions(res);
    })();
    return () => { alive = false; };
  }, [query]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (suggestions?.[0]?.code) {
      navigate(`/estandares/${suggestions[0].code}`);
    } else {
      navigate(`/estandares?q=${encodeURIComponent(q)}`);
    }
  };

  const navBg = scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/90 backdrop-blur-sm";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b border-border ${navBg}`}>
      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 group-hover:scale-95 transition-transform" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-foreground">Certifica<span className="text-primary">Global</span></span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">POWERED BY AI</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl">
            <form onSubmit={handleSubmitSearch} className="relative w-full" role="search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-2.5 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Busca estándares por código o título..."
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Buscar
              </button>

              {/* Search Suggestions */}
              {query && suggestions?.length > 0 && (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                  <ul>
                    {suggestions.map((sug, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            navigate(`/estandares/${sug.code}`);
                            setQuery("");
                          }}
                          className="flex w-full items-start gap-3 px-4 py-3 hover:bg-muted text-left"
                        >
                          <span className="mt-0.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {sug.code}
                          </span>
                          <span className="text-sm text-foreground">{sug.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {!user && (
              <>
                <Link 
                  to="/analisis-cv" 
                  className="hidden sm:inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Comienza Gratis
                </Link>
                <Link 
                  to="/login" 
                  className="hidden sm:inline-flex px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="hidden sm:inline-flex rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}

            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm rounded-xl px-3 py-2 text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors">
                  <span className="hidden sm:block">Hola, {user.name}</span>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background shadow-xl py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Dashboard
                  </Link>
                  <Link to="/mis-cursos" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Mis Cursos
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="hidden md:block border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex h-12 items-center gap-6 text-sm text-muted-foreground">
            {/* Free Diagnosis */}
            <li onMouseEnter={() => setOpenMenu("diagnostico")} onMouseLeave={() => setOpenMenu(null)} className="relative">
              <NavLink 
                to="/analisis-cv" 
                className={({isActive}) => `hover:text-foreground transition-colors ${isActive ? 'text-primary font-medium' : ''}`}
              >
                Análisis CV (Gratis)
              </NavLink>
              {openMenu === "diagnostico" && (
                <div className="absolute left-0 top-full z-40 w-80 rounded-xl border border-border bg-background p-4 shadow-xl">
                  <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Empieza aquí · Gratis</div>
                  <div className="space-y-1">
                    <Link to="/analisis-cv" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Análisis de CV con IA
                    </Link>
                    <Link to="/onboarding" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Configuración de Perfil
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Standards */}
            <li onMouseEnter={() => setOpenMenu("estandares")} onMouseLeave={() => setOpenMenu(null)} className="relative">
              <NavLink 
                to="/estandares" 
                className={({isActive}) => `hover:text-foreground transition-colors ${isActive ? 'text-primary font-medium' : ''}`}
              >
                Estándares
              </NavLink>
              {openMenu === "estandares" && (
                <div className="absolute left-0 top-full z-40 w-72 rounded-xl border border-border bg-background p-4 shadow-xl">
                  <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Exploración</div>
                  <div className="space-y-1">
                    <Link to="/estandares" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Ver todos los estándares
                    </Link>
                    <Link to="/estandares?category=core" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Estándares principales
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Opportunities */}
            <li onMouseEnter={() => setOpenMenu("oportunidades")} onMouseLeave={() => setOpenMenu(null)} className="relative">
              <NavLink 
                to="/oportunidades" 
                className={({isActive}) => `hover:text-foreground transition-colors ${isActive ? 'text-primary font-medium' : ''}`}
              >
                Oportunidades
              </NavLink>
              {openMenu === "oportunidades" && (
                <div className="absolute left-0 top-full z-40 w-80 rounded-xl border border-border bg-background p-4 shadow-xl">
                  <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Empleo</div>
                  <div className="space-y-1">
                    <Link to="/oportunidades" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Vacantes disponibles
                    </Link>
                    <Link to="/oportunidades?filter=remote" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                      Trabajo remoto
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {user && (
              <li onMouseEnter={() => setOpenMenu("cursos")} onMouseLeave={() => setOpenMenu(null)} className="relative">
                <NavLink 
                  to="/mis-cursos" 
                  className={({isActive}) => `hover:text-foreground transition-colors ${isActive ? 'text-primary font-medium' : ''}`}
                >
                  Mis Cursos
                </NavLink>
                {openMenu === "cursos" && (
                  <div className="absolute left-0 top-full z-40 w-72 rounded-xl border border-border bg-background p-4 shadow-xl">
                    <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Mi Progreso</div>
                    <div className="space-y-1">
                      <Link to="/mis-cursos" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                        Cursos activos
                      </Link>
                      <Link to="/dashboard" className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-80 overflow-y-auto bg-background border-l border-border p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground">Menú</div>
              <button 
                onClick={() => setMobileOpen(false)} 
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" 
                aria-label="Cerrar menú"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSubmitSearch} className="relative mb-6" role="search">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Buscar estándares…"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                Buscar
              </button>
            </form>

            <div className="space-y-4">
              {!user && (
                <div className="space-y-2">
                  <Link to="/analisis-cv" className="block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground" onClick={() => setMobileOpen(false)}>
                    Comienza Gratis
                  </Link>
                  <div className="flex justify-center gap-4 text-sm">
                    <Link to="/login" className="text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Iniciar Sesión</Link>
                    <span className="text-border">·</span>
                    <Link to="/register" className="text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Registrarse</Link>
                  </div>
                </div>
              )}

              <MobileSection title="Diagnóstico (Gratis)" links={[
                { label: "Análisis de CV", href: "/analisis-cv" },
                { label: "Configuración de Perfil", href: "/onboarding" }
              ]} onClose={() => setMobileOpen(false)} />
              
              <MobileSection title="Estándares" links={[
                { label: "Ver todos", href: "/estandares" },
                { label: "Principales", href: "/estandares?category=core" }
              ]} onClose={() => setMobileOpen(false)} />
              
              <MobileSection title="Oportunidades" links={[
                { label: "Vacantes", href: "/oportunidades" },
                { label: "Trabajo remoto", href: "/oportunidades?filter=remote" }
              ]} onClose={() => setMobileOpen(false)} />

              {user && (
                <MobileSection title="Mi Cuenta" links={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Mis Cursos", href: "/mis-cursos" }
                ]} onClose={() => setMobileOpen(false)} />
              )}

              {user && (
                <div className="border-t border-border pt-4">
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="block w-full rounded-lg bg-muted px-4 py-2 text-left text-sm text-foreground hover:bg-muted/80"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Mobile Section Component
function MobileSection({ title, links, onClose }) {
  return (
    <section className="border-t border-border pt-3">
      <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{title}</h4>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              to={link.href} 
              className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={onClose}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Header;