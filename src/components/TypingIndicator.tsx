import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 float-in">
      <div className="typing-indicator bg-[#40414f] rounded-full px-4 py-2 shadow-sm hover-scale">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}