import { supabase } from '@/integrations/supabase/client';

export interface BusinessChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompanyInfo {
  name?: string;
  industry?: string;
  size?: string;
  contact?: string;
}

export interface BusinessChatbotResponse {
  message: string;
  sessionId: string;
  relevantStandards: Array<{
    code: string;
    title: string;
    description: string;
    category: string;
  }>;
  isQualifiedLead: boolean;
  context: {
    standardsFound: number;
    companyInfoComplete: boolean;
  };
}

export class BusinessChatbotService {
  private sessionId: string | null = null;
  private companyInfo: CompanyInfo = {};

  async sendMessage(message: string): Promise<BusinessChatbotResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('business-chatbot', {
        body: {
          message,
          sessionId: this.sessionId,
          companyInfo: this.companyInfo
        }
      });

      if (error) {
        console.error('Error calling business chatbot:', error);
        throw new Error('Error al procesar la consulta empresarial');
      }

      // Update session ID for conversation continuity
      if (data.sessionId) {
        this.sessionId = data.sessionId;
      }

      return data as BusinessChatbotResponse;
    } catch (error) {
      console.error('Error in business chatbot service:', error);
      throw new Error('Error al procesar la consulta empresarial');
    }
  }

  setCompanyInfo(info: Partial<CompanyInfo>): void {
    this.companyInfo = { ...this.companyInfo, ...info };
  }

  getCompanyInfo(): CompanyInfo {
    return this.companyInfo;
  }

  resetSession(): void {
    this.sessionId = null;
    this.companyInfo = {};
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isCompanyInfoComplete(): boolean {
    return !!(this.companyInfo.name && this.companyInfo.industry);
  }
}

// Export singleton instance
export const businessChatbot = new BusinessChatbotService();