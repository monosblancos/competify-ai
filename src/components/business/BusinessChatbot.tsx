import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Send, MessageCircle, Building2, Users, Phone, Sparkles, TrendingUp } from 'lucide-react';
import { businessChatbot, BusinessChatMessage } from '@/services/businessChatbotService';

interface BusinessChatbotProps {
  companyInfo?: {
    name?: string;
    industry?: string;
    size?: string;
    contact?: string;
  };
}

const BusinessChatbot: React.FC<BusinessChatbotProps> = ({ companyInfo }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<BusinessChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isQualifiedLead, setIsQualifiedLead] = useState(false);
  const [relevantStandards, setRelevantStandards] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (companyInfo) {
      businessChatbot.setCompanyInfo(companyInfo);
    }
  }, [companyInfo]);

  useEffect(() => {
    // Add welcome message when chatbot opens
    if (isOpen && messages.length === 0) {
      const welcomeMessage: BusinessChatMessage = {
        role: 'assistant',
        content: `¡Hola! Soy tu consultor especializado en certificaciones empresariales. 

Estoy aquí para ayudarte a:
🎯 Identificar certificaciones que impulsen tu productividad
📈 Calcular el ROI de la capacitación certificada  
🏆 Desarrollar estrategias de talento competitivo
⚡ Optimizar procesos con personal certificado

${companyInfo?.name ? `Veo que representas a ${companyInfo.name}. ` : ''}¿Qué desafío de talento o competencias quieres resolver en tu empresa?`
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, companyInfo]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: BusinessChatMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await businessChatbot.sendMessage(inputMessage);
      
      const assistantMessage: BusinessChatMessage = {
        role: 'assistant',
        content: response.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsQualifiedLead(response.isQualifiedLead);
      setRelevantStandards(response.relevantStandards);

      if (response.isQualifiedLead) {
        toast({
          title: "Lead Cualificado Detectado",
          description: "Este contacto muestra interés real en nuestros servicios",
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar tu consulta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "¿Qué certificaciones necesita mi equipo de IT?",
    "¿Cómo puedo reducir costos con personal certificado?",
    "¿Cuál es el ROI de certificar a mis empleados?",
    "Necesito mejorar la productividad de mi equipo"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap animate-pulse">
          💼 Consultor IA disponible
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[600px] shadow-2xl border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle className="text-lg">Consultor Empresarial IA</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              ✕
            </Button>
          </div>
          {isQualifiedLead && (
            <Badge className="bg-green-500 text-white w-fit">
              <TrendingUp className="h-3 w-3 mr-1" />
              Lead Cualificado
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              
              {relevantStandards.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Certificaciones Recomendadas:
                  </div>
                  <div className="space-y-2">
                    {relevantStandards.slice(0, 3).map((standard, index) => (
                      <div key={index} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                        <div className="font-medium">{standard.code}: {standard.title}</div>
                        <div className="text-muted-foreground">{standard.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Analizando tu consulta...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {messages.length <= 1 && (
            <>
              <Separator />
              <div className="p-3 bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Preguntas frecuentes:
                </div>
                <div className="space-y-1">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs text-left w-full p-2 hover:bg-muted rounded border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe tu desafío empresarial..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessChatbot;