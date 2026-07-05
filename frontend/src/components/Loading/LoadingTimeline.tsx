import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiSearch, FiLayers, FiMessageSquare, FiCpu, FiDatabase, FiFileText } from 'react-icons/fi';

interface LoadingTimelineProps {
  currentStep: number;
}

const steps = [
  { label: "Searching Reddit...", icon: FiSearch },
  { label: "Collecting Posts...", icon: FiLayers },
  { label: "Collecting Comments...", icon: FiMessageSquare },
  { label: "Generating Embeddings...", icon: FiCpu },
  { label: "Searching Vector Database...", icon: FiDatabase },
  { label: "Generating AI Summary...", icon: FiFileText }
];

export const LoadingTimeline: React.FC<LoadingTimelineProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Soft floating background orb */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-reddit-orange/5 blur-2xl"></div>

        <div className="flex flex-col items-center mb-8">
          <h3 className="text-xl font-bold text-[var(--text-color)] text-center">
            Processing Discussion Graph
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 text-center">
            Scraping comments, computing vector models, and summarizing consensus...
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-8 space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div key={idx} className="relative flex items-center gap-4 group">
                {/* Step Connector Highlight */}
                {isCompleted && (
                  <div className="absolute left-[-23px] top-2 bottom-[-32px] w-0.5 bg-emerald-500 z-10 origin-top"></div>
                )}

                {/* Timeline Node */}
                <div className="absolute left-[-31px] z-20">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
                    >
                      <FiCheck className="text-lg font-bold" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="relative flex h-9 w-9 items-center justify-center">
                      {/* Radiating pulse ring */}
                      <span className="absolute inline-flex h-full w-full rounded-full bg-reddit-orange/30 animate-ping"></span>
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-reddit-orange text-white shadow-lg border-2 border-white dark:border-[var(--bg-color)] z-20"
                      >
                        <Icon className="text-base animate-pulse" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-secondary)] shadow-sm">
                      <Icon className="text-base" />
                    </div>
                  )}
                </div>

                {/* Step Text details */}
                <div className="flex-1 pl-4">
                  <span
                    className={`font-semibold transition-all duration-300 ${
                      isActive
                        ? 'text-reddit-orange text-base'
                        : isCompleted
                        ? 'text-[var(--text-color)] text-sm opacity-80'
                        : 'text-[var(--text-secondary)] text-sm opacity-60'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-[var(--text-secondary)] font-normal mt-0.5"
                    >
                      Analyzing text nodes...
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
