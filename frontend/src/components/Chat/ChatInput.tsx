import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl p-1.5 focus-within:border-reddit-orange focus-within:ring-2 focus-within:ring-reddit-orange/10 transition-all duration-300"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask follow-up questions about Reddit discussions..."
        className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-color)] placeholder-[var(--text-secondary)] focus:outline-none"
        disabled={disabled}
        aria-label="Ask follow-up question"
        id="chat-input-field"
      />
      
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
          text.trim() && !disabled
            ? 'bg-reddit-orange text-white hover:bg-orange-600 shadow-md hover:-translate-y-0.5 active:translate-y-0'
            : 'bg-transparent text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 cursor-not-allowed'
        }`}
        id="chat-send-btn"
      >
        <FiSend className="text-sm" />
      </button>
    </form>
  );
};
