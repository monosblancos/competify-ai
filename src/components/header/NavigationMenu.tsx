import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MegaMenu } from '../MegaMenu';
import { useAuth } from '../../contexts/AuthContext';

export const NavigationMenu: React.FC = () => {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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

  return (
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
                            
                            <Link
                              to={`/estandares/${standard.code}`}
                              className="inline-flex items-center text-[10px] text-primary hover:text-primary/80 font-medium"
                              data-analytics={`nav_cert_${standard.code.toLowerCase()}_click`}
                            >
                              Ver detalles →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rest of columns - keeping existing content structure */}
                {/* Columna 2: Soft Skills Standards */}
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-primary">
                    Soft Skills · Liderazgo
                  </div>
                  <div className="space-y-2">
                    {[
                      { code: "EC0555", title: "Coaching estratégico", benefit: "Desarrollo personal", hot: false, students: "876" },
                      { code: "EC0123", title: "Comunicación asertiva", benefit: "Habilidades blandas", hot: false, students: "1,234" },
                      { code: "EC0456", title: "Inteligencia emocional", benefit: "Bienestar laboral", hot: false, students: "987" }
                    ].map((standard) => (
                      <div key={standard.code} className="p-3 rounded-lg border border-border hover:bg-muted transition-all">
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
                            
                            <Link
                              to={`/estandares/${standard.code}`}
                              className="inline-flex items-center text-[10px] text-primary hover:text-primary/80 font-medium"
                              data-analytics={`nav_cert_${standard.code.toLowerCase()}_click`}
                            >
                              Ver detalles →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Columna 3: Tech & Innovation Standards */}
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase text-primary">
                    Tech & Innovation · Futuro
                  </div>
                  <div className="space-y-2">
                    {[
                      { code: "EC0789", title: "Analítica de datos", benefit: "Big Data", hot: false, students: "654" },
                      { code: "EC0901", title: "Ciberseguridad", benefit: "Protección digital", hot: false, students: "789" },
                      { code: "EC0678", title: "Desarrollo de apps móviles", benefit: "Innovación móvil", hot: false, students: "432" }
                    ].map((standard) => (
                      <div key={standard.code} className="p-3 rounded-lg border border-border hover:bg-muted transition-all">
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
                            
                            <Link
                              to={`/estandares/${standard.code}`}
                              className="inline-flex items-center text-[10px] text-primary hover:text-primary/80 font-medium"
                              data-analytics={`nav_cert_${standard.code.toLowerCase()}_click`}
                            >
                              Ver detalles →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
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
  );
};
