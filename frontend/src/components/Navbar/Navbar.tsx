import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { FaReddit, FaGithub, FaCog } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--bg-color)]/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Container */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            {/* Glowing background behind logo */}
            <div className="absolute -inset-1 rounded-full bg-reddit-orange opacity-40 blur-md group-hover:opacity-60 transition duration-300 animate-pulse"></div>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-reddit-orange text-white shadow-lg">
              <FaReddit className="text-2xl animate-pulse-glow" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans text-lg font-bold tracking-tight text-[var(--text-color)] md:text-xl">
              Reddit Review Analyzer
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-reddit-orange md:text-xs">
              AI Community Intelligence
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <ThemeToggle />
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:border-reddit-orange hover:text-reddit-orange transition-all duration-300 shadow-sm"
            aria-label="GitHub Repository"
            id="github-btn"
          >
            <FaGithub className="text-xl" />
          </a>

          <button
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:border-reddit-orange hover:text-reddit-orange transition-all duration-300 shadow-sm"
            aria-label="Settings"
            id="settings-btn"
          >
            <FaCog className="text-xl" />
          </button>
        </div>
      </div>

      {/* Settings Modal (Placeholder) */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl"
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close settings"
              >
                <FiX className="text-xl" />
              </button>
              
              <h3 className="text-lg font-bold text-[var(--text-color)]">System Settings</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Customize your API keys and scraper parameters. (Mock Settings Panel)
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Reddit Client ID
                  </label>
                  <input
                    type="password"
                    disabled
                    value="••••••••••••••••••••"
                    className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-2 text-sm text-[var(--text-secondary)] opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    disabled
                    value="••••••••••••••••••••"
                    className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-2 text-sm text-[var(--text-secondary)] opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="rounded-lg bg-reddit-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
