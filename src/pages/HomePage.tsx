import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Award, Users, BookOpen, Target, TrendingUp, CheckCircle, 
  Bot, BrainCircuit, Download, FileText, MessageCircle, Phone,
  MapPin, Mail, Filter, Star, Briefcase, ArrowRight, Zap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [showFreeAnalysis, setShowFreeAnalysis] = useState(false);
  const [email, setEmail] = useState('');
  const [showIAFilters, setShowIAFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)] opacity-50"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 mb-6">
                Lidera el cambio
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Desarrolla Competencias 
              <span className="block text-primary">con IA + CONOCER</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-6 max-w-4xl mx-auto">
              El mejor centro de formación online en Competencias Laborales con análisis de IA personalizado. 
              <span className="block mt-2 text-lg">✨ <strong>Análisis GRATUITO de tu perfil profesional</strong> ✨</span>
            </p>

            {/* Awards/Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-80">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className="text-white text-sm font-medium">Innovación Educativa</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-white text-sm font-medium">Certificado CONOCER</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-white text-sm font-medium">Selección Estudiantil</span>
              </div>
            </div>

            {/* Video/Demo Section */}
            <div className="relative mb-12 max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl border-2 border-white/20 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                  <p className="text-white font-medium">Ver demo del proceso de certificación</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analisis-cv"
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:scale-105 transition-all text-lg shadow-lg"
              >
                <BrainCircuit className="w-5 h-5 inline mr-2" />
                Análisis IA GRATUITO
              </Link>
              <Link
                to="/estandares"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
              >
                Ver Certificaciones
              </Link>
            </div>

            {/* Lead Magnet - Free Resources */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all cursor-pointer">
                <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Guía de Competencias</h3>
                <p className="text-white/80 text-sm mb-3">PDF gratuito con las 15 competencias más demandadas</p>
                <Link to="/estandares" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Descargar gratis
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all cursor-pointer">
                <Bot className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">ChatBot IA</h3>
                <p className="text-white/80 text-sm mb-3">Consulta gratuita sobre tu plan de carrera</p>
                <Link to="/dashboard" className="text-accent hover:text-accent/80 text-sm font-medium">
                  Chatear ahora
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all cursor-pointer">
                <Target className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Test de Perfil</h3>
                <p className="text-white/80 text-sm mb-3">Descubre qué certificación necesitas</p>
                <Link to="/analisis-cv" className="text-yellow-400 hover:text-yellow-400/80 text-sm font-medium">
                  Hacer test gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IA Analysis Preview Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Inteligencia Artificial que impulsa tu carrera
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Nuestro sistema de IA analiza tu perfil profesional y te conecta con las oportunidades perfectas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Análisis IA */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Análisis IA de Competencias</h3>
              <p className="text-muted-foreground mb-6">
                Analizamos tu CV con IA para identificar fortalezas, brechas y recomendaciones personalizadas
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Predicción de éxito: 94%</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>847 vacantes compatibles</span>
                </div>
              </div>
            </div>

            {/* Matching Laboral */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Matching Laboral Inteligente</h3>
              <p className="text-muted-foreground mb-6">
                Conectamos tu perfil con empresas que valoran tus certificaciones CONOCER
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>Match promedio: 82%</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>+150 empresas activas</span>
                </div>
              </div>
            </div>

            {/* Chatbot IA */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Asistente IA 24/7</h3>
              <p className="text-muted-foreground mb-6">
                Chatbot especializado en certificaciones CONOCER para resolver todas tus dudas
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span>Respuestas instantáneas</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span>Experto en CONOCER</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              to="/analisis-cv"
              className="btn-gradient text-lg px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg inline-flex items-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Probar IA Gratis Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Certification Programs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Nuestros programas con certificación oficial CONOCER
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* EC0217 - Liderazgo */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0217 - Liderazgo de Equipos</h3>
                <p className="text-muted-foreground">
                  Aprende a liderar equipos de trabajo de manera efectiva y conviértete en el líder que las empresas están buscando.
                </p>
              </div>
              <Link 
                to="/estandares/EC0217.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* EC0301 - Gestión de Proyectos */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0301 - Gestión de Proyectos</h3>
                <p className="text-muted-foreground">
                  Domina la gestión de proyectos con metodologías reconocidas y lidera iniciativas exitosas en cualquier organización.
                </p>
              </div>
              <Link 
                to="/estandares/EC0301.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* EC0366 - Capacitación */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0366 - Capacitación Empresarial</h3>
                <p className="text-muted-foreground">
                  Conviértete en experto en capacitación y desarrollo del capital humano, maximizando el potencial de los equipos.
                </p>
              </div>
              <Link 
                to="/estandares/EC0366.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* EC0435 - Atención al Cliente */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0435 - Atención al Cliente</h3>
                <p className="text-muted-foreground">
                  Especialízate en brindar un servicio excepcional al cliente y genera experiencias que impulsen la fidelización.
                </p>
              </div>
              <Link 
                to="/estandares/EC0435.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* EC0308 - Ventas */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0308 - Técnicas de Ventas</h3>
                <p className="text-muted-foreground">
                  Desarrolla habilidades avanzadas de ventas para maximizar resultados y construir relaciones duraderas con clientes.
                </p>
              </div>
              <Link 
                to="/estandares/EC0308.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* EC0249 - Calidad */}
            <div className="card-elegant p-8 group hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">EC0249 - Sistemas de Calidad</h3>
                <p className="text-muted-foreground">
                  Implementa y mantiene sistemas de calidad que aseguren la excelencia operacional en cualquier organización.
                </p>
              </div>
              <Link 
                to="/estandares/EC0249.01" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Ver más <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/estandares"
              className="btn-primary inline-flex items-center"
            >
              Ver todas las certificaciones <BookOpen className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">+15</div>
              <p className="text-muted-foreground">Certificaciones especializadas en competencias laborales</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">+2,500</div>
              <p className="text-muted-foreground">Profesionales han confiado en nuestros programas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">+32</div>
              <p className="text-muted-foreground">Estados de México integran nuestra comunidad</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">+150</div>
              <p className="text-muted-foreground">Empresas confían en nuestros certificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Súmate a la innovación formativa
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              CertificaGlobal nació para revolucionar el mundo de las certificaciones laborales y crear los mejores 
              programas de formación en competencias profesionales.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              En lugar de instructores tradicionales, contamos con expertos certificados del sector empresarial 
              que trabajan en empresas de primer nivel y que comparten sus conocimientos de primera mano.
            </p>
            <p className="text-lg text-muted-foreground">
              Así, garantizamos que nuestra formación esté siempre a la vanguardia de las tendencias y 
              necesidades del mercado laboral mexicano.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Con CertificaGlobal, no solo aprendes
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Te preparas para liderar y transformar el mundo empresarial con competencias certificadas 
                que las empresas realmente valoran.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  Metodología basada en casos reales
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  Evaluaciones con estándares CONOCER
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  Seguimiento personalizado de progreso
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  Conexión directa con oportunidades laborales
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="text-foreground font-semibold">Formación colaborativa</p>
                  <p className="text-muted-foreground text-sm">Con profesionales en activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Aprende de expertos en activo de empresas líderes como...
            </h2>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center opacity-60 max-w-6xl mx-auto">
            {/* Company logos placeholders - you can replace with actual logos */}
            {[
              'CEMEX', 'Bimbo', 'PEMEX', 'OXXO', 'Walmart', 'Liverpool', 'Telcel', 'Banorte',
              'AMLO', 'Televisa', 'IMSS', 'CFE', 'América Móvil', 'Coca-Cola', 'Nestlé', 'P&G'
            ].map((company, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 h-16 flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground text-center">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Impulsa tu carrera profesional hoy
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que han potenciado su carrera con nuestras certificaciones CONOCER.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors text-lg"
            >
              Comenzar mi Certificación
            </Link>
            <Link
              to="/analisis-cv"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Analizar mi CV
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-primary">CERTIFICA GLOBAL</span>
              </h3>
              <p className="text-sm text-white/60 mb-2">
                INNOVACIÓN EN EVALUACIÓN Y CERTIFICACIÓN DE COMPETENCIAS S.A.S. DE C.V.
              </p>
              <p className="text-white/80 mb-6 max-w-md">
                Prestador de servicios de la red CONOCER especializado en certificaciones laborales 
                con tecnología de IA para impulsar tu desarrollo profesional.
              </p>
              <div className="flex space-x-4 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">CONOCER</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">Microsoft</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">OpenEng</span>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+52 55 2767 2486</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Camino a Belén 85, Local B, G99<br />Col. Cove Tacubaya, Álvaro Obregón</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>contacto@certificaglobal.mx</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Certificaciones</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/estandares" className="hover:text-primary transition-colors">Ver todas</Link></li>
                <li><Link to="/estandares/EC0217.01" className="hover:text-primary transition-colors">Liderazgo</Link></li>
                <li><Link to="/estandares/EC0301.01" className="hover:text-primary transition-colors">Gestión de Proyectos</Link></li>
                <li><Link to="/estandares/EC0366.01" className="hover:text-primary transition-colors">Capacitación</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/analisis-cv" className="hover:text-primary transition-colors">Análisis de CV</Link></li>
                <li><Link to="/oportunidades" className="hover:text-primary transition-colors">Oportunidades</Link></li>
                <li><Link to="/mis-cursos" className="hover:text-primary transition-colors">Mis Cursos</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm">
                &copy; 2024 CertificaGlobal. Todos los derechos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacidad" className="text-white/60 hover:text-primary text-sm transition-colors">
                  Privacidad
                </Link>
                <Link to="/terminos" className="text-white/60 hover:text-primary text-sm transition-colors">
                  Términos
                </Link>
                <Link to="/contacto" className="text-white/60 hover:text-primary text-sm transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Certificaciones</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/estandares/EC0217.01" className="hover:text-primary">Liderazgo</Link></li>
                <li><Link to="/estandares/EC0301.01" className="hover:text-primary">Gestión de Proyectos</Link></li>
                <li><Link to="/estandares/EC0366.01" className="hover:text-primary">Capacitación</Link></li>
                <li><Link to="/estandares/EC0435.01" className="hover:text-primary">Atención al Cliente</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><button onClick={() => setShowFreeAnalysis(true)} className="hover:text-primary">Análisis IA Gratis</button></li>
                <li><Link to="/analisis-cv" className="hover:text-primary">Analizar CV</Link></li>
                <li><Link to="/oportunidades" className="hover:text-primary">Oportunidades</Link></li>
                <li><a href="#" className="hover:text-primary">ChatBot IA</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-primary">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-primary">Metodología</a></li>
                <li><a href="#" className="hover:text-primary">Instructores</a></li>
                <li><a href="#" className="hover:text-primary">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Certifica Global. Todos los derechos reservados. | Prestador de servicios de la red CONOCER
            </p>
          </div>
        </div>
      </footer>

      {/* Free Analysis Modal */}
      {showFreeAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Análisis IA Gratuito</h3>
              <p className="text-muted-foreground">
                Descubre tu potencial profesional y las certificaciones ideales para ti
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email para recibir tu análisis
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFreeAnalysis(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <Link
                  to="/onboarding"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 text-center"
                >
                  Comenzar Análisis
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating IA Filters Button */}
      <button
        onClick={() => setShowIAFilters(!showIAFilters)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition-all z-40 flex items-center justify-center"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Floating IA Filters Panel */}
      {showIAFilters && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border p-6 z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center">
              <Bot className="w-5 h-5 mr-2 text-purple-500" />
              Filtros IA
            </h3>
            <button
              onClick={() => setShowIAFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-foreground font-medium mb-2">Certificación</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500">
                <option>Todas las certificaciones</option>
                <option>Liderazgo (EC0217)</option>
                <option>Gestión de Proyectos (EC0301)</option>
                <option>Capacitación (EC0366)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-foreground font-medium mb-2">Matching Score</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    90%+ (Excelente)
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    75-89% (Muy bueno)
                  </span>
                </label>
              </div>
            </div>
            
            <Link
              to="/oportunidades"
              className="block w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center hover:opacity-90"
            >
              <ArrowRight className="w-4 h-4 inline mr-2" />
              Ver Oportunidades
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;