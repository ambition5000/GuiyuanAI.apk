export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatHistory {
  messages: Message[];
}

export interface AIResponse {
  content: string;
  error?: string;
}

export interface AIService {
  generateResponse(prompt: string): Promise<AIResponse>;
}