import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

interface ProsCardProps {
  pros: string[];
}

export const ProsCard: React.FC<ProsCardProps> = ({ pros }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-6">
        <FiCheckCircle className="text-emerald-500 text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">Key Advantages</h3>
      </div>

      <ul className="space-y-4">
        {pros.map((pro, idx) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 + 0.3 }}
            key={idx}
            className="flex items-start gap-3"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-emerald-500 mt-0.5">
              <FiCheckCircle className="text-base font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
            </span>
            <span className="text-sm md:text-base text-[var(--text-color)] font-medium">
              {pro}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
