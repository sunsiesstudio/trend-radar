export interface Trend {
  id: string;
  name: string;
  description: string;
  color: string;
  relevanceScore: number;
  redditQuery: string;
  newsQuery: string;
  position: { x: number; y: number };
  whyRelevant: string;
  trajectory: string;
  nextSteps: string[];
  macroContext: string;
}

export interface Signal {
  id: string;
  trendId?: string;
  title: string;
  summary: string;
  source?: "reddit" | "news" | "youtube" | "arxiv" | "hackernews" | "manual";
  sourceName?: string;
  sourceUrl?: string;
  date?: string;
  crossLinks?: string[];
  isLive?: boolean;
  // legacy fields
  why_emerging?: string;
  brand_relevance?: string;
  category?: string;
  strength?: string;
  sources?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  manual?: boolean;
  image?: string;
  position?: { x: number; y: number };
}

export interface LiveSignal {
  title: string;
  url: string;
  source: string;
  summary?: string;
  date?: string;
}
