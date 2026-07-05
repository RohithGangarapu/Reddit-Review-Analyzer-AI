import React from 'react';
import type { Message } from '../../types';
import { FaReddit, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Parser to convert newlines, bullets, and bold markers into styled nodes
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, lIdx) => {
      let content = line;
      let isBullet = false;

      // Handle simple lists starting with - or *
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        content = line.replace(/^[\s\-\*]+/, '');
        isBullet = true;
      }

      const parts = content.split(/(\*\*.*?\*\*)/g);
      const parsedElements = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-bold text-reddit-orange dark:text-orange-400">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-sm md:text-base leading-relaxed mb-1">
            {parsedElements}
          </li>
        );
      }

      return (
        <p key={lIdx} className="text-sm md:text-base leading-relaxed mb-2 last:mb-0 min-h-[1rem]">
          {parsedElements}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3.5 max-w-[85%] ${
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-white shadow-md ${
          isUser ? 'bg-[var(--text-color)]' : 'bg-reddit-orange'
        }`}
      >
        {isUser ? <FaUser className="text-xs" /> : <FaReddit className="text-sm" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`rounded-2xl px-4.5 py-3 border shadow-sm ${
          isUser
            ? 'bg-reddit-orange border-reddit-orange/20 text-white rounded-tr-none'
            : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-color)] rounded-tl-none'
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-60">
          {isUser ? 'You' : 'Reddit Intelligence'}
        </div>
        
        <div className="font-normal">
          {renderMessageContent(message.text)}
        </div>
      </div>
    </motion.div>
  );
};
