import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Users, Star, CheckCircle, Shield, Download, 
  Play, FileText, Award, MessageCircle, ArrowLeft,
  Gift, Timer, Lock, Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useExitIntent } from '@/hooks/useExitIntent';
import ExitIntentOffer from '@/components/marketing/ExitIntentOffer';
import UrgencyBanner from '@/components/marketing/UrgencyBanner';
import SocialProofWidget from '@/components/marketing/SocialProofWidget';
import PricingStrategy from '@/components/marketing/PricingStrategy';

interface ResourceProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  standards: string[];
  level: string;
  duration: string;
  price_cents: number;
  is_free: boolean;
  cover_url: string;
  hero_media_url: string;
  instructor: string;
  outcomes: any;
  target_audience: any;
  curriculum: any;
  bonuses: any;
  testimonials: any;
  faq: any;
  guarantee_days: number;
  rating: number;
  total_purchases: number;
}

const ResourceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [resource, setResource] = useState<ResourceProduct | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);

  // Exit intent detection
  const exitIntent = useExitIntent();

  useEffect(() => {
    if (exitIntent && !exitIntentShown && resource && !hasAccess && !resource.is_free) {
      setShowExitIntent(true);
      setExitIntentShown(true);
    }
  }, [exitIntent, exitIntentShown, resource, hasAccess]);

  useEffect(() => {
    if (slug) {
      fetchResource();
    }
  }, [slug]);

  useEffect(() => {
    if (resource && user) {
      checkAccess();
    }
  }, [resource, user]);

  const fetchResource = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_products')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setResource(data);
    } catch (error) {
      console.error('Error fetching resource:', error);
      navigate('/recursos');
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    if (!resource || !user) return;

    try {
      const { data } = await supabase
        .from('resource_access')
        .select('*')
        .eq('user_id', (user as any).id)
        .eq('product_id', resource.id)
        .single();

      setHasAccess(!!data);
    } catch (error) {
      // No access found
      setHasAccess(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim() || !resource) return;

    try {
      // Use the secure validate_coupon_code function instead of direct table access
      const { data: couponData, error } = await supabase.rpc('validate_coupon_code', {
        coupon_code_input: couponCode.toUpperCase()
      });

      if (error) {
        console.error('Error validating coupon:', error);
        toast({
          title: "Error",
          description: "Ocurrió un error al validar el cupón.",
          variant: "destructive",
        });
        return;
      }

      if (!couponData || couponData.length === 0) {
        toast({
          title: "Cupón no válido",
          description: "El cupón ingresado no existe o ha expirado.",
          variant: "destructive"
        });
        return;
      }

      const coupon = couponData[0];
      const discountAmount = Math.round(resource.price_cents * (coupon.discount_pct / 100));
      setDiscount(discountAmount);
      setCouponApplied(true);
      
      toast({
        title: "¡Cupón aplicado!",
        description: `Descuento de ${coupon.discount_pct}% aplicado.`,
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "No se pudo aplicar el cupón.",
        variant: "destructive"
      });
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!resource) return;

    setPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-resource-checkout', {
        body: {
          productId: resource.id,
          couponCode: couponApplied ? couponCode : undefined,
          provider: 'stripe'
        }
      });

      if (error) throw error;

      if (data.redirect_url) {
        // Free resource
        navigate(data.redirect_url);
      } else if (data.checkout_url) {
        // Paid resource - redirect to Stripe
        window.open(data.checkout_url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleExitIntentOffer = (exitCouponCode: string) => {
    setCouponCode(exitCouponCode);
    setCouponApplied(true);
    const discountAmount = Math.round(resource!.price_cents * 0.25); // 25% discount
    setDiscount(discountAmount);
    setShowExitIntent(false);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cents / 100);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'curso': return <Play className="w-5 h-5" />;
      case 'ebook': case 'plantilla': case 'toolkit': return <FileText className="w-5 h-5" />;
      case 'masterclass': return <Users className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-3/4"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recurso no encontrado</h2>
          <Button asChild>
            <Link to="/recursos">Volver a Recursos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const finalPrice = resource.price_cents - discount;
  
  // Marketing timing - create urgency
  const offerEndTime = new Date();
  offerEndTime.setHours(offerEndTime.getHours() + 6); // 6 hours from now

  return (
    <div className="min-h-screen bg-background">
      {/* Exit Intent Offer */}
      {showExitIntent && resource && (
        <ExitIntentOffer
          productId={resource.id}
          productTitle={resource.title}
          originalPrice={resource.price_cents}
          onClose={() => setShowExitIntent(false)}
          onAccept={handleExitIntentOffer}
        />
      )}

      {/* Top Urgency Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                🔥 ¡OFERTA ESPECIAL!
              </Badge>
              <span className="font-semibold">25% OFF</span>
              <span className="text-orange-100">Usa el código: <strong>CERTIFICACION25</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-mono">⏰ 04:31:56</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-2">
            <Link to="/recursos" className="flex items-center gap-2 text-sm hover:text-primary">
              <ArrowLeft className="w-4 h-4" />
              Volver a Recursos
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <section>
              <div className="mb-6">
                <Badge className="bg-blue-100 text-blue-700 mb-4">
                  🏆 CERTIFICACIÓN OFICIAL CONOCER
                </Badge>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Domina la <span className="text-blue-600">{resource.standards[0] || 'CONOCER'}</span> y Certifícate
                  <br />
                  <span className="text-gray-900">Sin Incertidumbre</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {resource.subtitle || resource.description}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-bold text-gray-900">
                    {resource.type === 'plantilla' ? '25 plantillas' : resource.duration || '4 horas'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {resource.type === 'plantilla' ? '+ guías' : 'Contenido práctico'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="font-bold text-gray-900">+{resource.total_purchases || 1847}</div>
                  <div className="text-sm text-gray-600">Profesionales certificados</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-bold text-gray-900">96.7%</div>
                  <div className="text-sm text-gray-600">De aprobación</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="font-bold text-gray-900">Certificados</div>
                  <div className="text-sm text-gray-600">Oficiales</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{resource.rating || 4.8}/5</span>
                </div>
                <span className="text-gray-600">• Basado en +{Math.floor((resource.total_purchases || 1847) * 0.2)} reseñas verificadas</span>
              </div>
            </section>

            {/* What You'll Achieve */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Lo que Lograrás con Este Curso</h2>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg">
                Más que memorizar información, desarrollarás <strong>confianza absoluta</strong> en tu competencia. 
                Cada módulo está diseñado para que sientas que tienes ventaja sobre otros candidatos.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {(resource.outcomes && Array.isArray(resource.outcomes) ? resource.outcomes : [
                  "Ahorra 80+ horas de trabajo",
                  "Plantillas validadas por evaluadores", 
                  "Formato profesional garantizado",
                  "Cumple 100% con requisitos CONOCER"
                ]).map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Target Audience */}
            {resource.target_audience && resource.target_audience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Para quién es este recurso</h2>
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="space-y-2">
                    {resource.target_audience.map((audience, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {audience.toLowerCase().includes('no es para') || audience.toLowerCase().includes('no para') ? (
                          <Lock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Unlock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span>{audience}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Curriculum */}
            {resource.curriculum && resource.curriculum.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Contenido del {resource.type}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {resource.curriculum.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span className="font-medium text-left">
                            {item.module || item.section || item.topic}
                          </span>
                          {item.duration && (
                            <Badge variant="secondary" className="text-xs">
                              {item.duration}
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {item.lessons && (
                          <ul className="space-y-2">
                            {item.lessons.map((lesson: string, lessonIndex: number) => (
                              <li key={lessonIndex} className="flex items-center gap-2 text-sm">
                                <Play className="w-3 h-3 text-muted-foreground" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.items && (
                          <ul className="space-y-2">
                            {item.items.map((itemContent: string, itemIndex: number) => (
                              <li key={itemIndex} className="flex items-center gap-2 text-sm">
                                <FileText className="w-3 h-3 text-muted-foreground" />
                                {itemContent}
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.content && (
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Bonuses */}
            {resource.bonuses && resource.bonuses.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Bonos incluidos</h2>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Extras sin costo adicional</span>
                  </div>
                  <div className="space-y-3">
                    {resource.bonuses.map((bonus, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <span className="text-orange-800">{bonus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Testimonials */}
            {resource.testimonials && resource.testimonials.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Lo que dicen nuestros estudiantes</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {resource.testimonials.map((testimonial, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-sm mb-3">"{testimonial.text}"</blockquote>
                        <div className="text-xs text-muted-foreground">
                          <strong>{testimonial.name}</strong>
                          {testimonial.position && <>, {testimonial.position}</>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {resource.faq && resource.faq.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Preguntas frecuentes</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {resource.faq.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Sidebar - Purchase */}
          <div className="space-y-6">
            {/* Urgency Card */}
            <Card className="sticky top-6 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Urgency Badge */}
                  <div className="text-center">
                    <Badge className="bg-red-500 text-white px-4 py-2 text-sm font-bold mb-4">
                      ⚡ OFERTA POR TIEMPO LIMITADO!
                    </Badge>
                    
                    {/* Countdown */}
                    <div className="bg-orange-500 text-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Timer className="w-5 h-5" />
                        <span className="text-sm font-medium">Esta oferta expira en:</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">04 : 31 : 56</div>
                      <div className="text-xs text-orange-100">HORAS - MINUTOS - SEGUNDOS</div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Oferta Especial de Lanzamiento
                    </h3>
                  </div>

                  {/* Pricing */}
                  {resource.is_free ? (
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">GRATIS</div>
                      <div className="text-sm text-gray-600">Descarga inmediata</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <span className="text-xl text-gray-400 line-through">
                            {formatPrice(Math.round(resource.price_cents * 1.33))} MXN
                          </span>
                          <Badge className="bg-red-500 text-white">-25%</Badge>
                        </div>
                        <div className="text-5xl font-bold text-blue-600 mb-1">
                          {formatPrice(discount > 0 ? finalPrice : resource.price_cents)}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          O 3 pagos sin intereses de <strong>{formatPrice(Math.round(resource.price_cents / 3))}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Purchase Button */}
                  {hasAccess ? (
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Link to="/mi-biblioteca">
                        <Download className="w-4 h-4 mr-2" />
                        Acceder a mi Biblioteca
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {purchasing ? (
                        "Procesando compra..."
                      ) : resource.is_free ? (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          ¡Descargar GRATIS Ahora!
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Inscríbeme al Curso Ahora
                        </>
                      )}
                    </Button>
                  )}

                  {/* Guarantees */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-green-700 font-medium">Garantía de Satisfacción Total - Sin preguntas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-green-700 font-medium">Acceso inmediato</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-green-700 font-medium">Certificados oficiales</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-green-700 font-medium">Soporte 24/7</span>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  {!resource.is_free && !hasAccess && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-yellow-600" />
                          <label className="text-sm font-medium text-yellow-800">¿Tienes un código de descuento?</label>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ej: CERTIFICACION25"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={couponApplied}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={applyCoupon}
                            disabled={!couponCode || couponApplied}
                            size="sm"
                          >
                            Aplicar
                          </Button>
                        </div>
                        {couponApplied && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            ¡Cupón aplicado! Descuento adicional activado
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;