import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, Users, BookOpen, Target, TrendingUp, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
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
              Escuela Online de
              <span className="block text-primary">Certificaciones CONOCER</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-6 max-w-4xl mx-auto">
              El mejor centro de formación online en Competencias Laborales. 
              Galardonado por innovación y programa educativo
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
                to="/onboarding"
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-lg"
              >
                Comenzar mi Certificación
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Desarrolla habilidades prácticas para liderar el entorno laboral
            </h2>
            <p className="text-xl text-muted-foreground">
              Ya sea para aprovechar nuevas oportunidades laborales, mejorar en tu trabajo actual o impulsar tu propio proyecto, 
              nuestras certificaciones te brindan los conocimientos prácticos para alcanzar tus metas profesionales.
            </p>
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
                Certifica<span className="text-primary">Global</span>
              </h3>
              <p className="text-white/80 mb-6 max-w-md">
                La plataforma líder en certificaciones CONOCER para el mercado laboral mexicano. 
                Transforma tu carrera con competencias reconocidas oficialmente.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">CONOCER</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">SEP</span>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;