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

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/recursos" className="text-muted-foreground hover:text-foreground">
              Recursos
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{resource.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/recursos">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary">
                  {getTypeIcon(resource.type)}
                  <span className="ml-1 capitalize">{resource.type}</span>
                </Badge>
                {resource.level && (
                  <Badge variant="secondary">{resource.level}</Badge>
                )}
                {resource.standards.map(std => (
                  <Badge key={std} variant="outline">{std}</Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{resource.subtitle}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                {resource.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {resource.duration}
                  </div>
                )}
                {resource.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {resource.rating.toFixed(1)} ({resource.total_purchases} estudiantes)
                  </div>
                )}
                {resource.instructor && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {resource.instructor}
                  </div>
                )}
              </div>

              {/* Hero Media */}
              {resource.hero_media_url && (
                <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                  <img
                    src={resource.hero_media_url}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-base leading-relaxed">{resource.description}</p>
            </section>

            {/* What You'll Achieve */}
            {resource.outcomes && resource.outcomes.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Lo que lograrás</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {resource.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
            {/* Urgency Banners */}
            {!resource.is_free && !hasAccess && (
              <div className="space-y-2">
                <UrgencyBanner type="limited_time" endTime={offerEndTime} />
                <UrgencyBanner type="limited_stock" stockLeft={Math.floor(Math.random() * 12) + 8} />
                <UrgencyBanner type="demand" studentsCount={resource.total_purchases} />
              </div>
            )}

            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Pricing Strategy */}
                  {resource.is_free ? (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">GRATIS</div>
                      <div className="text-sm text-muted-foreground">
                        Acceso inmediato y permanente
                      </div>
                    </div>
                  ) : (
                    <PricingStrategy
                      originalPrice={resource.price_cents}
                      discountedPrice={discount > 0 ? finalPrice : undefined}
                      discountPercent={discount > 0 ? Math.round((discount / resource.price_cents) * 100) : undefined}
                      guaranteeDays={resource.guarantee_days}
                      showValue={true}
                    />
                  )}

                  {/* Coupon Code */}
                  {!resource.is_free && !hasAccess && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-orange-500" />
                          <label className="text-sm font-medium">¿Tienes un código de descuento?</label>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ingresa tu cupón"
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
                            Cupón aplicado correctamente
                          </div>
                        )}
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
                    <div className="space-y-3">
                      <Button 
                        onClick={handlePurchase}
                        disabled={purchasing}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                      >
                        {purchasing ? (
                          "Procesando compra..."
                        ) : resource.is_free ? (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            ¡Obtener GRATIS Ahora!
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5 mr-2" />
                            🔥 ¡COMPRAR AHORA! 🔥
                          </>
                        )}
                      </Button>
                      
                      {!resource.is_free && (
                        <div className="text-center space-y-2">
                          <p className="text-xs text-gray-500">
                            ⚡ Acceso instantáneo tras el pago
                          </p>
                          <p className="text-xs text-gray-500">
                            🛡️ Compra protegida al 100%
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Proof Widget */}
                  <SocialProofWidget
                    totalPurchases={resource.total_purchases}
                    rating={resource.rating}
                    recentPurchases={Math.floor(Math.random() * 8) + 3}
                  />
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