import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RAGChatbotResponse {
  message: string;
  sessionId: string;
  relevantStandards: Array<{
    code: string;
    title: string;
    description: string;
    category: string;
    similarity: number;
  }>;
  context: {
    standardsFound: number;
    searchQuery: string;
  };
}

export class RAGChatbotService {
  private sessionId: string | null = null;

  async sendMessage(message: string): Promise<RAGChatbotResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('rag-chatbot', {
        body: {
          message,
          sessionId: this.sessionId
        }
      });

      if (error) {
        console.error('Error calling RAG chatbot:', error);
        throw new Error('Error al procesar la consulta');
      }

      // Update session ID for conversation continuity
      if (data.sessionId) {
        this.sessionId = data.sessionId;
      }

      return data as RAGChatbotResponse;
    } catch (error) {
      console.error('Error in RAG chatbot service:', error);
      throw new Error('Error al procesar la consulta con IA');
    }
  }

  async generateEmbeddings(): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings');

      if (error) {
        console.error('Error generating embeddings:', error);
        throw new Error('Error al generar embeddings');
      }

      console.log('Embeddings generation result:', data);
    } catch (error) {
      console.error('Error in embeddings generation:', error);
      throw new Error('Error al generar embeddings para los estándares');
    }
  }

  resetSession(): void {
    this.sessionId = null;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Export singleton instance
export const ragChatbot = new RAGChatbotService();