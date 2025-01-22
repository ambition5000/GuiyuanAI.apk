import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { Message } from './types';
import { aiService } from './services/ai';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const updateMessageStatus = (id: string, status: Message['status']) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, status } : msg
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      const response = await aiService.generateResponse(content);
      updateMessageStatus(userMessage.id, 'sent');

      if (response.error) {
        setError(response.error);
        return;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        status: 'sent',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('消息发送失败，请重试。');
      console.error('Error sending message:', err);
      updateMessageStatus(Date.now().toString(), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#343541]">
      {/* Header */}
      <header className="bg-[#202123] shadow-sm border-b border-[#4a4b53]">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="scale-in">
            <h1 className="text-lg font-semibold text-gray-100">GuiyuanAI</h1>
            <p className="text-xs text-gray-400">智能对话助手</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-gray-400 scale-in mt-20">
              <div className="rounded-full bg-blue-600/10 p-4 hover-scale">
                <Sparkles className="h-12 w-12 text-blue-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-200">欢迎使用 GuiyuanAI</p>
                <p className="text-sm text-gray-400">开始对话，探索AI的无限可能</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} index={index} />
              ))}
              {isLoading && (
                <div className="message-animation">
                  <TypingIndicator />
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-red-400 text-sm fade-in">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 rounded-lg bg-[#343541] p-4 border-t border-[#4a4b53]">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}