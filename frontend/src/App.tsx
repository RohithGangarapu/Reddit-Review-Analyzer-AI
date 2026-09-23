import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { HeroSection } from './components/Hero/HeroSection';
import { SearchBar } from './components/Search/SearchBar';
import { LoadingTimeline } from './components/Loading/LoadingTimeline';
import { SummaryCard } from './components/Summary/SummaryCard';
import { ConsensusCard } from './components/Consensus/ConsensusCard';
import { ProsCard } from './components/Pros/ProsCard';
import { ConsCard } from './components/Cons/ConsCard';
import { StatsCard } from './components/Stats/StatsCard';
import { SourcesCard } from './components/Sources/SourcesCard';
import { FloatingChat } from './components/Chat/FloatingChat';
import { Footer } from './components/Footer/Footer';
import type { AnalyzeResponse, Message } from './types';
import { analyzeQuery, chatWithKnowledge } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

export const App: React.FC = () => {
  // Application Views States
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // UI feedback States
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Trigger toast alert
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Track page scroll to toggle float-to-top FAB
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform search query analyze pipeline
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    setLoadingStep(0);
    setResult(null);
    setChatMessages([]); // Reset chat logs for new topics

    try {
      const data = await analyzeQuery(searchQuery, (step) => {
        setLoadingStep(step);
      });
      setResult(data);
      
      // Auto-scroll to top when results load
      setTimeout(() => scrollToTop(), 100);
    } catch (err: any) {
      showToast(err?.message || "Failed to process Reddit discussions. Please verify your scraper connection.");
    } finally {
      setLoading(false);
    }
  };

  // Send RAG chat questions
  const handleSendChatMessage = async (text: string) => {
    if (!result) return;
    
    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const response = await chatWithKnowledge(result.session_id, text);
      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      showToast(err?.message || "Chat agent could not formulate an answer. Retrying...");
    } finally {
      setChatLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] font-sans transition-colors duration-300 relative">
      <Navbar />

      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Render View: Initial Hero Landing */}
        {!loading && !result && (
          <HeroSection onSearch={handleSearch} isLoading={loading} />
        )}

        {/* Render View: Timeline Load Screen */}
        {loading && (
          <div className="py-16 md:py-24 flex items-center justify-center">
            <LoadingTimeline currentStep={loadingStep} />
          </div>
        )}

        {/* Render View: Results Dashboard */}
        {!loading && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 py-6"
          >
            {/* Top Search bar interface */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:border-reddit-orange hover:text-reddit-orange transition-all duration-300 shadow-sm"
                  title="Go Back to Search"
                  id="back-to-search-btn"
                >
                  <FiArrowLeft className="text-lg" />
                </button>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-color)]">
                    Analysis Results
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    Topic: <span className="text-reddit-orange">"{result.query}"</span>
                  </p>
                </div>
              </div>

              {/* Subdued Inline SearchBar */}
              <div className="w-full md:max-w-md">
                <SearchBar onSearch={handleSearch} isLoading={loading} initialValue={query} />
              </div>
            </div>

            {/* Clean, modular layout stack */}
            <div className="space-y-8">
              {/* 1. Summary Card - Full Width */}
              <SummaryCard summary={result.summary} query={result.query} />
              
              {/* 2. Pros and Cons - Side-by-Side Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProsCard pros={result.pros} />
                <ConsCard cons={result.cons} />
              </div>

              {/* 3. Consensus Data - Full Width */}
              <ConsensusCard consensus={result.consensus} />

              {/* 4. Aggregated Sources & Performance Metrics */}
              <SourcesCard sources={result.sources} />
              <StatsCard stats={result.stats} />
            </div>

            {/* Interactive Floating Chat AI Bot */}
            <FloatingChat
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isLoading={chatLoading}
              sessionId={result.session_id}
            />
          </motion.div>
        )}
      </main>

      <Footer />

      {/* Interactive Floating Action Buttons (FABs) */}
      
      {/* Back to top scroll button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--card-bg)] text-[var(--text-color)] border border-[var(--border-color)] shadow-lg hover:border-reddit-orange transition-all duration-200"
            title="Scroll to Top"
            id="scroll-to-top-btn"
          >
            <FiArrowUp className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating error/success Toast feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 border shadow-2xl ${
              toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
            }`}
          >
            <FiAlertTriangle className="text-lg shrink-0" />
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
