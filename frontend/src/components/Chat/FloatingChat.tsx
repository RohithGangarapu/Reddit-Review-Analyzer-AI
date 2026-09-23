import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { ChatWindow } from './ChatWindow';
import type { Message } from '../../types';

interface FloatingChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  sessionId: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-50 w-[90vw] sm:w-[450px] shadow-2xl origin-bottom-right"
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-[var(--bg-color)]/50 flex items-center justify-center text-[var(--text-color)] hover:bg-reddit-orange/20 transition-colors"
                title="Close Chat"
              >
                <FiX />
              </button>
              {/* Wrapping ChatWindow directly. It has its own padding and height. */}
              <div className="shadow-2xl rounded-2xl overflow-hidden border-2 border-[var(--border-color)]">
                <ChatWindow {...props} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-reddit-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(255,69,0,0.5)] hover:shadow-[0_15px_35px_rgba(255,69,0,0.6)] transition-all duration-300 border-4 border-[var(--bg-color)]"
        title="Chat with AI"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMessageSquare className="text-2xl" />}
      </motion.button>
    </>
  );
};
