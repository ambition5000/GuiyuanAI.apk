import { AIResponse, AIService } from '../types';

class AIModelService implements AIService {
  private readonly API_URL = 'YOUR_API_ENDPOINT';
  private readonly API_KEY = 'YOUR_API_KEY';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff(
    fn: () => Promise<Response>,
    retries: number = this.MAX_RETRIES
  ): Promise<Response> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await this.delay(this.RETRY_DELAY * (this.MAX_RETRIES - retries + 1));
      return this.retryWithBackoff(fn, retries - 1);
    }
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      const response = await this.retryWithBackoff(() => 
        fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`,
          },
          body: JSON.stringify({
            prompt,
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        })
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      return { content: data.choices[0].text.trim() };
    } catch (error) {
      console.error('AI service error:', error);
      return {
        content: '抱歉，我现在无法回答。请稍后再试。',
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}

export const aiService = new AIModelService();