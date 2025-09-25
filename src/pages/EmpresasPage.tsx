import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2, Users, Award, TrendingUp, CheckCircle, Target, Zap, BarChart3, Search } from 'lucide-react';
import BusinessChatbot from '../components/business/BusinessChatbot';
import { CandidateMatchingDashboard } from '../components/business/CandidateMatchingDashboard';

const EmpresasPage: React.FC = () => {
  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Talento Certificado",
      description: "Accede a profesionales con competencias validadas por CONOCER"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Mayor Productividad",
      description: "Empleados certificados aumentan la eficiencia operacional hasta 40%"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Reconocimiento Oficial",
      description: "Certificaciones reconocidas por la SEP y organismos internacionales"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Capacitación Dirigida",
      description: "Programas personalizados para las necesidades específicas de tu empresa"
    }
  ];

  const services = [
    {
      title: "Evaluación de Competencias",
      description: "Diagnosticamos las habilidades de tu equipo actual",
      features: ["Análisis de brechas", "Reportes detallados", "Plan de desarrollo"],
      price: "Desde $5,000 MXN"
    },
    {
      title: "Capacitación Corporativa",
      description: "Programas de certificación diseñados para empresas",
      features: ["Modalidad presencial/virtual", "Instructores certificados", "Seguimiento continuo"],
      price: "Desde $15,000 MXN"
    },
    {
      title: "Consultoría en Competencias",
      description: "Asesoría completa para implementar un sistema de competencias",
      features: ["Diseño de perfiles", "Procesos de evaluación", "Certificación interna"],
      price: "Cotización personalizada"
    }
  ];

  const testimonials = [
    {
      company: "TechMex Solutions",
      industry: "Tecnología",
      testimonial: "Nuestro equipo de desarrollo mejoró significativamente después de las certificaciones EC0366. La productividad aumentó 35%.",
      name: "Carlos Mendoza",
      position: "Director de RRHH"
    },
    {
      company: "Grupo Educativo Azteca",
      industry: "Educación",
      testimonial: "Los instructores certificados con EC0217 han elevado la calidad de nuestros programas de capacitación.",
      name: "Ana Rodríguez",
      position: "Gerente de Capacitación"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Building2 className="h-4 w-4 mr-2" />
              Soluciones Empresariales
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Potencia tu Empresa con{' '}
              <span className="text-primary">Talento Certificado</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Conectamos tu empresa con profesionales certificados bajo estándares CONOCER, 
              garantizando competencias validadas y productividad comprobada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-white"
                onClick={() => {
                  document.getElementById('main-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Encontrar Talento Certificado
              </Button>
              <Button variant="outline" size="lg">
                Ver Casos de Éxito
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Empresas Beneficiadas" },
              { number: "15,000+", label: "Profesionales Certificados" },
              { number: "95%", label: "Tasa de Satisfacción" },
              { number: "40%", label: "Aumento Productividad Promedio" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="search" className="w-full" id="main-tabs">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar Talento
              </TabsTrigger>
              <TabsTrigger value="benefits">Beneficios</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-8">
              <CandidateMatchingDashboard />
            </TabsContent>
            
            <TabsContent value="benefits" className="mt-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  ¿Por qué elegir talento certificado?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Las certificaciones CONOCER garantizan que tus empleados tienen las competencias 
                  exactas que tu empresa necesita para crecer.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Nuestros Servicios Empresariales
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Soluciones integrales para desarrollar y certificar el talento de tu organización.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t">
                        <p className="text-sm font-semibold text-primary">
                          {service.price}
                        </p>
                      </div>
                      <Button className="w-full" variant="outline">
                        Más Información
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials" className="mt-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Lo que dicen nuestros clientes
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{testimonial.industry}</Badge>
                      </div>
                      <blockquote className="text-lg italic text-muted-foreground">
                        "{testimonial.testimonial}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para transformar tu empresa?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Agenda una consultoría gratuita y descubre cómo las certificaciones CONOCER 
            pueden impulsar tu organización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Zap className="h-4 w-4 mr-2" />
              Agendar Consultoría
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Casos de Estudio
            </Button>
          </div>
        </div>
      </section>

      {/* Business Chatbot */}
      <BusinessChatbot 
        companyInfo={{
          industry: "Sector empresarial general",
          size: "Empresa visitante"
        }}
      />
    </div>
  );
};

export default EmpresasPage;