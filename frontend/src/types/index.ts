export interface Comment {
  author: string;
  text: string;
  score: number | string;
  depth: number;
  created: string;
}

export interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  author: string;
  upvotes: number | string;
  comment_count: number | string;
  comments?: Comment[];
}

export interface ConsensusItem {
  product: string;
  score: number; // percentage value e.g., 92
  confidence: 'High' | 'Medium' | 'Low';
}

export interface Stats {
  postsAnalyzed: number;
  commentsRetrieved: number;
  embeddingCount: number;
  vectorMatches: number;
  processingTime: number; // in seconds
}

export interface AnalyzeResponse {
  query: string;
  summary: string;
  pros: string[];
  cons: string[];
  consensus: ConsensusItem[];
  sources: RedditPost[];
  stats: Stats;
  session_id: string;
}

export interface ChatResponse {
  answer: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
