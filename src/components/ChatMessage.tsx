import React from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={`flex gap-3 message-animation ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'} py-6 px-4`}
      style={{ 
        animationDelay: `${index * 150}ms`,
        willChange: 'transform, opacity'
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl items-start gap-4">
        <div 
          className={`
            flex h-8 w-8 shrink-0 select-none items-center justify-center 
            rounded-md shadow-transition
            hover:scale-110 hover:shadow-md
            ${isUser ? 'bg-blue-600' : 'bg-green-600'}
            ${message.status === 'error' ? 'bg-red-500' : ''}
            smooth-transition
          `}
        >
          {isUser ? (
            message.status === 'error' ? (
              <AlertCircle className="h-5 w-5 text-white transition-transform duration-200" />
            ) : (
              <User className="h-5 w-5 text-white transition-transform duration-200" />
            )
          ) : (
            <Bot className="h-5 w-5 text-white transition-transform duration-200" />
          )}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="prose prose-invert max-w-none">
            {message.content}
          </div>
          <div className="text-xs text-gray-400 fade-in">
            {message.timestamp.toLocaleTimeString()}
            {message.status === 'sending' && ' • 发送中...'}
            {message.status === 'error' && ' • 发送失败'}
          </div>
        </div>
      </div>
    </div>
  );
}