import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border-color)] py-8 mt-20 bg-[var(--bg-color)]/30 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All backend systems operational</span>
        </div>
        <span>© 2026 Reddit Review Analyzer. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-reddit-orange transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-reddit-orange transition-colors">Terms of Service</a>
          <a href="#contact" className="hover:text-reddit-orange transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
};
