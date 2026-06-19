export interface Trend {
  id: string;
  name: string;
  description: string;
  color: string;
  relevanceScore: number; // 0-100 → determines node size
  redditQuery: string;
  newsQuery: string;
  position: { x: number; y: number }; // top-left of bounding box used by buildGraph
  whyRelevant: string;
  trajectory: string;
  nextSteps: string[];
  topics?: string[]; // topic tags for filtering (e.g. "fashion", "beauty", "gaming")
  historicalContext?: string;
  economicContext?: string;
  macroContext?: string;
  socialContext?: string;
  politicalContext?: string;
  geographicalContext?: string;
  culturalContext?: string;
  brandMoves?: string[];
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
  crossLinks?: string[]; // signal IDs from OTHER trends this connects to
  isLive?: boolean;
  // legacy fields (old canvas/feed/reports pages)
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
