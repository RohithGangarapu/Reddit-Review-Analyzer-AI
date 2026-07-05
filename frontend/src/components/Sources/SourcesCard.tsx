import React, { useState } from 'react';
import type { RedditPost } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReddit, FaExternalLinkAlt, FaChevronDown } from 'react-icons/fa';
import { FiThumbsUp, FiMessageSquare } from 'react-icons/fi';

interface SourcesCardProps {
  sources: RedditPost[];
}

export const SourcesCard: React.FC<SourcesCardProps> = ({ sources }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-6">
        <FaReddit className="text-reddit-orange text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-color)]">Aggregated Reddit Sources</h3>
      </div>

      <div className="space-y-4">
        {sources.map((post, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="border border-[var(--border-color)] bg-[var(--bg-color)] rounded-xl overflow-hidden shadow-sm hover:border-reddit-orange/20 transition-colors duration-250"
            >
              {/* Header Accordion Bar */}
              <div
                onClick={() => toggleExpand(idx)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-reddit-orange">
                    r/{post.subreddit}
                  </span>
                  <h4 className="text-sm md:text-base font-bold text-[var(--text-color)] leading-tight truncate mt-1">
                    {post.title}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[var(--text-secondary)] font-medium">
                    <span>u/{post.author}</span>
                    <span className="flex items-center gap-1">
                      <FiThumbsUp /> {post.upvotes} upvotes
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMessageSquare /> {post.comment_count} comments
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // prevent expanding
                    className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:bg-reddit-orange hover:text-white transition-colors duration-200"
                    title="Open original Reddit link"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                  <div
                    className={`p-2 text-[var(--text-secondary)] transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-reddit-orange' : ''
                    }`}
                  >
                    <FaChevronDown className="text-sm" />
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-[var(--card-bg)]/30 border-t border-[var(--border-color)]"
                  >
                    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2">
                        Top Community Discussions ({post.comments?.length || 0})
                      </h5>
                      
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-4">
                          {post.comments.map((comment, commentIdx) => (
                            <div
                              key={commentIdx}
                              className="relative pl-4 border-l-2 border-reddit-orange/20 hover:border-reddit-orange/40 transition-colors py-1"
                              style={{ marginLeft: `${comment.depth * 12}px` }}
                            >
                              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold">
                                <span className="text-reddit-orange/90">u/{comment.author}</span>
                                <span className="flex items-center gap-1">
                                  <FiThumbsUp /> {comment.score}
                                </span>
                              </div>
                              <p className="text-xs md:text-sm text-[var(--text-color)] mt-1.5 leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--text-secondary)] italic text-center py-4">
                          No comments extracted for this thread.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
