"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  NodeProps,
  NodeMouseHandler,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { TRENDS, SIGNALS, RADAR_OVERVIEW } from "@/lib/trends";
import { TOPIC_LIBRARY, TOPIC_COLORS, EXTENDED_SIGNALS, normaliseTopicKey, LIBRARY_TOPICS, FEATURED_TOPICS, TOPIC_DESCRIPTIONS } from "@/lib/extended-trends";
import { Trend, Signal } from "@/types";

import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";
import { CultureMap } from "@/components/map/CultureMap";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE_D = 164;
const ORBIT_R  = 160;
const SIG_W    = 158;
const SIG_H    = 44;



function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

// Darkening factor for a trend blob based on age of its freshest signal.
// New (0 days) → factor 0.78 (bright). 30+ days → factor 0.50 (dark). Linear in between.
function blobAgeFactor(latestDate?: string): number {
  const ageDays = latestDate ? (Date.now() - new Date(latestDate).getTime()) / 86_400_000 : 30;
  const t = Math.min(1, Math.max(0, ageDays / 30));
  return 0.78 - t * 0.28;
}

// Returns a darkened version of hex that meets WCAG AA (4.5:1) against white.
function accessibleTextColor(hex: string): string {
  const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (h: string) => 0.2126 * lin(parseInt(h.slice(1,3),16)) + 0.7152 * lin(parseInt(h.slice(3,5),16)) + 0.0722 * lin(parseInt(h.slice(5,7),16));
  let f = 1.0;
  while (1.05 / (lum(darkenColor(hex, f)) + 0.05) < 4.5 && f > 0.05) f -= 0.02;
  return darkenColor(hex, f);
}

// Grid for dynamically added trends — 3 columns, 760 px apart.
// A large trend blob + full signal orbit extends ~180 px from center,
// so 760 px between centers gives ~400 px clear gap between adjacent orbits.
function computeTrendPosition(idx: number): { x: number; y: number } {
  return { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
}

// 20-color palette — distinct enough that no two adjacent blobs clash.
const BOARD_PALETTE = [
  "#FF8BB4", "#FD8326", "#8C93C7", "#B6D693", "#FFD65C",
  "#53A373", "#78C9A8", "#C4A0CE", "#FFB04A", "#A7D47C",
  "#F4A4C0", "#E88B5A", "#9B8FCE", "#94C472", "#EFC54E",
  "#4A9368", "#6BB9A0", "#B490BE", "#FFA03A", "#95C468",
];

// Assign palette colors in order so no two trends on the same board share a color.
// Input must already be sorted in visual display order (relevance DESC).
function assignUniqueColors(trends: Trend[]): Trend[] {
  const used = new Set<string>();
  return trends.map((t, i) => {
    let color = BOARD_PALETTE[i % BOARD_PALETTE.length];
    if (used.has(color)) {
      const fresh = BOARD_PALETTE.find(c => !used.has(c));
      if (fresh) color = fresh;
    }
    used.add(color);
    return { ...t, color };
  });
}

const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 368,  y: 168  },
  "longevity":              { x: 948,  y: 168  },
  "ar-commerce":            { x: 1528, y: 168  },
  "biotech-beauty":         { x: -32,  y: 768  },
  "digital-identity":       { x: 548,  y: 768  },
  "sustainable-materials":  { x: 1128, y: 768  },
  "wearables":              { x: 1708, y: 768  },
  "neurotech":              { x: 168,  y: 1368 },
  "spatial-computing":      { x: 748,  y: 1368 },
  "3d-printing":            { x: 1328, y: 1368 },
};

// ─── Seen-signal tracking (localStorage) ─────────────────────────────────────

const SEEN_KEY = "tr-seen-v1";

function loadSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function saveSeen(ids: Set<string>) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...ids])); } catch {}
}

// ─── Node types ───────────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number; newCount: number; d: number; latestDate?: string };
type SignalNodeData = { id: string; title: string; color: string; source?: string; isLive?: boolean; isNew?: boolean; w: number; h: number; fillAlpha: string; borderAlpha: string };

// Newer signals are lighter; older signals are darker.
// 0 days → ~18% fill, 30 days → ~39%, 90 days → ~59%, 180 days (6 mo) → ~80%.
// Power curve (0.6 exponent) keeps fresh signals visually similar;
// darkening accelerates toward the 6-month cap, staying below full-opacity trend blobs.
function ageAlpha(date: string | undefined): { fillAlpha: string; borderAlpha: string } {
  const ageDays = date ? (Date.now() - new Date(date).getTime()) / 86_400_000 : 30;
  const t = Math.pow(Math.min(1, Math.max(0, ageDays / 180)), 0.6);
  const fill   = Math.round(0x2E + t * (0xCC - 0x2E));
  const border = Math.round(0x44 + t * (0xDD - 0x44));
  return {
    fillAlpha:   fill.toString(16).padStart(2, "0"),
    borderAlpha: border.toString(16).padStart(2, "0"),
  };
}

function blobFromId(id: string): string {
  // FNV-1a forward pass
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  // Avalanche so single-char differences (signal-1 vs signal-2) scatter all bits
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b) >>> 0; h ^= h >>> 16;
  // Second independent pass (reverse order + different seed)
  let g = 0x811c9dc5 ^ id.length;
  for (let i = id.length - 1; i >= 0; i--) { g ^= id.charCodeAt(i); g = Math.imul(g, 0x01000193) >>> 0; }
  g ^= g >>> 16; g = Math.imul(g, 0x45d9f3b) >>> 0; g ^= g >>> 16;
  const v = (seed: number) => 28 + (seed % 52);
  return `${v(h & 0xff)}% ${v((h >> 8) & 0xff)}% ${v((h >> 16) & 0xff)}% ${v((h >>> 24) & 0xff)}% / ${v(g & 0xff)}% ${v((g >> 8) & 0xff)}% ${v((g >> 16) & 0xff)}% ${v((g >>> 24) & 0xff)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const blobColor = darkenColor(data.color, blobAgeFactor(data.latestDate));
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        width: data.d, height: data.d,
        borderRadius: blobFromId(data.id),
        background: blobColor,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 22,
        boxSizing: "border-box", cursor: "pointer", userSelect: "none",
        boxShadow: `0 6px 32px ${data.color}66`,
      }}>
        <div style={{ fontSize: Math.round(9 + data.d / 30), fontWeight: 700, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.02em", fontFamily: "'EB Garamond', Georgia, serif" }}>
          {data.name}
        </div>
        <div style={{ marginTop: 5, fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {data.score}%
        </div>
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div style={{
      width: data.w,
      height: data.h,
      background: `${data.color}${data.fillAlpha}`,
      border: `1.5px solid ${data.color}${data.borderAlpha}`,
      borderRadius: blobFromId(data.id),
      padding: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center",
      cursor: "pointer", userSelect: "none",
      boxSizing: "border-box",
      boxShadow: data.isNew ? `0 3px 18px ${data.color}55` : `0 1px 10px ${data.color}22`,
      position: "relative",
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "#000", lineHeight: 1.35, letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(extraSignals: Signal[], seenIds: Set<string>, visibleTrends: Trend[], topicAddedAt: Record<string, string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...EXTENDED_SIGNALS, ...extraSignals];

  const GAP = 5;
  // 16 evenly-spaced angle probes per radius level (22.5° steps around full circle)
  const N_ANGLES = 16;
  type P = { sig: Signal; w: number; h: number; fillAlpha: string; borderAlpha: string; isNew: boolean; x: number; y: number };
  type Blob = { cx: number; cy: number; r: number };

  // All trend blobs — signals from every cluster must avoid these globally.
  const allBlobs: Blob[] = [];
  // All placed signals across every cluster — prevents cross-cluster overlap
  // when clusters are close together.
  const allSignalPlacements: P[] = [];

  visibleTrends.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? trend.position ?? { x: 0, y: 0 };
    // Oldest signals first so they claim the inner slots closest to the core;
    // newer signals get pushed outward naturally by the placement loop.
    const trendSignals = allSignals
      .filter((s) => s.trendId === trend.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
    const newCount = trendSignals.filter((s) => !seenIds.has(s.id)).length;
    // Use the date when the topic was added to the radar (persisted in localStorage) for color aging
    const topicKey = trend.topics?.[0];
    const latestDate = topicKey ? topicAddedAt[topicKey] : undefined;
    const d = Math.round(75 + (trend.relevanceScore / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore, newCount, d, latestDate } as TrendNodeData,
    });

    // Grid is 760px between centers; midpoint to neighbour is ~380px.
    // Allow signals to spread up to ~320px from center to fill that space.
    const MAX_R = d / 2 + 280;

    // Local list for this cluster only — used when building nodes/edges below.
    const placements: P[] = [];

    trendSignals.forEach((sig, _i) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      let h2 = 0;
      for (let k = 0; k < sig.id.length; k++) h2 = (h2 * 37 + sig.id.charCodeAt(k) * 17) >>> 0;
      // Fully hash-derived angle — each signal lands in a unique, organic direction
      const baseAngle = ((h & 0xffffff) / 0x1000000) * Math.PI * 2;
      // Start right at the blob edge — small scatter keeps petals tight
      const startR = d / 2 + GAP + ((h2 & 0xff) / 255) * 28;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(165, Math.round(charsPerLine * 5.8) + 20));
      // Height from text wrapping so text never overflows the blob
      const innerW = w - 16;
      const estCharsPerLine = Math.max(1, Math.floor(innerW / 6.0));
      const estLines = Math.ceil(sig.title.length / estCharsPerLine);
      const sigH = Math.round(Math.min(78, Math.max(w * 0.72, estLines * 13 + 18)));
      // Opacity tracks signal age: newer = lighter, older = darker
      const { fillAlpha, borderAlpha } = ageAlpha(sig.date);

      // Radius-first search: expand outward, probe N_ANGLES directions at each ring.
      // Checks against allSignalPlacements (global) so signals from different
      // clusters never overlap each other.
      let x = cx, y = cy, placed = false;

      const tryPlace = (rMin: number, rMax: number, checkBlobs: boolean): boolean => {
        for (let r = rMin; r <= rMax; r += 3) {
          for (let k = 0; k < N_ANGLES; k++) {
            const angle = baseAngle + (k * Math.PI * 2) / N_ANGLES;
            const tx = cx + r * Math.cos(angle) - w / 2;
            const ty = cy + r * Math.sin(angle) - sigH / 2;
            const ncx = tx + w / 2, ncy = ty + sigH / 2;
            if (checkBlobs) {
              let ok = true;
              for (const blob of allBlobs) {
                const nearX = Math.max(tx, Math.min(blob.cx, tx + w));
                const nearY = Math.max(ty, Math.min(blob.cy, ty + sigH));
                if (Math.hypot(nearX - blob.cx, nearY - blob.cy) < blob.r + GAP) { ok = false; break; }
              }
              if (!ok) continue;
            }
            let clearNodes = true;
            for (const p of allSignalPlacements) {
              if (Math.abs(ncx - (p.x + p.w / 2)) < (w + p.w) / 2 + GAP &&
                  Math.abs(ncy - (p.y + p.h / 2)) < (sigH + p.h) / 2 + GAP) { clearNodes = false; break; }
            }
            if (clearNodes) { x = tx; y = ty; return true; }
          }
        }
        return false;
      };

      // Try from blob edge outward — fills closest slots first like petals
      placed = tryPlace(d / 2 + GAP, MAX_R, true);
      if (!placed) placed = tryPlace(MAX_R + 3, MAX_R + 120, false);
      // Last resort: natural direction, far enough to never overlap the blob
      if (!placed) {
        x = cx + (MAX_R + 160) * Math.cos(baseAngle) - w / 2;
        y = cy + (MAX_R + 160) * Math.sin(baseAngle) - sigH / 2;
      }

      const entry: P = { sig, w, h: sigH, fillAlpha, borderAlpha, isNew: !seenIds.has(sig.id), x, y };
      placements.push(entry);
      allSignalPlacements.push(entry);
    });

    placements.forEach(({ sig, w, h, fillAlpha, borderAlpha, isNew, x, y }) => {
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x, y },
        data: { id: sig.id, title: sig.title, color: trend.color, source: sig.source, isLive: sig.isLive, isNew, w, h, fillAlpha, borderAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 1, opacity: 0.18 },
      });
    });
  });

  const placedSignalIds = new Set(nodes.filter(n => n.type === "signalOrbit").map(n => n.id));
  const seen = new Set<string>();
  allSignals.forEach((sig) => {
    if (!placedSignalIds.has(sig.id)) return;
    (sig.crossLinks ?? []).forEach((targetId) => {
      if (!placedSignalIds.has(targetId)) return;
      const key = [sig.id, targetId].sort().join("--");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ id: `cross-${key}`, source: sig.id, target: targetId, type: "straight", style: { stroke: "#bbb", strokeWidth: 0.8, strokeDasharray: "3 5", opacity: 0.35 } });
      }
    });
  });

  return { nodes, edges };
}

// ─── Mobile: focus one trend cluster ─────────────────────────────────────────

function BoardController({ fitViewRef, nodeCount, isDesktop, firstTrendPos }: {
  fitViewRef: React.MutableRefObject<(() => void) | null>;
  nodeCount: number;
  isDesktop: boolean;
  firstTrendPos: { x: number; y: number } | null;
}) {
  const { fitView, fitBounds } = useReactFlow();
  useEffect(() => {
    fitViewRef.current = () => fitView({ duration: 420, padding: 0.22 });
  }, [fitView, fitViewRef]);
  const prev = useRef(0);
  useEffect(() => {
    if (nodeCount === prev.current) return;
    prev.current = nodeCount;
    if (nodeCount > 0) {
      setTimeout(() => {
        if (!isDesktop && firstTrendPos) {
          const pad = 60;
          const r = 260;
          const cx = firstTrendPos.x + CIRCLE_D / 2;
          const cy = firstTrendPos.y + CIRCLE_D / 2;
          fitBounds({ x: cx - r - pad, y: cy - r - pad, width: (r + pad) * 2, height: (r + pad) * 2 }, { duration: 0 });
        } else {
          fitView({ duration: 600, padding: 0.22 });
        }
      }, 80);
    }
  }, [nodeCount, fitView, fitBounds, isDesktop, firstTrendPos]);
  return null;
}

function FocusController({ trendId, trendPos }: { trendId: string; trendPos: { x: number; y: number } }) {
  const { fitBounds } = useReactFlow();
  const first = useRef(true);
  const posRef = useRef(trendPos);
  posRef.current = trendPos;

  useEffect(() => {
    const pos = posRef.current;
    const pad = 24;
    const viewR = 300;
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;
    fitBounds(
      {
        x: cx - viewR - pad,
        y: cy - viewR - pad,
        width:  (viewR + pad) * 2,
        height: (viewR + pad) * 2,
      },
      { duration: first.current ? 0 : 420 },
    );
    first.current = false;
  }, [trendId, fitBounds]);

  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend,   setActiveTrend]   = useState<Trend | null>(null);
  const [activeSignal,  setActiveSignal]  = useState<Signal | null>(null);
  const [showAdd,       setShowAdd]       = useState(false);
  const [extraSignals,  setExtraSignals]  = useState<Signal[]>([]);
  const [liveSignals,   setLiveSignals]   = useState<Signal[]>([]);
  const [liveLoading,   setLiveLoading]   = useState(true);
  const [lastUpdated,   setLastUpdated]   = useState<Date | null>(null);
  const [focusIdx,      setFocusIdx]      = useState(0);
  const [summaryOpen,      setSummaryOpen]      = useState(false);
  const [activeTab,        setActiveTab]        = useState<"radar" | "culture">("radar");
  const [topicAddedAt, setTopicAddedAt] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("ar_topicAddedAt") ?? "{}"); } catch { return {}; }
  });
  const [activeTopics,     setActiveTopics]     = useState<string[]>([]);
  const [dynamicTrends,    setDynamicTrends]    = useState<Trend[]>([]);
  const [generatedSignals, setGeneratedSignals] = useState<Signal[]>([]);
  const [generatingTopic,  setGeneratingTopic]  = useState<string | null>(null);
  const [generationError,  setGenerationError]  = useState<string | null>(null);
  const [appliedTopics,        setAppliedTopics]        = useState<string[]>([]);
  const [appliedDynamicTrends, setAppliedDynamicTrends] = useState<Trend[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [addingTopic, setAddingTopic] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [emptySearchInput, setEmptySearchInput] = useState("");
  const [randomTopics] = useState<string[]>(() => {
    const shuffled = [...LIBRARY_TOPICS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });
  // Seed seen IDs with all static signals on first visit so they don't show NEW
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    const stored = loadSeen();
    if (stored.size === 0) {
      const initial = new Set(SIGNALS.map((s) => s.id));
      saveSeen(initial);
      return initial;
    }
    return stored;
  });
  const swipeStart = useRef<number | null>(null);

  const markSeen = useCallback((ids: string[]) => {
    setSeenIds((prev) => {
      const next = new Set([...prev, ...ids]);
      saveSeen(next);
      return next;
    });
  }, []);

  const liveTopicsRef = useRef<string[]>([]);
  const liveTrendsRef = useRef<Array<{ id: string; name: string; description: string }>>([]);

  useEffect(() => {
    liveTopicsRef.current = appliedTopics;
  }, [appliedTopics]);

  useEffect(() => {
    liveTrendsRef.current = appliedDynamicTrends.map(t => ({ id: t.id, name: t.name, description: t.description }));
  }, [appliedDynamicTrends]);

  // Restart the interval (and do an immediate fetch) whenever the topic set changes.
  // Using a serialised key as the dependency keeps the ref-based fetch function stable.
  const topicsKey = appliedTopics.join(",");
  useEffect(() => {
    if (!topicsKey) return;
    let cancelled = false;
    const fetchLive = () => {
      const topics = liveTopicsRef.current;
      const trends = liveTrendsRef.current;
      if (topics.length === 0) return;
      fetch("/api/live-signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, trends }),
      })
        .then((r) => r.json())
        .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); setLastUpdated(new Date()); } })
        .catch(() => { if (!cancelled) { setLiveLoading(false); setLastUpdated(new Date()); } });
    };
    setLiveLoading(true);
    fetchLive();
    const interval = setInterval(fetchLive, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsKey]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const allTrends = useMemo(() => [...appliedDynamicTrends], [appliedDynamicTrends]);
  const visibleTrends = useMemo(() => allTrends,
    [allTrends]
  );

  const allSignals = useMemo(() => [...SIGNALS, ...EXTENDED_SIGNALS, ...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const allExtraSignals = useMemo(() => [...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const { nodes: graphNodes, edges: graphEdges } = useMemo(() => buildGraph(allExtraSignals, seenIds, visibleTrends, topicAddedAt), [allExtraSignals, seenIds, visibleTrends, topicAddedAt]);
  const fitViewRef = useRef<(() => void) | null>(null);


  const topicSuggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    const all = LIBRARY_TOPICS.filter(t => !activeTopics.includes(t));
    if (!q) return all;
    return all.filter(t => t.includes(q) || t.replace(/-/g, " ").includes(q));
  }, [topicInput, activeTopics]);

  const emptySearchSuggestions = useMemo(() => {
    const q = emptySearchInput.toLowerCase().trim();
    if (!q) return [];
    const all = LIBRARY_TOPICS.filter(t => !activeTopics.includes(t));
    return all.filter(t =>
      t.includes(q) || t.replace(/-/g, " ").includes(q)
    );
  }, [emptySearchInput, activeTopics]);

  const runGeneration = useCallback(async (key: string, newTopics: string[], baseTrends: Trend[] = []) => {
    setGeneratingTopic(key);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: key, existingTrendIds: baseTrends.map(t => t.id), positionOffset: baseTrends.length }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.trends as Array<{ trend: Trend; signals: Signal[] }>;
        const sorted = [...items].sort((a, b) => (b.trend.relevanceScore ?? 0) - (a.trend.relevanceScore ?? 0));
        const newDynamic = baseTrends.length > 0
          // Appending to an existing board: keep existing positions, place new trends after
          ? assignUniqueColors([
              ...baseTrends,
              ...sorted.map((item, i) => ({ ...item.trend, position: computeTrendPosition(baseTrends.length + i) })),
            ])
          // First load: sort by relevance so highest score is top-left
          : assignUniqueColors(
              sorted.map((item, i) => ({ ...item.trend, position: computeTrendPosition(i) }))
            );
        setDynamicTrends(newDynamic);
        setAppliedDynamicTrends(newDynamic);
        setGeneratedSignals(sorted.flatMap(i => i.signals));
        setGenerationError(null);
        // Stamp the generation time so the 48 h staleness check knows when to refresh
        try {
          const stored = localStorage.getItem("ar_trendGeneratedAt");
          const ts: Record<string, number> = stored ? JSON.parse(stored) : {};
          ts[key] = Date.now();
          localStorage.setItem("ar_trendGeneratedAt", JSON.stringify(ts));
        } catch { /* ignore */ }
        if (baseTrends.length > 0) {
          setTimeout(() => fitViewRef.current?.(), 100);
        } else {
          setTimeout(() => setFocusIdx(0), 60);
        }
      } else {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        setGenerationError(errData.error ?? "Generation failed. Please try again.");
      }
    } catch {
      setGenerationError("Network error. Check connection and try again.");
    } finally {
      setAppliedTopics(newTopics);
      setGeneratingTopic(null);
    }
  }, []);

  const loadTopic = useCallback(async (key: string) => {
    setAppliedTopics([key]);
    setDynamicTrends([]);
    setAppliedDynamicTrends([]);
    setGeneratedSignals([]);
    const libraryTrends = [...(TOPIC_LIBRARY[key] ?? [])]
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
      .map((t, i) => ({ ...t, position: computeTrendPosition(i) }));
    if (libraryTrends.length) {
      const colored = assignUniqueColors(libraryTrends);
      setDynamicTrends(colored);
      setAppliedDynamicTrends(colored);
      setTimeout(() => setFocusIdx(0), 60);
      return;
    }
    await runGeneration(key, [key], []);
  }, [runGeneration]);

  const retryGeneration = useCallback(() => {
    const failedTopic = activeTopics.find(topic =>
      !dynamicTrends.some(t => t.topics?.includes(topic))
    );
    if (failedTopic) runGeneration(failedTopic, [failedTopic]);
  }, [activeTopics, dynamicTrends, runGeneration]);

  // Silently regenerate AI trends that are >48 h old on mount.
  // Library topics are skipped — their trends are curated, not time-sensitive.
  const TREND_TTL_MS = 48 * 60 * 60 * 1000;
  useEffect(() => {
    const stored = localStorage.getItem("ar_trendGeneratedAt");
    const timestamps: Record<string, number> = stored ? JSON.parse(stored) : {};
    const now = Date.now();
    activeTopics.forEach(topic => {
      const hasLibrary = (TOPIC_LIBRARY[topic] ?? []).length > 0;
      if (hasLibrary) return;
      const last = timestamps[topic] ?? 0;
      if (now - last > TREND_TTL_MS) runGeneration(topic, [topic], []);
    });
  // Run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTopic = useCallback(async (raw: string) => {
    const key = normaliseTopicKey(raw);
    if (!key || activeTopics.includes(key)) return;
    const newTopics = [...activeTopics, key];
    setActiveTopics(newTopics);
    setAppliedTopics(newTopics);
    setGenerationError(null);

    if (!topicAddedAt[key]) {
      const today = new Date().toISOString().split("T")[0];
      const next = { ...topicAddedAt, [key]: today };
      setTopicAddedAt(next);
      try { localStorage.setItem("ar_topicAddedAt", JSON.stringify(next)); } catch { /* ignore */ }
    }

    // If this is the first topic, load fresh
    if (activeTopics.length === 0) {
      await loadTopic(key);
      return;
    }

    // Append this topic's trends to the existing board
    const libraryTrends = [...(TOPIC_LIBRARY[key] ?? [])]
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

    if (libraryTrends.length) {
      setDynamicTrends(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const fresh = libraryTrends.filter(t => !existingIds.has(t.id));
        // Keep existing trends in their current positions; append new ones after
        const combined = assignUniqueColors([
          ...prev,
          ...fresh.map((t, i) => ({ ...t, position: computeTrendPosition(prev.length + i) })),
        ]);
        setAppliedDynamicTrends(combined);
        return combined;
      });
      setTimeout(() => fitViewRef.current?.(), 100);
      return;
    }

    // No library trends — generate and append
    await runGeneration(key, newTopics, dynamicTrends);
  }, [activeTopics, dynamicTrends, loadTopic, runGeneration, topicAddedAt]);

  const removeTopic = useCallback((topic: string) => {
    const remaining = activeTopics.filter(t => t !== topic);
    setActiveTopics(remaining);
    setAppliedTopics(remaining);
    if (remaining.length === 0) {
      setDynamicTrends([]);
      setAppliedDynamicTrends([]);
      setGeneratedSignals([]);
      return;
    }
    // Keep only trends that belong to at least one remaining topic,
    // preserving their visual order (top-left first) and closing any gaps
    setDynamicTrends(prev => {
      const kept = assignUniqueColors(
        prev
          .filter(t => remaining.some(tp => (t.topics ?? []).includes(tp)))
          .sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0) || (a.position?.x ?? 0) - (b.position?.x ?? 0))
          .map((t, i) => ({ ...t, position: computeTrendPosition(i) }))
      );
      setAppliedDynamicTrends(kept);
      return kept;
    });
  }, [activeTopics]);


  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = appliedDynamicTrends.find((t) => t.id === node.id);
      if (trend) {
        setActiveTrend(trend);
        markSeen(allSignals.filter((s) => s.trendId === trend.id).map((s) => s.id));
      }
    } else if (node.type === "signalOrbit") {
      const sig = allSignals.find((s) => s.id === node.id);
      if (sig) { setActiveSignal(sig); markSeen([sig.id]); }
    }
  }, [allSignals, markSeen, appliedDynamicTrends]);

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  const activeTrendForSignal = activeSignal ? allTrends.find((t) => t.id === activeSignal.trendId) ?? null : null;

  // Sort trends by grid position: row (y) first, then column (x) — left-to-right, top-to-bottom
  const navTrends = useMemo(() =>
    [...visibleTrends].sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)),
  [visibleTrends]);

  const capTopic = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
  const topicsLabel = useMemo(() => {
    if (appliedTopics.length === 0) return "";
    return `Emerging Tech × ${appliedTopics.map(capTopic).join(" + ")}`;
  }, [appliedTopics]);

  // Always clamp focusIdx at the point of use — setFocusIdx(9999) is used as "jump to last"
  // so we derive the safe index here rather than fighting async clamp timing.
  const safeIdx = navTrends.length > 0 ? Math.min(focusIdx, navTrends.length - 1) : 0;

  const focusTrend = navTrends[safeIdx] ?? navTrends[0];
  const focusTrendPos = TREND_POSITIONS[focusTrend?.id] ?? focusTrend?.position ?? { x: 0, y: 0 };

  const prev = () => setFocusIdx((i) => Math.max(0, i - 1));
  const next = () => setFocusIdx((i) => Math.min(navTrends.length - 1, i + 1));

  return (
    <div style={{ position: "fixed", inset: 0, background: "#ffffff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, zIndex: 10,
        height: 52, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <button
          onClick={() => { setActiveTopics([]); setAppliedTopics([]); setDynamicTrends([]); setAppliedDynamicTrends([]); setGeneratedSignals([]); setGenerationError(null); setTimeout(() => fitViewRef.current?.(), 80); }}
          style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#000", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
        >Augmented Radar</button>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "#f0ede8", borderRadius: 20, padding: 3, gap: 2 }}>
          {(["radar", "culture"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "4px 14px", borderRadius: 16, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "#000" : "#999",
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s ease",
                textTransform: "capitalize",
              }}
            >{tab === "radar" ? "Radar" : "Culture Map"}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500, whiteSpace: "nowrap" }}>
              {(() => {
                const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
                if (mins < 1) return "Updated just now";
                if (mins === 1) return "Updated 1 min ago";
                return `Updated ${mins} min ago`;
              })()}
            </span>
          )}
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "6px 16px", background: "#000", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            + Signal
          </button>
        </div>
      </div>

      {/* Topics bar */}
      {activeTopics.length > 0 && <div style={{
        flexShrink: 0, zIndex: 9,
        height: 44, padding: "0 14px",
        display: "flex", alignItems: "center", gap: 6,
        overflowX: "auto", WebkitOverflowScrolling: "touch",
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        scrollbarWidth: "none",
      } as React.CSSProperties}>
        {activeTopics.map((topic) => {
          const color = TOPIC_COLORS[topic] ?? "#aaa";
          return (
            <div key={topic} style={{
              display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              background: `${color}22`, border: `1px solid ${color}66`,
              borderRadius: 20, padding: "3px 10px 3px 12px", cursor: "default",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: darkenColor(color, 0.55), letterSpacing: "0.03em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {topic}
              </span>
              <button
                onClick={() => removeTopic(topic)}
                style={{ background: "none", border: "none", padding: 0, marginLeft: 2, cursor: "pointer", fontSize: 13, color: darkenColor(color, 0.55), lineHeight: 1, display: "flex", alignItems: "center" }}
                aria-label={`Remove ${topic}`}
              >×</button>
            </div>
          );
        })}
        {addingTopic ? (
          <input
            autoFocus
            value={topicInput}
            onChange={(e) => { setTopicInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && topicInput.trim()) { addTopic(topicInput.trim()); setTopicInput(""); setAddingTopic(false); setShowSuggestions(false); }
              if (e.key === "Escape") { setAddingTopic(false); setTopicInput(""); setShowSuggestions(false); }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => { setShowSuggestions(false); setAddingTopic(false); setTopicInput(""); }, 150)}
            placeholder="switch topic…"
            style={{
              flexShrink: 0, height: 28, padding: "0 10px",
              border: "1.5px dashed #ccc", borderRadius: 20,
              fontSize: 11, fontWeight: 600, color: "#555",
              background: "transparent", outline: "none",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              width: 140,
            }}
          />
        ) : (
          <button
            onClick={() => setAddingTopic(true)}
            style={{
              flexShrink: 0, height: 28, padding: "0 12px",
              border: "1.5px dashed #ccc", borderRadius: 20,
              fontSize: 11, fontWeight: 700, color: "#aaa",
              background: "transparent", cursor: "pointer",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> topic
          </button>
        )}
        {generatingTopic && (
          <div style={{
            flexShrink: 0, height: 28, padding: "0 12px",
            border: "1.5px solid #ddd", borderRadius: 20,
            fontSize: 11, fontWeight: 600, color: "#999",
            background: "#f8f8f8",
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ccc", animation: "pulse 1.2s infinite" }} />
            generating {generatingTopic}…
          </div>
        )}
      </div>}

      {/* Autocomplete dropdown for topic switcher */}
      {addingTopic && showSuggestions && topicSuggestions.length > 0 && (
        <div style={{
          position: "absolute", top: 96, left: 0, right: 0, zIndex: 20,
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "6px 0",
          maxHeight: 240, overflowY: "auto",
        }}>
          {topicSuggestions.map(topic => (
            <button
              key={topic}
              onMouseDown={() => { addTopic(topic); setTopicInput(""); setAddingTopic(false); setShowSuggestions(false); }}
              style={{
                display: "block", width: "100%",
                padding: "10px 20px", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: "#222",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: TOPIC_COLORS[topic] ?? "#ccc",
                marginRight: 10, verticalAlign: "middle",
              }} />
              {topic.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Summary strip — click anywhere to open */}
      <div
        onClick={() => setSummaryOpen(true)}
        role="button"
        style={{
          flexShrink: 0, zIndex: 9,
          padding: "9px 12px 9px 20px",
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
        } as React.CSSProperties}
      >
        {appliedTopics.length > 0 && (
          <>
            <p style={{ flex: 1, fontSize: 13, color: "#555", lineHeight: 1.45, fontFamily: "'EB Garamond', Georgia, serif", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: isDesktop ? 2 : 1, WebkitBoxOrient: "vertical", whiteSpace: isDesktop ? "normal" : "nowrap", textOverflow: "ellipsis" } as React.CSSProperties}>
              {appliedTopics.length === 1 ? (TOPIC_DESCRIPTIONS[normaliseTopicKey(appliedTopics[0])] ?? `${topicsLabel} · ${visibleTrends.length} trend${visibleTrends.length === 1 ? "" : "s"}`) : `${topicsLabel} · ${visibleTrends.length} trend${visibleTrends.length === 1 ? "" : "s"}`}
            </p>
            {isDesktop && (
              <button
                onClick={(e) => { e.stopPropagation(); setSummaryOpen(true); }}
                style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: "#999", background: "none", border: "1.5px solid #e8e4de", borderRadius: 20, padding: "4px 12px", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.04em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                Show more
              </button>
            )}
          </>
        )}
      </div>

      {/* Summary expanded overlay */}
      {summaryOpen && (
        <div
          className="summary-overlay"
          style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
          onClick={() => setSummaryOpen(false)}
        >
          <div
            className="summary-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              maxHeight: "80svh",
              display: "flex", flexDirection: "column",
              boxShadow: "0 -12px 80px rgba(0,0,0,0.15)",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {/* Color bar */}
            <div style={{ height: 4, background: appliedTopics.length > 0 ? `linear-gradient(90deg, #111, #11111144)` : "linear-gradient(90deg, #e8e4de, #e8e4de44)", flexShrink: 0 }} />

            {/* Fixed header */}
            <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    {appliedTopics.length > 0 ? "What we're tracking" : "About"}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#000", lineHeight: 1.2, letterSpacing: "-0.03em", fontFamily: "'EB Garamond', Georgia, serif", margin: 0 }}>
                    {appliedTopics.length > 0 ? topicsLabel : "Augmented Radar"}
                  </h3>
                </div>
                <button
                  onClick={() => setSummaryOpen(false)}
                  aria-label="Close overview"
                  style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", border: "none", background: "#f0f0f0", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
                >×</button>
              </div>

            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: "0 24px", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" } as React.CSSProperties}>

              {/* ── About (no topic selected) ── */}
              {appliedTopics.length === 0 && (
                <div style={{ paddingBottom: 28 }}>
                  <p style={{ fontSize: 15, color: "#333", lineHeight: 1.85, margin: "4px 0 20px", fontFamily: "'EB Garamond', Georgia, serif" }}>
                    Each big blob is a trend. The smaller ones orbiting it are the signals — news, conversations, data points that prove it's real. Pick a topic and watch it come alive.
                  </p>
                  <p style={{ fontSize: 12, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    Augmented Radar maps emerging tech against culture.<br />By Martina from{" "}
                    <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Augmented Rarity
                    </a>
                  </p>
                </div>
              )}

              {/* ── Trends (topic selected) ── */}
              {appliedTopics.length > 0 && (
                <>
                  {appliedTopics.length === 1 && (() => {
                    const desc = TOPIC_DESCRIPTIONS[normaliseTopicKey(appliedTopics[0])];
                    return desc ? (
                      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "4px 0 16px", fontFamily: "'EB Garamond', Georgia, serif" }}>
                        {desc}
                      </p>
                    ) : null;
                  })()}
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 20 }}>
                    {visibleTrends.map(t => (
                      <button key={t.id} onClick={() => { setActiveTrend(t); setSummaryOpen(false); }} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "none", border: "none", borderBottom: "1px solid #f5f3ef", textAlign: "left", width: "100%", cursor: "pointer", padding: "0 0 12px", marginBottom: 12 }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: darkenColor(t.color), marginTop: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.25, fontFamily: "'EB Garamond', Georgia, serif" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#777", lineHeight: 1.55, marginTop: 3 }}>{t.description}</div>
                        </div>
                        <span style={{ fontSize: 10, color: "#ccc", marginTop: 5, flexShrink: 0 }}>→</span>
                      </button>
                    ))}
                  </div>
                </>
              )}


              {appliedTopics.length > 0 && (
                <div style={{ borderTop: "1px solid #f0ede8", padding: "14px 0 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    Augmented Radar maps emerging tech against culture.<br />By Martina from{" "}
                    <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Augmented Rarity
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        style={{ flex: 1, minHeight: 0, position: "relative" }}
        onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.changedTouches[0].clientX - swipeStart.current;
          if (dx < -50) next();
          else if (dx > 50) prev();
          swipeStart.current = null;
        }}
      >
        {activeTab === "radar" && visibleTrends.length === 0 && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{ textAlign: "center", padding: "0 40px" }}>
              {generatingTopic ? (
                <>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #eee", borderTopColor: "#aaa", margin: "0 auto 16px", animation: "spin 0.9s linear infinite" }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#555", fontFamily: "'EB Garamond', Georgia, serif" }}>
                    scanning {generatingTopic} for signals…
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    running the radar
                  </div>
                </>
              ) : generationError ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.3, marginBottom: 8 }}>
                    signal lost
                  </div>
                  <div style={{ fontSize: 13, color: "#999", marginBottom: 16, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", lineHeight: 1.6 }}>
                    {generationError && generationError !== "Generation failed. Please try again." && generationError !== "Network error. Check connection and try again."
                      ? generationError
                      : "try a different topic or hit retry"}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 18, pointerEvents: "all", maxWidth: 280 }}>
                    {LIBRARY_TOPICS.filter(t => !activeTopics.includes(t)).slice(0, 8).map(t => (
                      <button key={t} onClick={() => { setGenerationError(null); addTopic(t); }}
                        style={{ padding: "5px 12px", background: `${TOPIC_COLORS[t] ?? "#eee"}22`, border: `1px solid ${TOPIC_COLORS[t] ?? "#eee"}66`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#333", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                      >{t.replace(/-/g, " ")}</button>
                    ))}
                  </div>
                  <button
                    onClick={retryGeneration}
                    style={{
                      pointerEvents: "all",
                      padding: "10px 28px", background: "#000", color: "#fff",
                      border: "none", borderRadius: 20,
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  >
                    Try again
                  </button>
                </>
              ) : activeTopics.length > 0 ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#bbb", fontFamily: "'EB Garamond', Georgia, serif", marginBottom: 8 }}>
                    nothing on the radar yet
                  </div>
                  <button
                    onClick={retryGeneration}
                    style={{
                      pointerEvents: "all",
                      padding: "10px 28px", background: "#000", color: "#fff",
                      border: "none", borderRadius: 20,
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  >
                    Run it
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    what are we tracking?
                  </div>
                  {/* Search bar */}
                  <div style={{ pointerEvents: "all", marginBottom: 28, width: "100%", maxWidth: 340, position: "relative" }}>
                    <form onSubmit={(e) => { e.preventDefault(); if (emptySearchInput.trim()) { addTopic(emptySearchInput.trim()); setEmptySearchInput(""); } }}>
                      <div style={{ position: "relative" }}>
                        <input
                          value={emptySearchInput}
                          onChange={(e) => setEmptySearchInput(e.target.value)}
                          onBlur={() => setTimeout(() => setEmptySearchInput(v => { return v; }), 150)}
                          placeholder="search a topic…"
                          style={{
                            width: "100%", boxSizing: "border-box",
                            height: 48, padding: "0 52px 0 20px",
                            border: "1.5px solid #e0ddd8", borderRadius: emptySearchSuggestions.length > 0 ? "24px 24px 0 0" : 30,
                            fontSize: 14, fontWeight: 500, color: "#222",
                            background: "#fff", outline: "none",
                            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!emptySearchInput.trim()}
                          style={{
                            position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                            width: 36, height: 36, borderRadius: "50%",
                            background: emptySearchInput.trim() ? "#111" : "#eee",
                            border: "none", cursor: emptySearchInput.trim() ? "pointer" : "default",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.15s",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1L13 7L7 13M1 7H13" stroke={emptySearchInput.trim() ? "#fff" : "#bbb"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </form>
                    {/* Autocomplete dropdown */}
                    {emptySearchSuggestions.length > 0 && (
                      <div style={{
                        position: "absolute", top: 48, left: 0, right: 0, zIndex: 30,
                        background: "#fff",
                        border: "1.5px solid #e0ddd8", borderTop: "1px solid #f0ede8",
                        borderRadius: "0 0 20px 20px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        maxHeight: 220, overflowY: "auto",
                        padding: "4px 0 8px",
                      }}>
                        {emptySearchSuggestions.map(t => (
                          <button
                            key={t}
                            onMouseDown={() => { addTopic(t); setEmptySearchInput(""); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              width: "100%", padding: "10px 18px",
                              background: "none", border: "none", cursor: "pointer",
                              textAlign: "left", fontSize: 13, fontWeight: 600, color: "#222",
                              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: TOPIC_COLORS[t] ?? "#ccc", flexShrink: 0 }} />
                            {t.replace(/-/g, " ")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Inspiration pills */}
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#ccc", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    or try
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", pointerEvents: "all", maxWidth: 360 }}>
                    {randomTopics.map(t => (
                      <button key={t} onClick={() => addTopic(t)}
                        style={{
                          padding: "7px 16px",
                          background: `${TOPIC_COLORS[t] ?? "#eee"}18`,
                          border: `1.5px solid ${TOPIC_COLORS[t] ?? "#eee"}77`,
                          borderRadius: 30, fontSize: 12, fontWeight: 600, color: "#444",
                          cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          display: "flex", alignItems: "center", gap: 7,
                        }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: TOPIC_COLORS[t] ?? "#ccc", flexShrink: 0, display: "inline-block" }} />
                        {t.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === "culture" && (
          <div style={{ position: "absolute", inset: 0 }}>
            <CultureMap dynamicTrends={appliedDynamicTrends} />
          </div>
        )}
        {activeTab === "radar" && <ReactFlow
              nodes={graphNodes}
              edges={graphEdges}
              nodeTypes={NODE_TYPES}
              onNodeClick={handleNodeClick}
              nodesDraggable={false}
              minZoom={0.06}
              maxZoom={2}
              panOnDrag
              zoomOnPinch
              zoomOnScroll
              preventScrolling
              proOptions={{ hideAttribution: true }}
              style={{ background: "#ffffff" }}
            >
              <BoardController fitViewRef={fitViewRef} nodeCount={graphNodes.length} isDesktop={isDesktop} firstTrendPos={visibleTrends[0]?.position ?? null} />
              {focusTrend && <FocusController trendId={focusTrend.id} trendPos={focusTrendPos} />}
            </ReactFlow>}
      </div>

      {/* Nav bar — hidden on culture map tab */}
      <div style={{
        flexShrink: 0, zIndex: 10,
        height: activeTab === "culture" ? 0 : 80,
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        borderTop: activeTab === "culture" ? "none" : "1px solid rgba(0,0,0,0.07)",
        padding: activeTab === "culture" ? 0 : "0 24px", gap: 16,
      }}>
        {visibleTrends.length === 0 ? (
          <div style={{ flex: 1, textAlign: "center", padding: "0 12px" }}>
            {generatingTopic ? (
              <div style={{ fontSize: 13, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                scanning {generatingTopic}…
              </div>
            ) : (
              <>
                <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  Augmented Radar maps emerging tech against culture.<br />By Martina from{" "}
                  <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#aaa", textDecoration: "underline", textUnderlineOffset: 2 }}>
                    Augmented Rarity
                  </a>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={prev}
              disabled={safeIdx === 0}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1.5px solid #e8e4de",
                background: safeIdx === 0 ? "#f5f3ee" : "#fff",
                fontSize: 20, color: safeIdx === 0 ? "#ccc" : "#333",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: safeIdx === 0 ? "default" : "pointer", flexShrink: 0,
              }}
            >‹</button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                display: "inline-block", width: 10, height: 10,
                borderRadius: "50%", background: focusTrend?.color, marginBottom: 5,
              }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                {focusTrend?.name}
              </div>
              <div style={{ fontSize: 10, color: "#bbb", marginTop: 3, fontFamily: "monospace" }}>
                {safeIdx + 1} / {navTrends.length}
              </div>
            </div>

            <button
              onClick={next}
              disabled={safeIdx === navTrends.length - 1}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1.5px solid #e8e4de",
                background: safeIdx === navTrends.length - 1 ? "#f5f3ee" : "#fff",
                fontSize: 20, color: safeIdx === navTrends.length - 1 ? "#ccc" : "#333",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: safeIdx === navTrends.length - 1 ? "default" : "pointer", flexShrink: 0,
              }}
            >›</button>
          </>
        )}
      </div>

      {activeTrend && (
        <TrendDetailModal
          trend={activeTrend}
          extraSignals={allExtraSignals}
          onClose={() => setActiveTrend(null)}
          onSelectSignal={(s) => { setActiveTrend(null); setActiveSignal(s); }}
        />
      )}

      {activeSignal && activeTrendForSignal && (
        <SignalPopup
          signal={activeSignal}
          trendColor={activeTrendForSignal.color}
          trendName={activeTrendForSignal.name}
          allSignals={allSignals}
          onClose={() => setActiveSignal(null)}
          onSelectSignal={(s) => setActiveSignal(s)}
          onOpenTrend={() => { setActiveSignal(null); setActiveTrend(activeTrendForSignal); }}
        />
      )}

      {showAdd && <AddSignalModal onAdd={handleAddSignal} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
