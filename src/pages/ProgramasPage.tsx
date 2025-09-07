import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Search, 
  Megaphone, 
  BarChart3,
  Clock,
  Users,
  Award,
  ArrowRight 
} from 'lucide-react';

const ProgramasPage: React.FC = () => {
  const masterPrograms = [
    {
      id: 'ia',
      name: 'Máster en Inteligencia Artificial',
      description: 'Domina la IA para optimizar procesos, adaptarte a los cambios del sector y satisfacer la creciente demanda de profesionales actualizados.',
      icon: Brain,
      duration: '6 meses',
      students: '2,450+',
      level: 'Avanzado',
      topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'IA Ética'],
      price: '$49,900',
      originalPrice: '$69,900',
      priceDisplay: '$49,900 MXN',
      featured: true
    },
    {
      id: 'marketing',
      name: 'Máster en Marketing Digital',
      description: 'Estrategias digitales avanzadas para dominar todos los canales digitales y generar resultados medibles.',
      icon: TrendingUp,
      duration: '5 meses',
      students: '1,890+',
      level: 'Intermedio-Avanzado',
      topics: ['SEM/SEO', 'Social Media', 'Email Marketing', 'Analytics', 'Growth Hacking'],
      price: '$39,900',
      originalPrice: '$55,900',
      priceDisplay: '$39,900 MXN'
    },
    {
      id: 'funnel',
      name: 'Máster en Funnel de Ventas',
      description: 'Optimiza tus conversiones creando funnels de venta que convierten visitantes en clientes fieles.',
      icon: Target,
      duration: '4 meses',
      students: '1,234+',
      level: 'Intermedio',
      topics: ['Copywriting', 'Landing Pages', 'A/B Testing', 'CRO', 'Automatización'],
      price: '$33,900',
      originalPrice: '$47,900',
      priceDisplay: '$33,900 MXN'
    },
    {
      id: 'seo',
      name: 'Máster en SEO',
      description: 'Posicionamiento web profesional para maximizar tu impacto en motores de búsqueda.',
      icon: Search,
      duration: '4 meses',
      students: '3,120+',
      level: 'Intermedio-Avanzado',
      topics: ['SEO Técnico', 'Link Building', 'Contenido SEO', 'Local SEO', 'SEO Internacional'],
      price: '$29,900',
      originalPrice: '$43,900',
      priceDisplay: '$29,900 MXN'
    },
    {
      id: 'sem',
      name: 'Máster en SEM',
      description: 'Publicidad digital rentable en Google Ads, Facebook Ads y otras plataformas.',
      icon: Megaphone,
      duration: '3 meses',
      students: '987+',
      level: 'Intermedio',
      topics: ['Google Ads', 'Facebook Ads', 'Programática', 'Retargeting', 'Attribution'],
      price: '$25,900',
      originalPrice: '$37,900',
      priceDisplay: '$25,900 MXN'
    },
    {
      id: 'data',
      name: 'Máster en Data Analytics',
      description: 'Análisis de datos estratégicos para tomar decisiones basadas en datos y generar insights valiosos.',
      icon: BarChart3,
      duration: '5 meses',
      students: '756+',
      level: 'Avanzado',
      topics: ['Python/R', 'SQL', 'Tableau/Power BI', 'Machine Learning', 'Big Data'],
      price: '$43,900',
      originalPrice: '$59,900',
      priceDisplay: '$43,900 MXN'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Formación aplicada con IA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Másters que transforman
              <span className="text-primary"> carreras</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Programas intensivos diseñados para profesionales que quieren liderar la transformación digital en sus industrias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary text-white hover:shadow-glow">
                Explorar Programas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Ver Demo Gratuita
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestros Programas Máster
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada programa combina teoría avanzada con práctica real, mentoría personalizada y proyectos que puedes añadir a tu portfolio profesional.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {masterPrograms.map((program) => (
              <Card 
                key={program.id} 
                className={`relative p-8 hover:shadow-glow transition-all duration-300 ${
                  program.featured ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                {program.featured && (
                  <Badge className="absolute -top-3 left-8 bg-primary text-primary-foreground">
                    Más Popular
                  </Badge>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                    <program.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {program.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{program.duration}</div>
                    <div className="text-xs text-muted-foreground">Duración</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{program.students}</div>
                    <div className="text-xs text-muted-foreground">Estudiantes</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-5 w-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium">{program.level}</div>
                    <div className="text-xs text-muted-foreground">Nivel</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Lo que aprenderás:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl font-bold text-foreground">
                       {program.priceDisplay}
                     </span>
                     <span className="text-sm text-muted-foreground line-through">
                       {program.originalPrice} MXN
                     </span>
                   </div>
                   <Button 
                     asChild
                     className={program.featured ? 'bg-gradient-primary text-white' : ''} 
                     variant={program.featured ? 'default' : 'outline'}
                   >
                     <Link to={`/programas/${program.id}/checkout`}>
                       Inscríbete Ahora
                       <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                 </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Por qué nuestros Másters?
            </h2>
            <p className="text-lg text-muted-foreground">
              La diferencia está en la metodología y el acompañamiento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Metodología Certifica Pro",
                description: "Combina teoría, práctica y mentoría personalizada con proyectos reales de empresas.",
                icon: "🎯"
              },
              {
                title: "IA Integrada",
                description: "Herramientas de IA personalizadas que se adaptan a tu ritmo de aprendizaje.",
                icon: "🤖"
              },
              {
                title: "Networking Profesional",
                description: "Acceso a una comunidad exclusiva de +10,000 profesionales digitales.",
                icon: "🌐"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿No sabes qué Máster elegir?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nuestro diagnóstico gratuito te ayudará a encontrar el programa perfecto para tus objetivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary text-white hover:shadow-glow">
              <Link to="/diagnostico">
                Diagnóstico Gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contacto">
                Hablar con un Asesor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramasPage;