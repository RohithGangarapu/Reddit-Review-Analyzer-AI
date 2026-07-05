import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

interface ConsCardProps {
  cons: string[];
}

export const ConsCard: React.FC<ConsCardProps> = ({ cons }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-6">
        <FiAlertCircle className="text-rose-500 text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">Common Tradeoffs</h3>
      </div>

      <ul className="space-y-4">
        {cons.map((con, idx) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 + 0.4 }}
            key={idx}
            className="flex items-start gap-3"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-rose-500 mt-0.5">
              <FiAlertCircle className="text-base font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]" />
            </span>
            <span className="text-sm md:text-base text-[var(--text-color)] font-medium">
              {con}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
