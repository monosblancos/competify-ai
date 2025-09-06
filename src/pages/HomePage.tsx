import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero">
          <div className="container mx-auto px-4 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
                Certifica<span className="text-accent">Global</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-4 animate-fade-in">
                Análisis Predictivo de Competencias
              </p>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in">
                Plataforma inteligente que analiza tu CV y recomienda las certificaciones exactas 
                que necesitas para destacar en el mercado laboral mexicano.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link
                  to="/analisis-cv"
                  className="btn-hero"
                >
                  Analizar mi CV Gratis
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir CertificaGlobal?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilizamos inteligencia artificial para personalizar tu ruta de certificación
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-elegant p-8 text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Análisis Inteligente</h3>
              <p className="text-muted-foreground">
                Nuestro AI analiza tu CV y experiencia para recomendar las certificaciones más valiosas para tu carrera.
              </p>
            </div>
            
            <div className="card-elegant p-8 text-center group">
              <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Certificaciones Oficiales</h3>
              <p className="text-muted-foreground">
                Accede a certificaciones reconocidas por CONOCER y otras instituciones oficiales mexicanas.
              </p>
            </div>
            
            <div className="card-elegant p-8 text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Oportunidades Laborales</h3>
              <p className="text-muted-foreground">
                Conectamos tu perfil certificado con oportunidades laborales específicas que requieren tus competencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Impulsa tu carrera profesional hoy
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que han potenciado su carrera con nuestras certificaciones personalizadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analisis-cv"
              className="btn-hero bg-white text-primary hover:bg-white/90 hover:shadow-glow"
            >
              Analizar CV Gratis
            </Link>
            <Link
              to="/register"
              className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Certifica<span className="text-foreground">Global</span>
              </h3>
              <p className="text-muted-foreground">
                Plataforma inteligente de certificaciones profesionales para el mercado laboral mexicano.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Enlaces</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/estandares" className="hover:text-primary transition-colors">Estándares</Link></li>
                <li><Link to="/oportunidades" className="hover:text-primary transition-colors">Oportunidades</Link></li>
                <li><Link to="/analisis-cv" className="hover:text-primary transition-colors">Análisis CV</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
              <p className="text-muted-foreground">
                Email: info@certificaglobal.com<br />
                Teléfono: +52 55 1234 5678
              </p>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CertificaGlobal. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;