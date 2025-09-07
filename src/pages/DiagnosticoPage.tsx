import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, FileText, MessageCircle, ArrowRight } from 'lucide-react';

const DiagnosticoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Diagnóstico Gratuito de Competencias
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Descubre tus fortalezas profesionales y encuentra tu ruta de certificación perfecta con IA avanzada
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <span className="h-2 w-2 bg-success rounded-full animate-pulse"></span>
              100% Gratis • Resultados inmediatos
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic Options */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CV Analysis */}
            <Card className="p-8 hover:shadow-glow transition-all duration-300 group">
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Análisis de CV con IA
                </h3>
                <p className="text-muted-foreground mb-6">
                  Sube tu currículum y obtén un análisis detallado de tus competencias actuales y recomendaciones personalizadas.
                </p>
                <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Identificación de competencias clave
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Match con estándares CONOCER
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Rutas de certificación sugeridas
                  </li>
                </ul>
                <Button asChild className="w-full bg-gradient-primary text-white hover:shadow-glow">
                  <Link to="/analisis-cv">
                    Analizar mi CV
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Chatbot Exploration */}
            <Card className="p-8 hover:shadow-glow transition-all duration-300 group">
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Chatbot de Exploración
                </h3>
                <p className="text-muted-foreground mb-6">
                  Conversa con nuestra IA para explorar diferentes caminos profesionales y descubrir oportunidades que no conocías.
                </p>
                <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Exploración interactiva de carreras
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Recomendaciones personalizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                    Orientación profesional IA
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  <Link to="/diagnostico/chatbot">
                    Explorar con IA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Por qué empezar con nuestro diagnóstico?
            </h2>
            <p className="text-lg text-muted-foreground">
              Toma decisiones informadas sobre tu desarrollo profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IA Avanzada",
                description: "Tecnología de punta para análisis precisos de competencias y recomendaciones personalizadas."
              },
              {
                icon: FileText,
                title: "Resultados Inmediatos",
                description: "Obtén tu diagnóstico en minutos, no en semanas. Empieza tu ruta de certificación hoy mismo."
              },
              {
                icon: MessageCircle,
                title: "100% Gratuito",
                description: "Sin compromisos, sin pagos ocultos. Accede a herramientas profesionales completamente gratis."
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Listo para descubrir tu potencial?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Miles de profesionales ya han encontrado su ruta perfecta de certificación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary text-white hover:shadow-glow">
              <Link to="/analisis-cv">
                Analizar mi CV gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/estandares">
                Ver todos los estándares
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiagnosticoPage;