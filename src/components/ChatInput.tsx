import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="输入您的问题..."
        disabled={disabled}
        className={`
          flex-1 rounded-lg bg-[#40414f] border border-[#4a4b53] px-4 py-3 
          text-white placeholder-gray-400
          transition-all duration-300 ease-out
          hover:border-[#8e8ea0] 
          ${isFocused ? 'focus-ring border-blue-500 outline-none' : ''}
          disabled:opacity-50
          smooth-transition
        `}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`
          flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 
          text-white shadow-transition button-press
          hover:bg-blue-700 hover:shadow-lg 
          disabled:opacity-50 disabled:cursor-not-allowed
          hover-scale
        `}
      >
        <Send className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-110" />
      </button>
    </form>
  );
}