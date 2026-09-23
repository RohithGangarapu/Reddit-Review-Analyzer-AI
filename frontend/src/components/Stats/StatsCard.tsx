import React from 'react';
import type { Stats } from '../../types';
import { motion } from 'framer-motion';
import { FiActivity, FiFileText, FiMessageSquare, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const metricItems = [
    {
      label: "Posts Analyzed",
      value: stats.postsAnalyzed,
      icon: FiFileText,
      color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20"
    },
    {
      label: "Comments Retrieved",
      value: stats.commentsRetrieved,
      icon: FiMessageSquare,
      color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20"
    },
    {
      label: "Processing Time",
      value: `${stats.processingTime}s`,
      icon: FiClock,
      color: "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-6">
        <FiActivity className="text-reddit-orange text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metricItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 + 0.5 }}
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] shadow-sm hover:border-reddit-orange/30 transition-all duration-300 group"
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${item.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="text-lg" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-[var(--text-color)] tracking-tight">
                {item.value}
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mt-1">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
