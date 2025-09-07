import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Clock, 
  Users, 
  Star, 
  Lightbulb, 
  Download,
  Phone,
  Mail,
  Heart,
  TrendingUp,
  Target,
  Award,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  standard?: StandardCard;
  leadMagnet?: LeadMagnetOffer;
  standards?: StandardCard[];
}

interface StandardCard {
  code: string;
  title: string;
  category: string;
  level: 'Nivel I' | 'Nivel II' | 'Nivel III' | 'Nivel IV' | 'Nivel V';
  averageSalary: string;
  demand: 'Alta' | 'Media' | 'Muy Alta';
  rating: number;
  tags: string[];
  description: string;
  certifiedProfessionals: number;
}

interface LeadMagnetOffer {
  title: string;
  subtitle: string;
  originalPrice: number;
  currentPrice: number;
  discount: string;
  features: string[];
  urgency: string;
  cta: string;
  type: 'guide' | 'certification' | 'consultation';
}

const ChatbotExploracionPage: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! 👋 Soy tu Arquitecto de Trayectorias de Certificación con IA avanzada.\n\nEstoy aquí para ayudarte a encontrar la certificación profesional perfecta para ti. Los profesionales certificados ganan hasta un 99% más que los no certificados.\n\n✨ ¿Listo para transformar tu carrera?',
      timestamp: new Date(),
      suggestions: [
        'Quiero certificarme en tecnología',
        '¿Qué certificación me conviene más?',
        'Busco aumentar mi salario',
        'Analiza mi perfil profesional'
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(15);
  const [sessionData, setSessionData] = useState({
    email: '',
    whatsapp: '',
    interests: [] as string[],
    currentStep: 1
  });
  const [showExitModal, setShowExitModal] = useState(false);
  const [relatedStandards, setRelatedStandards] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Exit intent detection
  useEffect(() => {
    let timeSpent = 0;
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      timeSpent = Date.now() - startTime;
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (
        timeSpent > 30000 && // 30 seconds minimum
        e.clientY <= 0 &&
        !showExitModal &&
        messages.length > 3 // User has interacted
      ) {
        setShowExitModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearInterval(timeInterval);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showExitModal, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const featuredStandards: StandardCard[] = [
    {
      code: 'EC0217',
      title: 'Impartir cursos de capacitación presenciales grupales',
      category: 'Capacitación y Desarrollo',
      level: 'Nivel III',
      averageSalary: '$18,000 - $35,000 MXN',
      demand: 'Muy Alta',
      rating: 4.8,
      tags: ['capacitación', 'educación', 'facilitación', 'desarrollo humano'],
      description: 'Competencia para diseñar e impartir cursos de capacitación presenciales grupales, evaluando el aprendizaje conforme a los objetivos establecidos.',
      certifiedProfessionals: 15420
    },
    {
      code: 'EC0301',
      title: 'Diseñar cursos de capacitación',
      category: 'Diseño Instruccional',
      level: 'Nivel IV',
      averageSalary: '$25,000 - $45,000 MXN',
      demand: 'Alta',
      rating: 4.7,
      tags: ['diseño instruccional', 'curriculo', 'pedagogía', 'evaluación'],
      description: 'Diseñar cursos de capacitación presenciales, sus instrumentos de evaluación y material didáctico.',
      certifiedProfessionals: 8934
    },
    {
      code: 'EC0366',
      title: 'Desarrollo de habilidades digitales',
      category: 'Tecnología',
      level: 'Nivel II',
      averageSalary: '$22,000 - $40,000 MXN',
      demand: 'Muy Alta',
      rating: 4.9,
      tags: ['tecnología', 'digital', 'innovación', 'transformación'],
      description: 'Desarrollar habilidades digitales para el uso de tecnologías de información y comunicación.',
      certifiedProfessionals: 12567
    }
  ];

  const leadMagnetOffers: LeadMagnetOffer[] = [
    {
      title: '📊 Guía Completa de Certificación CONOCER',
      subtitle: 'Descubre tu ruta profesional ideal con +1,845 estándares',
      originalPrice: 97,
      currentPrice: 0,
      discount: 'GRATIS',
      features: [
        'Test de Orientación Profesional',
        'Análisis de 1,845 Estándares',
        'Proyección Salarial por Certificación',
        'Mapa de Trayectorias Profesionales',
        'ROI de cada Certificación'
      ],
      urgency: 'Descarga limitada - Solo hoy',
      cta: 'Descargar Guía Gratis',
      type: 'guide'
    },
    {
      title: '🚀 Certificación CONOCER Premium',
      subtitle: 'Certificación + Mentoring + Garantía de Colocación',
      originalPrice: 3500,
      currentPrice: 2450,
      discount: '30% OFF',
      features: [
        'Certificación Oficial CONOCER',
        'Mentoring 1:1 con Expertos',
        'Material Didáctico Premium',
        'Garantía de Colocación Laboral',
        'Network de Profesionales Certificados'
      ],
      urgency: 'Promoción termina en: 23:45:12',
      cta: 'Inscribirme Premium',
      type: 'certification'
    },
    {
      title: '💡 Consultoría Personalizada',
      subtitle: 'Análisis 1:1 de tu perfil y estrategia de certificación',
      originalPrice: 500,
      currentPrice: 297,
      discount: '40% OFF',
      features: [
        'Sesión 1:1 de 60 minutos',
        'Análisis DAFO Profesional',
        'Plan de Certificación Personalizado',
        'Proyección de ROI',
        'Seguimiento por 3 meses'
      ],
      urgency: 'Solo 5 cupos disponibles esta semana',
      cta: 'Agendar Consultoría',
      type: 'consultation'
    }
  ];

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setProgress(prev => Math.min(prev + 10, 90));

    // Simulate AI processing
    setTimeout(async () => {
      const botResponse = await generateBotResponse(content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setProgress(prev => Math.min(prev + 5, 100));
    }, 1500);
  };

  // Search related standards
  const searchRelatedStandards = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('standards')
        .select('code, title, description, category')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(3);
      
      if (!error && data) {
        setRelatedStandards(data);
        return data;
      }
    } catch (error) {
      console.error('Error searching standards:', error);
    }
    return [];
  };

  const generateBotResponse = async (userInput: string): Promise<Message> => {
    const lowerInput = userInput.toLowerCase();
    
    // Search for related standards
    const standards = await searchRelatedStandards(userInput);
    
    // Lead magnet triggers (only show in conversation after significant interaction)
    if (messages.length > 5 && (lowerInput.includes('guía') || lowerInput.includes('ayuda') || lowerInput.includes('orientación'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Perfecto! Veo que necesitas orientación profesional personalizada. Tengo exactamente lo que buscas para acelerar tu carrera.',
        timestamp: new Date(),
        leadMagnet: leadMagnetOffers[0],
        suggestions: ['¿Cómo funciona la certificación?', 'Quiero consultoría personalizada', 'Mostrar más estándares']
      };
    }

    if (lowerInput.includes('tecnología') || lowerInput.includes('digital') || lowerInput.includes('ti') || lowerInput.includes('sistemas')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Excelente elección! El sector tecnológico tiene una demanda muy alta. Te recomiendo este estándar con gran proyección:',
        timestamp: new Date(),
        standard: featuredStandards[2],
        suggestions: ['¿Qué otros estándares en tecnología hay?', 'Quiero ver el salario promedio', 'Me interesa certificarme']
      };
    }

    if (lowerInput.includes('capacitación') || lowerInput.includes('enseñar') || lowerInput.includes('formación') || lowerInput.includes('educar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Perfecto! La capacitación es un sector con alta demanda y excelentes oportunidades. Te muestro el estándar más popular:',
        timestamp: new Date(),
        standard: featuredStandards[0],
        suggestions: ['¿Cuánto ganan los capacitadores?', 'Ver proceso de certificación', 'Mostrar estándares relacionados']
      };
    }

    if (lowerInput.includes('salario') || lowerInput.includes('sueldo') || lowerInput.includes('ganar') || lowerInput.includes('dinero')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Excelente pregunta! Los profesionales certificados pueden aumentar significativamente sus ingresos. Te muestro algunos estándares con alta remuneración:',
        timestamp: new Date(),
        standards: featuredStandards,
        suggestions: ['¿Cuál me conviene más?', 'Quiero consultoría personalizada', 'Ver todos los estándares']
      };
    }

    if (messages.length > 5 && (lowerInput.includes('certificación') || lowerInput.includes('certificar') || lowerInput.includes('conocer'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Excelente decisión! La certificación CONOCER es tu mejor inversión profesional. Te ayudo a elegir la opción perfecta para ti.',
        timestamp: new Date(),
        leadMagnet: leadMagnetOffers[1],
        suggestions: ['¿Qué beneficios tiene?', 'Quiero consultoría 1:1', 'Ver certificaciones disponibles']
      };
    }

    if (lowerInput.includes('consultoría') || lowerInput.includes('asesoría') || lowerInput.includes('personalizado') || lowerInput.includes('1:1')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Perfecto! Una consultoría personalizada es la mejor forma de acelerar tu certificación. Te ayudo a crear tu estrategia profesional.',
        timestamp: new Date(),
        leadMagnet: leadMagnetOffers[2],
        suggestions: ['¿Cómo funciona?', 'Ver disponibilidad', 'Conocer metodología']
      };
    }

    // Show related standards if found
    if (standards.length > 0) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `¡Excelente! Encontré ${standards.length} estándares CONOCER relacionados con tu consulta. Estos podrían ser perfectos para tu crecimiento profesional y aumento salarial:`,
        timestamp: new Date(),
        standards: standards.slice(0, 3).map(s => ({
          code: s.code,
          title: s.title,
          category: s.category || 'Competencia Profesional',
          level: 'Nivel III' as const,
          averageSalary: '$20,000 - $35,000 MXN',
          demand: 'Alta' as const,
          rating: 4.5,
          tags: ['certificación', 'conocer', 'competencia'],
          description: s.description || 'Estándar de competencia profesional reconocido nacionalmente.',
          certifiedProfessionals: Math.floor(Math.random() * 10000) + 1000
        })),
        suggestions: standards.slice(0, 3).map(s => `Ver ${s.code}: ${s.title.substring(0, 30)}...`)
      };
    }

    // Default responses with standard suggestions
    const responses = [
      {
        content: '¡Genial! Basado en tu consulta, te recomiendo este estándar de competencia muy demandado:',
        standard: featuredStandards[0]
      },
      {
        content: 'Te entiendo perfectamente. Aquí tienes un estándar con excelente proyección salarial:',
        standard: featuredStandards[1]
      },
      {
        content: '¡Esa es una excelente pregunta! Te comparto este estándar con alta demanda laboral:',
        standard: featuredStandards[2]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      standard: randomResponse.standard,
      suggestions: [
        'Ver más estándares similares',
        '¿Cuánto puedo ganar con esto?',
        'Quiero certificarme',
        'Consultoría personalizada'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleEmailCapture = () => {
    if (!sessionData.email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para continuar",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "¡Gracias por tu interés!",
      description: "Te hemos enviado el manual a tu email",
    });
  };

  const StandardDisplay: React.FC<{ standard: StandardCard }> = ({ standard }) => (
    <Card className="mt-4 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{standard.code}</h3>
            <p className="text-sm font-medium text-foreground mt-1">{standard.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{standard.level}</Badge>
              <Badge variant="outline">{standard.category}</Badge>
              <Badge variant={standard.demand === 'Muy Alta' ? 'default' : 'secondary'}>
                Demanda: {standard.demand}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-4">{standard.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <span className="text-sm font-medium text-green-600">{standard.averageSalary}</span>
              <p className="text-xs text-muted-foreground">Salario promedio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">{standard.certifiedProfessionals.toLocaleString()}</span>
              <p className="text-xs text-muted-foreground">Certificados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <div>
              <span className="text-sm font-medium">{standard.rating}/5</span>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {standard.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            +99% de aumento salarial promedio después de certificación
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Ver Detalles
            </Button>
            <Button size="sm">
              Certificarme
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StandardsListDisplay: React.FC<{ standards: StandardCard[] }> = ({ standards }) => (
    <div className="mt-4 space-y-3">
      {standards.map((standard, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{standard.code}</Badge>
                  <Badge variant={standard.demand === 'Muy Alta' ? 'default' : 'secondary'} className="text-xs">
                    {standard.demand}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">{standard.title}</h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{standard.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600">{standard.averageSalary}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{standard.rating}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-3">
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const LeadMagnetDisplay: React.FC<{ offer: LeadMagnetOffer }> = ({ offer }) => (
    <Card className="mt-4 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{offer.title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">{offer.subtitle}</p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{offer.urgency}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-green-600">${offer.currentPrice}</span>
          <span className="text-lg text-gray-400 line-through">${offer.originalPrice}</span>
          <Badge variant="destructive">{offer.discount}</Badge>
        </div>

        <div className="space-y-2 mb-6">
          {offer.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Tu email para recibir el material"
            value={sessionData.email}
            onChange={(e) => setSessionData(prev => ({...prev, email: e.target.value}))}
            className="w-full"
          />
          <Button 
            className="w-full bg-black text-white hover:bg-gray-800 font-semibold"
            onClick={handleEmailCapture}
          >
            <Download className="h-4 w-4 mr-2" />
            {offer.cta}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ExitIntentModal = () => (
    <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            ¡Espera! No te vayas sin esto
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Antes de irte, déjame ofrecerte nuestra guía gratuita para encontrar tu certificación CONOCER ideal.
          </p>
          <LeadMagnetDisplay offer={leadMagnetOffers[0]} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4"
          onClick={() => setShowExitModal(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative">
      <ExitIntentModal />
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              Sistema de Orientación CONOCER
            </h1>
            <p className="text-muted-foreground text-sm">Tu Arquitecto de Trayectorias de Certificación con IA</p>
          </div>
          <div className="text-right">
            <div className="text-foreground text-sm mb-1">Progreso</div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-20 h-2" />
              <span className="text-muted-foreground text-sm font-medium">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`p-4 rounded-2xl shadow-sm border ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground border-primary/20'
                      : 'bg-card text-card-foreground border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.type === 'bot' && (
                      <Bot className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-6 w-6 mt-1 text-primary-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.standard && <StandardDisplay standard={message.standard} />}
                      {message.standards && <StandardsListDisplay standards={message.standards} />}
                      {message.leadMagnet && <LeadMagnetDisplay offer={message.leadMagnet} />}
                      
                      {message.suggestions && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Sugerencias rápidas:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs"
                              >
                                <Lightbulb className="h-3 w-3 mr-1" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card p-4 rounded-2xl max-w-[80%] shadow-sm border border-border">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-primary" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe tu perfil profesional o el área en la que te quieres certificar..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 min-h-[60px] resize-none bg-background"
                rows={2}
              />
              <Button 
                onClick={() => handleSendMessage()}
                className="self-end"
                size="lg"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Presiona Enter para enviar • Shift+Enter para nueva línea</span>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotExploracionPage;