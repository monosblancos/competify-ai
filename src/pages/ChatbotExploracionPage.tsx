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
  technique?: TechniqueCard;
  leadMagnet?: LeadMagnetOffer;
}

interface TechniqueCard {
  title: string;
  category: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  groupSize: string;
  rating: number;
  tags: string[];
  description: string;
  usageCount: number;
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
}

const ChatbotExploracionPage: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! 👋 Soy tu Coach de Facilitación IA. Tengo acceso a más de 150 técnicas profesionales para ayudarte a facilitar sesiones exitosas. ¿Qué tipo de facilitación necesitas hoy?',
      timestamp: new Date(),
      suggestions: [
        'Necesito técnicas de brainstorming',
        '¿Cómo energizar mi equipo?',
        'Técnicas para tomar decisiones',
        'Ideas para abrir una reunión'
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

  const techniques: TechniqueCard[] = [
    {
      title: 'Velocidad de la Energía',
      category: 'Energizante',
      level: 'Principiante',
      duration: '3-5 min',
      groupSize: '5-100 personas',
      rating: 4.5,
      tags: ['energía', 'movimiento', 'concentración', 'activación'],
      description: 'Activador físico que incrementa energía y concentración del grupo',
      usageCount: 1156
    },
    {
      title: 'Tormenta de Ideas Visual',
      category: 'Brainstorming',
      level: 'Intermedio',
      duration: '20-30 min',
      groupSize: '3-20 personas',
      rating: 4.75,
      tags: ['creatividad', 'visual', 'ideas', 'innovación'],
      description: 'Generar ideas usando objetos y representaciones visuales para estimular creatividad',
      usageCount: 834
    },
    {
      title: 'Storytelling Colaborativo',
      category: 'Colaboración',
      level: 'Intermedio',
      duration: '25-40 min',
      groupSize: '6-20 personas',
      rating: 4.6,
      tags: ['narrativa', 'visión compartida', 'creatividad', 'integración'],
      description: 'Crear narrativas grupales que integren perspectivas diversas y generen visión compartida',
      usageCount: 445
    }
  ];

  const leadMagnetOffers: LeadMagnetOffer[] = [
    {
      title: '🎁 Manual Completo de Facilitación',
      subtitle: '150+ técnicas profesionales con descuento especial',
      originalPrice: 67,
      currentPrice: 47,
      discount: '30% OFF',
      features: [
        '150+ Técnicas Profesionales',
        'Guías Paso a Paso',
        'Casos de Estudio Reales',
        'Adaptaciones por Contexto'
      ],
      urgency: 'Esta oferta expira en: 14:56',
      cta: 'Descargar Manual'
    },
    {
      title: '🚀 Certificación CONOCER EC0217',
      subtitle: 'Impartir cursos de capacitación presenciales grupales',
      originalPrice: 2500,
      currentPrice: 1875,
      discount: '25% OFF',
      features: [
        'Certificación Oficial CONOCER',
        'Validez Nacional e Internacional',
        'Material Didáctico Completo',
        'Seguimiento Personalizado'
      ],
      urgency: 'Últimos cupos disponibles',
      cta: 'Inscribirme Ahora'
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
    if (messages.length > 5 && (lowerInput.includes('técnica') || lowerInput.includes('manual') || lowerInput.includes('guía'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Perfecto! Veo que necesitas técnicas especializadas. Tengo exactamente lo que buscas.',
        timestamp: new Date(),
        leadMagnet: leadMagnetOffers[0],
        suggestions: ['¿Tienes más técnicas?', 'Me interesa la certificación', 'Quiero contacto personalizado']
      };
    }

    if (lowerInput.includes('brainstorm') || lowerInput.includes('ideas') || lowerInput.includes('creatividad')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Excelente! Para generar ideas innovadoras, te recomiendo esta técnica probada:',
        timestamp: new Date(),
        technique: techniques[1],
        suggestions: ['¿Cómo energizar mi equipo?', 'Técnicas para tomar decisiones', 'Ver más técnicas de creatividad']
      };
    }

    if (lowerInput.includes('energía') || lowerInput.includes('motivar') || lowerInput.includes('activar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Perfecto para activar a tu equipo! Esta técnica es ideal para incrementar la energía:',
        timestamp: new Date(),
        technique: techniques[0],
        suggestions: ['Técnicas para mantener atención', 'Ideas para abrir una reunión', 'Técnicas de concentración']
      };
    }

    if (messages.length > 5 && (lowerInput.includes('certificación') || lowerInput.includes('certificar') || lowerInput.includes('conocer'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '¡Excelente decisión! La certificación CONOCER te abrirá nuevas oportunidades profesionales.',
        timestamp: new Date(),
        leadMagnet: leadMagnetOffers[1],
        suggestions: ['¿Qué beneficios tiene?', 'Quiero más información', 'Contacto personalizado']
      };
    }

    // Show related standards if found
    if (standards.length > 0) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `¡Excelente! Encontré ${standards.length} estándares relacionados con tu consulta. Estos podrían ser perfectos para tu desarrollo profesional:`,
        timestamp: new Date(),
        suggestions: standards.map(s => `Ver ${s.code}: ${s.title.substring(0, 30)}...`)
      };
    }

    // Default responses with technique suggestions
    const responses = [
      {
        content: '¡Genial! Para esa situación, te sugiero esta técnica colaborativa:',
        technique: techniques[2]
      },
      {
        content: 'Te entiendo perfectamente. Aquí tienes una técnica muy efectiva:',
        technique: techniques[0]
      },
      {
        content: '¡Esa es una excelente pregunta! Te comparto esta técnica especializada:',
        technique: techniques[1]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      technique: randomResponse.technique,
      suggestions: [
        'Necesito más técnicas como esta',
        'Buscar estándares relacionados',
        'Me interesa certificarme',
        'Contacto personalizado'
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

  const TechniqueDisplay: React.FC<{ technique: TechniqueCard }> = ({ technique }) => (
    <Card className="mt-4 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{technique.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{technique.level}</Badge>
              <Badge variant="outline">{technique.category}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-4">{technique.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technique.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{technique.groupSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm">{technique.rating}/5</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {technique.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Usada {technique.usageCount} veces por facilitadores
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Ver Detalles
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Usar Técnica
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
            Antes de irte, déjame ofrecerte nuestro manual completo con más de 150 técnicas profesionales.
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
              Coach de Facilitación IA
            </h1>
            <p className="text-muted-foreground text-sm">Tu asistente experto en técnicas de facilitación</p>
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
                      
                      {message.technique && <TechniqueDisplay technique={message.technique} />}
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
                placeholder="Describe tu situación o el tipo de técnica que necesitas..."
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