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
      const { data: coupon, error } = await supabase
        .from('resource_coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        toast({
          title: "Cupón no válido",
          description: "El cupón ingresado no existe o ha expirado.",
          variant: "destructive"
        });
        return;
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast({
          title: "Cupón expirado",
          description: "Este cupón ya no es válido.",
          variant: "destructive"
        });
        return;
      }

      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        toast({
          title: "Cupón agotado",
          description: "Este cupón ya alcanzó su límite de usos.",
          variant: "destructive"
        });
        return;
      }

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

  return (
    <div className="min-h-screen bg-background">
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

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={resource.cover_url || '/placeholder.svg'}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  {resource.is_free ? (
                    <div className="text-3xl font-bold text-green-600">GRATIS</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(finalPrice)}
                      </div>
                      {discount > 0 && (
                        <div className="text-lg text-muted-foreground line-through">
                          {formatPrice(resource.price_cents)}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Acceso de por vida • Actualizaciones incluidas
                      </div>
                    </>
                  )}
                </div>

                {/* Coupon */}
                {!resource.is_free && !couponApplied && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">¿Tienes un cupón?</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}

                {couponApplied && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-800 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Cupón "{couponCode}" aplicado
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {hasAccess ? (
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/mi-biblioteca">
                      <Download className="w-4 h-4 mr-2" />
                      Ir a Mi Biblioteca
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      "Procesando..."
                    ) : resource.is_free ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Gratis
                      </>
                    ) : (
                      "Comprar Ahora"
                    )}
                  </Button>
                )}

                {/* Guarantee */}
                {resource.guarantee_days > 0 && !resource.is_free && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Garantía de {resource.guarantee_days} días</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Si no estás satisfecho, te devolvemos tu dinero sin preguntas.
                    </p>
                  </div>
                )}

                {/* Social Proof */}
                {resource.total_purchases > 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 inline mr-1" />
                    +{resource.total_purchases} profesionales ya lo usan
                  </div>
                )}

                {/* Contact */}
                <div className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    ¿Tienes preguntas?
                  </Button>
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