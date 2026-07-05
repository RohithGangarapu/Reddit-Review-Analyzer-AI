import React from 'react';
import type { ConsensusItem } from '../../types';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

interface ConsensusCardProps {
  consensus: ConsensusItem[];
}

export const ConsensusCard: React.FC<ConsensusCardProps> = ({ consensus }) => {
  const getConfidenceStyle = (confidence: 'High' | 'Medium' | 'Low') => {
    switch (confidence) {
      case 'High':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20';
      case 'Low':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-6">
        <FiTrendingUp className="text-reddit-orange text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">Community Consensus</h3>
      </div>

      <div className="space-y-6">
        {consensus.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--border-color)] text-xs font-bold text-[var(--text-color)]">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--text-color)] sm:text-base">
                  {item.product}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-reddit-orange">{item.score}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getConfidenceStyle(item.confidence)}`}>
                  {item.confidence}
                </span>
              </div>
            </div>

            {/* Horizontal progress bar */}
            <div className="h-2 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                className="h-full bg-reddit-orange rounded-full shadow-[0_0_8px_rgba(255,69,0,0.5)]"
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
