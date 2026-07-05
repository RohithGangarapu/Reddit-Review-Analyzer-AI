import React, { useState, useEffect } from 'react';
import { FiSearch, FiCommand } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Focus search box with Cmd + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    "best sunscreens for mid oil skin",
    "Best laptop for AI",
    "mechanical keyboard under $100"
  ];

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-4 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex items-center"
      >
        <div className="absolute left-4 text-[var(--text-secondary)] text-xl">
          <FiSearch />
        </div>
        
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like Reddit to answer today?"
          className="w-full h-14 pl-12 pr-28 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)]/80 text-[var(--text-color)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-reddit-orange focus:ring-2 focus:ring-reddit-orange/10 transition-all duration-300 shadow-sm text-base md:text-lg backdrop-blur-sm"
          disabled={isLoading}
          aria-label="Reddit Query Search"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {/* Keyboard shortcut label, hidden on mobile */}
          <div className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-color)] text-xs text-[var(--text-secondary)]">
            <FiCommand className="text-[10px]" />
            <span>K</span>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`h-9 px-4 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md ${
              query.trim() && !isLoading
                ? 'bg-reddit-orange text-white hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed'
            }`}
            id="analyze-submit-btn"
          >
            Analyze
          </button>
        </div>
      </form>

      {/* Suggested Search Terms */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        <span className="text-xs text-[var(--text-secondary)] font-medium">Try searching:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => !isLoading && onSearch(suggestion)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:border-reddit-orange hover:bg-reddit-orange/5 transition-all duration-200"
          >
            "{suggestion}"
          </button>
        ))}
      </div>
    </div>
  );
};
