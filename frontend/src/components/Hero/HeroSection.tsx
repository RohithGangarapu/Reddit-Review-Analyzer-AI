import React from 'react';
import { SearchBar } from '../Search/SearchBar';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isLoading }) => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden w-full">
      {/* Premium Floating Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-reddit-orange/10 blur-[80px] animate-pulse-glow" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[90px] animate-pulse-glow" style={{ animationDuration: '12s' }}></div>
      
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-reddit-orange/20 bg-reddit-orange/5 text-reddit-orange text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <span>✨ Powered by AI RAG Pipeline</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-sans text-4xl font-extrabold tracking-tight text-[var(--text-color)] sm:text-5xl md:text-6xl leading-[1.15]"
        >
          Understand Reddit <br />
          <span className="bg-gradient-to-r from-reddit-orange to-amber-500 bg-clip-text text-transparent">
            Without Reading
          </span> Thousands of Comments
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base md:text-xl text-[var(--text-secondary)] leading-relaxed"
        >
          Search Reddit discussions. Generate instant community consensus summaries. 
          Chat directly with aggregated comment knowledge in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-12 w-full flex justify-center"
        >
          <SearchBar onSearch={onSearch} isLoading={isLoading} />
        </motion.div>
      </div>
    </section>
  );
};
