import React, { useEffect, useRef } from 'react';
import type { Message } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  sessionId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  sessionId
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isSunscreen = sessionId.includes('sunscreen');
  const isLaptop = sessionId.includes('laptop');

  const suggestedQuestions = isSunscreen
    ? ["Which one has best cooling?", "Is there a white cast?", "Which is cheapest?"]
    : isLaptop
    ? ["Which one has best cooling?", "How much VRAM does 70B need?", "Is MacBook good for training?"]
    : ["Summarize the tradeoffs", "Which option is the best value?"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col h-[550px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-4">
        <FiMessageSquare className="text-reddit-orange text-xl" />
        <div>
          <h3 className="text-lg font-bold text-[var(--text-color)]">
            Chat with Reddit Knowledge
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Ask follow-up questions grounded entirely in aggregated discussion comment streams
          </p>
        </div>
      </div>

      {/* Messages Scrolling Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 select-text">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-reddit-orange/10 flex items-center justify-center text-reddit-orange mb-3">
              <FiMessageSquare className="text-xl" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-color)]">
              Start a Conversation
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
              Ask follow-up questions or explore comparisons. The AI will answer utilizing the retrieved comments.
            </p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-[80%]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-reddit-orange text-white shadow-md">
              <span className="text-xs font-semibold">AI</span>
            </div>
            <div className="rounded-2xl rounded-tl-none border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
              <span className="h-2 w-2 rounded-full bg-reddit-orange/80 dot-bounce-1"></span>
              <span className="h-2 w-2 rounded-full bg-reddit-orange/80 dot-bounce-2"></span>
              <span className="h-2 w-2 rounded-full bg-reddit-orange/80 dot-bounce-3"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Follow-up Questions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs text-[var(--text-secondary)] font-semibold">Suggested questions:</span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => !isLoading && onSendMessage(q)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:border-reddit-orange hover:bg-reddit-orange/5 transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Sticky Bottom Input */}
      <div className="mt-auto">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </motion.div>
  );
};
