import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, ChevronDown, Menu, X, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { MegaMenu } from './MegaMenu';
import { useStandardsSuggestions } from '../hooks/useStandardsSuggestions';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { suggestions, isLoading } = useStandardsSuggestions(query);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const optimizedPrompt = `Prompt optimizado para Claude con explicación de la Metodología Certifica Global
Evalúa el siguiente capítulo con base en la Metodología Certifica Global, un enfoque integral de transformación profesional basado en 9 pasos secuenciales y 8 dimensiones clave.
________________________________________
🔍 Metodología Certifica Global – Marco de evaluación
Certifica Global es un sistema diseñado para transformar la experiencia laboral en poder profesional validado, a través de una hoja de ruta en 9 pasos, acompañada por 8 dimensiones transversales que garantizan impacto real, ético y sostenible.
🧭 Los 9 pasos estratégicos son:
1. Activación de Identidad Profesional
2. Definición del Propósito Transformador
3. Diseño Estratégico del Aprendizaje
4. Activadores de Aprendizaje y Reflexión
5. Fortalecimiento del Portafolio de Evidencias
6. Simulación de Evaluación + Retroalimentación
7. Evaluación Formal y Logro de Certificación
8. Visibilización y Posicionamiento del Perfil Profesional
9. Expansión de Impacto y Liderazgo Multiplicador
🔷 Las 8 dimensiones a evaluar en cada capítulo son:
1️⃣ Identitaria: ¿Conecta con la historia, dignidad y autenticidad del lector?
2️⃣ Transformadora: ¿Genera cambios reales y deseables en la vida del lector?
3️⃣ Estratégica: ¿Se articula como parte de un proceso secuenciado?
4️⃣ Técnica: ¿Incorpora herramientas, conceptos y datos útiles o verificables?
5️⃣ Emocional-reflexiva: ¿Activa la introspección y el compromiso interno?
6️⃣ Transferencia laboral: ¿Tiene impacto real en el mundo del trabajo?
7️⃣ Ética y social: ¿Contribuye a un cambio justo, colectivo o sostenible?
8️⃣ Evaluación integral: ¿Permite al lector autoevaluar, seguir su progreso o tomar decisiones informadas?
________________________________________
🧠 Tareas para Claude
A partir del texto que te daré a continuación:
1. Evalúa si cada dimensión está presente y con qué fuerza (puntuación del 1 al 5).
2. Identifica qué pasos de la metodología se hacen explícitos o implícitos.
3. Indica si el lector entiende que su transformación es producto de un proceso estructurado y replicable, no solo inspiración.
4. Sugiere cómo reforzar la presencia metodológica sin sacrificar el estilo motivador o narrativo del capítulo.
5. Confirma si Certifica Global queda posicionado como sistema profesional, estratégico y ético.
________________________________________
Finaliza tu respuesta con:
• 📊 Una tabla resumen con puntuación 1 a 5 por dimensión.
• ✍️ Un listado claro de recomendaciones.
• 🚩 Alertas sobre posibles áreas débiles del capítulo.`;
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Check if it's an exact standard code
    const standardCodeMatch = q.match(/^EC\d{4}$/i);
    if (standardCodeMatch) {
      navigate(`/estandares/${standardCodeMatch[0].toUpperCase()}`);
      setQuery("");
      return;
    }

    // Otherwise search by title
    if (suggestions.length > 0) {
      navigate(`/estandares/${suggestions[0].code}`);
    } else {
      navigate(`/estandares?q=${encodeURIComponent(q)}`);
    }
    setQuery("");
  };

  const handleSuggestionClick = (code: string) => {
    navigate(`/estandares/${code}`);
    setQuery("");
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const headerClasses = scrolled
    ? "bg-background/95 backdrop-blur-md shadow-lg border-border/50"
    : "bg-background/80 backdrop-blur-sm border-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b ${headerClasses}`}>
      {/* Main Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Search */}
          {!isMobile && (
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSubmitSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busca entre 1,845 estándares (código o título)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/70 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    data-analytics="nav_search_focus"
                  />
                </div>

                {/* Search Suggestions */}
                {query && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Buscando...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="py-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={suggestion.code}
                            onClick={() => handleSuggestionClick(suggestion.code)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted text-left"
                            data-analytics="nav_search_suggestion_click"
                          >
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                              {suggestion.code}
                            </span>
                            <span className="text-sm text-foreground">{suggestion.title}</span>
                          </button>
                        ))}
                      </div>
                    ) : query.length > 2 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No se encontraron resultados
                      </div>
                    ) : null}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              {!user ? (
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
              ) : (
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
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-analytics="nav_mobile_toggle"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      {!isMobile && (
        <nav className="border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-12 items-center gap-8">
              {/* Diagnóstico */}
              <MegaMenu
                trigger="Diagnóstico"
                isActive={activeMenu === "diagnostico"}
                onToggle={() => setActiveMenu(activeMenu === "diagnostico" ? null : "diagnostico")}
                badge="Gratis"
                analytics="nav_diagnostico_click"
              >
                <div className="p-6 w-80">
                  <div className="mb-3 text-xs font-semibold uppercase text-primary">
                    Empieza aquí · Gratis
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/diagnostico"
                      className="block px-3 py-2 rounded-lg hover:bg-muted text-sm"
                      data-analytics="nav_diagnostico_analisis"
                    >
                      <div className="font-medium">Análisis de CV</div>
                      <div className="text-xs text-muted-foreground">Con IA avanzada</div>
                    </Link>
                    <Link
                      to="/diagnostico/chatbot"
                      className="block px-3 py-2 rounded-lg hover:bg-muted text-sm"
                      data-analytics="nav_diagnostico_chatbot"
                    >
                      <div className="font-medium">Chatbot de exploración</div>
                      <div className="text-xs text-muted-foreground">Encuentra tu ruta</div>
                    </Link>
                  </div>
                </div>
              </MegaMenu>

              {/* Certificaciones */}
              <MegaMenu
                trigger="Certificaciones"
                isActive={activeMenu === "certificaciones"}
                onToggle={() => setActiveMenu(activeMenu === "certificaciones" ? null : "certificaciones")}
                analytics="nav_cert_click"
              >
                <div className="p-6 w-[800px]">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Columna 1: Core Standards */}
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-primary flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Core Standards · +Empleabilidad
                      </div>
                      <div className="space-y-2">
                        {[
                          { code: "EC0217", title: "Impartición de cursos", benefit: "Formación corporativa", hot: true, students: "2,847" },
                          { code: "EC0301", title: "Diseño curricular", benefit: "Educación digital", hot: false, students: "1,923" },
                          { code: "EC0366", title: "Desarrollo de software", benefit: "Tech skills", hot: true, students: "3,241" },
                          { code: "EC0076", title: "Evaluación de competencias", benefit: "RRHH avanzado", hot: false, students: "1,456" }
                        ].map((standard) => (
                          <div key={standard.code} className="relative p-3 rounded-lg border border-border hover:bg-muted group transition-all">
                            {standard.hot && (
                              <div className="absolute -top-1 -right-1 z-10">
                                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🔥 HOT</div>
                              </div>
                            )}
                            
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold bg-primary text-primary-foreground px-2 py-1 rounded text-center min-w-[60px]">{standard.code}</span>
                                  <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{standard.benefit}</div>
                                </div>
                                <div className="text-xs text-foreground font-medium mb-2">{standard.title}</div>
                                
                                <div className="flex items-center text-[10px] text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                    {standard.students} estudiantes activos
                                  </span>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Link to={`/checkout?curso=${standard.code}`} className="text-[11px] bg-gradient-primary text-primary-foreground px-3 py-1 rounded-md font-medium hover:shadow-sm group-hover:scale-105 transition-transform">
                                    Inscríbete
                                  </Link>
                                  <Link to={`/estandares/${standard.code}`} className="text-[11px] border border-border text-muted-foreground px-3 py-1 rounded-md hover:bg-muted" onClick={(e)=> e.stopPropagation()}>
                                    Ver detalles
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Columna 2: Lead Magnet Kit */}
                    <div className="rounded-xl border border-purple-200 overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
                      <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🎁</span>
                          <div>
                            <div className="text-sm font-bold">Kit Certificación GRATIS</div>
                            <div className="text-xs opacity-90">Valor: $2,490 MXN</div>
                          </div>
                        </div>
                        <div className="text-xs mb-3 opacity-95">
                          ✅ Guía 9 pasos · ✅ Plantillas · ✅ Autoevaluación
                        </div>
                        <Link to="/recursos?tipo=toolkit" className="inline-block w-full text-center px-3 py-2 rounded-md bg-white text-purple-700 text-xs font-bold hover:bg-gray-50 transition-colors">
                          📥 Descargar Ahora
                        </Link>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-center mb-3">
                          <div className="text-orange-600 font-semibold">⚡ Solo primeros 500 profesionales</div>
                          <div className="text-muted-foreground">347 kits restantes</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {[
                            '📖 Guía completa 7 pasos',
                            '📋 Plantillas editables',
                            '🎯 Test autoevaluación',
                            '💰 Calculadora ROI',
                            '📈 Plan de carrera',
                            '🎥 3 masterclasses'
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Columna 3: Metodología + Prompt */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-border overflow-hidden bg-card">
                        <div className="p-3 bg-gradient-primary text-primary-foreground">
                          <div className="text-xs font-bold tracking-wide">Metodología Certifica Global™</div>
                          <div className="text-[10px] opacity-90 mt-1">9 Pasos + 8 Dimensiones</div>
                        </div>
                        <div className="p-3">
                          <div className="grid grid-cols-1 gap-1 text-[10px] text-muted-foreground mb-3">
                            {[
                              '1) Activación Identidad',
                              '2) Propósito Transformador',
                              '3) Diseño Aprendizaje',
                              '4) Activadores & Reflexión',
                              '5) Portafolio Evidencias'
                            ].map((step, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary"></span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={copyPrompt} className="w-full px-2 py-2 rounded-md bg-muted text-muted-foreground text-[10px] font-medium hover:bg-muted/80 transition-colors">
                            {copiedPrompt ? '✅ ¡Prompt copiado!' : '📋 Copiar prompt metodología'}
                          </button>
                        </div>
                      </div>

                      {/* Social Proof Rápido */}
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <div className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
                          <span>⭐⭐⭐⭐⭐</span>
                          <span>4.9/5</span>
                        </div>
                        <div className="text-[10px] text-green-700 mb-2">
                          "Logré mi certificación en solo 3 semanas. El proceso es muy claro y las plantillas funcionan perfecto."
                        </div>
                        <div className="text-[9px] text-green-600 font-medium">
                          — María González, HR Manager
                        </div>
                      </div>

                      {/* Urgencia */}
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <div className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1">
                          <span>⏰</span>
                          <span>Oferta limitada</span>
                        </div>
                        <div className="text-[10px] text-orange-700 mb-2">
                          25% OFF termina en 04:31:56
                        </div>
                        <div className="text-[9px] text-orange-600">
                          Código: <span className="font-bold">CERTIFICACION25</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MegaMenu>

              {/* Programas */}
              <MegaMenu
                trigger="Programas"
                isActive={activeMenu === "programas"}
                onToggle={() => setActiveMenu(activeMenu === "programas" ? null : "programas")}
                badge="Másters"
                analytics="nav_programas_click"
              >
                  <div className="p-6 w-[600px]">
                    <div className="mb-4">
                      <div className="text-xs font-semibold uppercase text-primary mb-3">
                        Formación aplicada con IA · Precios en MXN · Financiamiento disponible
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "Máster IA", desc: "Domina la Inteligencia Artificial aplicada", price: "$49,900 MXN", originalPrice: "$69,900" },
                        { name: "Máster Marketing Digital", desc: "Estrategias digitales avanzadas", price: "$39,900 MXN", originalPrice: "$55,900" },
                        { name: "Máster Funnel de Ventas", desc: "Optimiza tus conversiones", price: "$33,900 MXN", originalPrice: "$47,900" },
                        { name: "Máster SEO", desc: "Posicionamiento web profesional", price: "$29,900 MXN", originalPrice: "$43,900" },
                        { name: "Máster SEM", desc: "Publicidad digital rentable", price: "$25,900 MXN", originalPrice: "$37,900" },
                        { name: "Máster Data", desc: "Análisis de datos estratégicos", price: "$43,900 MXN", originalPrice: "$59,900" }
                      ].map((program) => (
                        <Link
                          key={program.name}
                          to={`/programas/${program.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="p-3 rounded-lg border border-border hover:bg-muted group"
                          data-analytics={`nav_programa_${program.name.toLowerCase().replace(/\s+/g, '_')}`}
                        >
                          <div className="text-sm font-semibold">{program.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{program.desc}</div>
                          <div className="text-xs text-primary font-medium mt-2 flex items-center justify-between">
                            <span>{program.price}</span>
                            <span className="group-hover:underline">Ver programa →</span>
                          </div>
                        </Link>
                      ))}
                   </div>
                   <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                     <div className="flex items-center justify-between">
                       <div>
                         <div className="text-sm font-semibold text-primary">Explora todos los programas</div>
                         <div className="text-xs text-muted-foreground">Másters intensivos con certificación</div>
                       </div>
                       <Link
                         to="/programas"
                         className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:shadow-sm transition-all"
                         data-analytics="nav_programas_ver_todos"
                       >
                         Ver Todo →
                       </Link>
                     </div>
                   </div>
                 </div>
              </MegaMenu>

              {/* Estándares */}
              <MegaMenu
                trigger="Estándares"
                isActive={activeMenu === "estandares"}
                onToggle={() => setActiveMenu(activeMenu === "estandares" ? null : "estandares")}
                analytics="nav_estandares_click"
              >
                <div className="p-6 w-[900px]">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Columna 1: Búsqueda rápida */}
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-primary">
                        Búsqueda rápida
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="text-sm font-medium mb-1">Por código</div>
                          <div className="text-xs text-muted-foreground">EC0217, EC0301, etc.</div>
                        </div>
                        <div className="p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="text-sm font-medium mb-1">Por categoría</div>
                          <div className="text-xs text-muted-foreground">Educación, TI, RRHH</div>
                        </div>
                        <Link
                          to="/estandares"
                          className="block w-full p-2 text-center text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Explorar todos
                        </Link>
                      </div>
                    </div>

                    {/* Columna 2: Categorías principales */}
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-primary">
                        Categorías principales
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "Educación y Formación", count: "487", popular: true },
                          { name: "Tecnologías de la Información", count: "324", popular: true },
                          { name: "Recursos Humanos", count: "256", popular: false },
                          { name: "Evaluación y Certificación", count: "189", popular: false },
                          { name: "Consultoría", count: "143", popular: false }
                        ].map((category) => (
                          <Link
                            key={category.name}
                            to={`/estandares?categoria=${encodeURIComponent(category.name)}`}
                            className="block p-2 rounded-lg hover:bg-muted text-sm transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{category.name}</div>
                              {category.popular && (
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full">Popular</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{category.count} estándares</div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Columna 3: Estándares más demandados */}
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-primary flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Más demandados
                      </div>
                      <div className="space-y-2">
                        {[
                          { code: "EC0217", title: "Impartición de cursos", demand: "🔥 Alta", students: "2,847" },
                          { code: "EC0366", title: "Desarrollo de software", demand: "🔥 Alta", students: "3,241" },
                          { code: "EC0301", title: "Diseño curricular", demand: "📈 Creciente", students: "1,923" },
                          { code: "EC0076", title: "Evaluación de competencias", demand: "📊 Estable", students: "1,456" }
                        ].map((standard) => (
                          <Link
                            key={standard.code}
                            to={`/estandares/${standard.code}`}
                            className="block p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">{standard.code}</span>
                              <span className="text-[10px] text-muted-foreground">{standard.demand}</span>
                            </div>
                            <div className="text-xs font-medium text-foreground mb-1">{standard.title}</div>
                            <div className="text-[10px] text-muted-foreground">{standard.students} estudiantes activos</div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Columna 4: Herramientas y recursos */}
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase text-primary">
                        Herramientas
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={copyPrompt}
                          className="w-full p-3 rounded-lg border border-border hover:bg-muted text-left transition-colors"
                        >
                          <div className="text-sm font-medium mb-1 flex items-center gap-2">
                            Prompt para Claude
                            {copiedPrompt && <span className="text-green-500 text-xs">✓ Copiado</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">Análisis con IA especializada</div>
                        </button>
                        
                        <Link
                          to="/diagnostico"
                          className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                        >
                          <div className="text-sm font-medium mb-1">Diagnóstico CV</div>
                          <div className="text-xs text-muted-foreground">Encuentra tu ruta de certificación</div>
                        </Link>

                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium mb-1">📊 Base de datos</div>
                          <div className="text-xs text-muted-foreground">1,845 estándares CONOCER actualizados</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MegaMenu>

              <NavLink
                to="/empresa"
                className={({ isActive }) =>
                  `text-sm hover:text-foreground transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`
                }
                data-analytics="nav_empresas_click"
              >
                Empresas
              </NavLink>

              {/* Recursos */}
              <MegaMenu
                trigger="Recursos"
                isActive={activeMenu === "recursos"}
                onToggle={() => setActiveMenu(activeMenu === "recursos" ? null : "recursos")}
                badge="Premium"
                analytics="nav_recursos_click"
              >
                <div className="p-6 w-[700px]">
                  <div className="mb-4">
                    <div className="text-xs font-semibold uppercase text-primary mb-4">
                      Recursos prácticos · Alineados a CONOCER · Acceso de por vida
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { 
                          type: "ebook", 
                          title: "Ebooks & Guías", 
                          desc: "Recursos descargables con metodologías", 
                          price: "Desde $199 MXN", 
                          icon: "📚",
                          highlight: "PDF optimizado"
                        },
                        { 
                          type: "plantilla", 
                          title: "Plantillas", 
                          desc: "Formatos oficiales CONOCER editables", 
                          price: "Desde $299 MXN", 
                          icon: "📋",
                          highlight: "Formato Word"
                        },
                        { 
                          type: "curso", 
                          title: "Cursos Express", 
                          desc: "Micro-learning 2-6 horas", 
                          price: "Desde $1,199 MXN", 
                          icon: "🎥",
                          highlight: "Video + certificado"
                        },
                        { 
                          type: "masterclass", 
                          title: "Masterclasses", 
                          desc: "Sesiones en vivo con expertos", 
                          price: "Desde $2,999 MXN", 
                          icon: "👨‍🏫",
                          highlight: "En vivo + grabación"
                        },
                        { 
                          type: "toolkit", 
                          title: "Toolkits", 
                          desc: "Rúbricas, checklists y evaluaciones", 
                          price: "Desde $599 MXN", 
                          icon: "🛠️",
                          highlight: "Kit completo"
                        },
                        { 
                          type: "bundle", 
                          title: "Bundles", 
                          desc: "Paquetes completos por estándar", 
                          price: "Desde $4,999 MXN", 
                          icon: "📦",
                          highlight: "Hasta 60% descuento"
                        }
                      ].map((item) => (
                        <Link
                          key={item.type}
                          to={`/recursos?tipo=${item.type}`}
                          className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-gradient-to-b hover:from-primary/5 hover:to-transparent group transition-all duration-300"
                          data-analytics={`nav_recursos_${item.type}`}
                        >
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">{item.desc}</div>
                          <div className="mt-3 pt-2 border-t border-border/50">
                            <div className="text-xs font-semibold text-primary">{item.price}</div>
                            <div className="text-xs text-emerald-600 font-medium">{item.highlight}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Featured Resources Section */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="text-xs font-semibold uppercase text-primary mb-3">
                        🔥 Más populares
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/recursos?tipo=ebook&nivel=basico"
                          className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 group"
                          data-analytics="nav_recursos_featured_ebook"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">📖</span>
                            <div>
                              <div className="text-sm font-semibold text-blue-900">Guía Completa EC0217</div>
                              <div className="text-xs text-blue-700">Impartición de cursos · $299 MXN</div>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to="/recursos?tipo=plantilla&estandar=EC0301"
                          className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 hover:from-emerald-100 hover:to-green-100 group"
                          data-analytics="nav_recursos_featured_plantilla"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">📋</span>
                            <div>
                              <div className="text-sm font-semibold text-emerald-900">Plantilla Diseño Curricular</div>
                              <div className="text-xs text-emerald-700">EC0301 · $499 MXN</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                    {/* CTA Section */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-primary mb-1">Catálogo completo disponible</div>
                          <div className="text-xs text-muted-foreground">Filtros por estándar, nivel y tipo · Garantía 7 días</div>
                        </div>
                        <Link
                          to="/recursos"
                          className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:bg-primary/90 transition-all"
                          data-analytics="nav_recursos_ver_todos"
                        >
                          Explorar →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </MegaMenu>

              <NavLink
                to="/estandares"
                className={({ isActive }) =>
                  `text-sm hover:text-foreground transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`
                }
                data-analytics="nav_estandares_click"
              >
                Estándares
              </NavLink>

              {user && (
                <>
                  <NavLink
                    to="/comunidad"
                    className={({ isActive }) =>
                      `text-sm hover:text-foreground transition-colors ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`
                    }
                    data-analytics="nav_comunidad_click"
                  >
                    Comunidad
                  </NavLink>
                  
                  <NavLink
                    to="/networking"
                    className={({ isActive }) =>
                      `text-sm hover:text-foreground transition-colors ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`
                    }
                    data-analytics="nav_networking_click"
                  >
                    Networking
                  </NavLink>

                  <NavLink
                    to="/mis-cursos"
                    className={({ isActive }) =>
                      `text-sm hover:text-foreground transition-colors ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`
                    }
                    data-analytics="nav_mis_cursos_click"
                  >
                    Mis Cursos
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Drawer */}
      {isMobile && mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-background border-l border-border shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Mobile Search */}
              <form onSubmit={handleSubmitSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar estándares..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border text-sm"
                  />
                </div>
              </form>

              {/* Mobile Actions */}
              <div className="mb-6 space-y-3">
                {!user ? (
                  <>
                    <Button asChild className="w-full bg-gradient-primary text-white">
                      <Link to="/diagnostico" onClick={() => setMobileOpen(false)}>
                        Comienza Gratis
                      </Link>
                    </Button>
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>
                          Entrar
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link to="/register" onClick={() => setMobileOpen(false)}>
                          Registro
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Bienvenido</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-gradient-primary text-white">
                      <Link to="/checkout" onClick={() => setMobileOpen(false)}>
                        Inscríbete
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase text-primary mb-2">Diagnóstico</h3>
                  <div className="space-y-1">
                    <Link
                      to="/diagnostico"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Análisis de CV
                    </Link>
                    <Link
                      to="/diagnostico/chatbot"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Chatbot exploración
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase text-primary mb-2">Certificaciones</h3>
                  <div className="space-y-1">
                    <Link
                      to="/estandares"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ver estándares
                    </Link>
                    <Link
                      to="/checkout"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Inscríbete
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
                        onClick={() => setMobileOpen(false)}
                      >
                        Feed de la comunidad
                      </Link>
                      <Link
                        to="/networking"
                        className="block py-2 text-sm hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        Networking profesional
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold uppercase text-primary mb-2">Programas</h3>
                  <div className="space-y-1">
                    <Link
                      to="/programas"
                      className="block py-2 text-sm hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ver másters
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase text-primary mb-2">Recursos</h3>
                  <div className="space-y-1">
                    <Link
                      to="/recursos"
                      className="block py-2 text-sm hover:text-primary font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      📚 Todos los recursos
                    </Link>
                    <Link
                      to="/recursos?tipo=ebook"
                      className="block py-2 text-sm hover:text-primary text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ebooks & Guías
                    </Link>
                    <Link
                      to="/recursos?tipo=curso"
                      className="block py-2 text-sm hover:text-primary text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Cursos Express
                    </Link>
                    <Link
                      to="/recursos?tipo=plantilla"
                      className="block py-2 text-sm hover:text-primary text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Plantillas CONOCER
                    </Link>
                    <Link
                      to="/recursos?tipo=masterclass"
                      className="block py-2 text-sm hover:text-primary text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Masterclasses
                    </Link>
                     {user && (
                       <>
                         <div className="border-t border-border/50 mt-2 pt-2">
                           <Link
                             to="/mi-biblioteca"
                             className="block py-2 text-sm hover:text-primary text-emerald-600 font-medium"
                             onClick={() => setMobileOpen(false)}
                           >
                             📖 Mi Biblioteca
                           </Link>
                         </div>
                       </>
                     )}
                   </div>
                 </div>

                {user && (
                  <>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-primary mb-2">Mi Cuenta</h3>
                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          className="block py-2 text-sm hover:text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          Mi Panel
                        </Link>
                        <Link
                          to="/mis-cursos"
                          className="block py-2 text-sm hover:text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          Mis Cursos
                        </Link>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="w-full text-left py-2 text-sm text-destructive hover:text-destructive/80"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
