export type SignalCategory =
  | "ai"
  | "vr-ar"
  | "wearables"
  | "biotech"
  | "3d-printing"
  | "robotics"
  | "materials"
  | "spatial-computing"
  | "neurotech"
  | "other";

export type SignalStrength = "weak" | "emerging" | "strong";

export interface Signal {
  id: string;
  title: string;
  summary: string;
  why_emerging: string;
  brand_relevance: string;
  category: SignalCategory;
  strength: SignalStrength;
  sources: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  manual?: boolean;
  position?: { x: number; y: number };
}

export interface Report {
  id: string;
  title: string;
  brief: string;
  signal_ids: string[];
  content: string;
  created_at: string;
}
