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
import { TOPIC_LIBRARY, TOPIC_COLORS, EXTENDED_SIGNALS, normaliseTopicKey, LIBRARY_TOPICS, TOPIC_DESCRIPTIONS } from "@/lib/extended-trends";
import { Trend, Signal } from "@/types";

import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

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

// Compact grid for dynamically added trends — 3 columns, 520 px apart.
function computeTrendPosition(idx: number): { x: number; y: number } {
  return { x: 80 + (idx % 3) * 520, y: 80 + Math.floor(idx / 3) * 520 };
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
// 0 days → ~18% fill, 30+ days → ~75% fill.
// Quadratic ease-in keeps today/this-week visually similar;
// darkening accelerates in the final stretch toward 30 days.
function ageAlpha(date: string | undefined): { fillAlpha: string; borderAlpha: string } {
  const ageDays = date ? (Date.now() - new Date(date).getTime()) / 86_400_000 : 30;
  const t = Math.pow(Math.min(1, Math.max(0, ageDays / 30)), 2);
  const fill   = Math.round(0x2E + t * (0xBF - 0x2E));
  const border = Math.round(0x44 + t * (0xCC - 0x44));
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
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
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

    const MAX_R = d / 2 + 250;

    // Local list for this cluster only — used when building nodes/edges below.
    const placements: P[] = [];

    trendSignals.forEach((sig, _i) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      let h2 = 0;
      for (let k = 0; k < sig.id.length; k++) h2 = (h2 * 37 + sig.id.charCodeAt(k) * 17) >>> 0;
      // Fully hash-derived angle — each signal lands in a unique, organic direction
      const baseAngle = ((h & 0xffffff) / 0x1000000) * Math.PI * 2;
      // Random start radius — signals scatter at different distances from the blob
      const startR = d / 2 + GAP + ((h2 & 0xff) / 255) * (MAX_R * 0.55);
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

      // Start at the random radius, then fill in closer if needed
      placed = tryPlace(startR, MAX_R, true);
      if (!placed) placed = tryPlace(d / 2 + GAP, startR, true);
      if (!placed) placed = tryPlace(MAX_R + 3, MAX_R * 2, false);

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
  const [addingTopic,   setAddingTopic]   = useState(false);
  const [topicInput,    setTopicInput]    = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  useEffect(() => {
    let cancelled = false;
    setLiveLoading(true);
    fetch("/api/live-signals")
      .then((r) => r.json())
      .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); setLastUpdated(new Date()); } })
      .catch(() => { if (!cancelled) { setLiveLoading(false); setLastUpdated(new Date()); } });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const allTrends = useMemo(() => [...appliedDynamicTrends], [appliedDynamicTrends]);
  const visibleTrends = useMemo(() =>
    allTrends.filter(t =>
      !t.topics?.length ||
      t.topics.some(tp => appliedTopics.includes(tp))
    ),
    [allTrends, appliedTopics]
  );

  const allSignals = useMemo(() => [...SIGNALS, ...EXTENDED_SIGNALS, ...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const allExtraSignals = useMemo(() => [...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const { nodes: graphNodes, edges: graphEdges } = useMemo(() => buildGraph(allExtraSignals, seenIds, visibleTrends, topicAddedAt), [allExtraSignals, seenIds, visibleTrends, topicAddedAt]);
  const fitViewRef = useRef<(() => void) | null>(null);

  const topicSuggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    const all = LIBRARY_TOPICS.filter(t => !activeTopics.includes(t));
    if (!q) return all;
    return all.filter(t =>
      t.includes(q) || t.replace(/-/g, " ").includes(q)
    );
  }, [topicInput, activeTopics]);

  // Extracted so it can be called both on first add and on retry
  const runGeneration = useCallback(async (key: string, newTopics: string[]) => {
    setGeneratingTopic(key);
    setGenerationError(null);
    try {
      const existingIds = dynamicTrends.map(t => t.id);
      const res = await fetch("/api/generate-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: key, existingTrendIds: existingIds, positionOffset: dynamicTrends.length }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.trends as Array<{ trend: Trend; signals: Signal[] }>;
        const newDynamic = [...dynamicTrends, ...items.map(i => i.trend)];
        setDynamicTrends(newDynamic);
        setAppliedDynamicTrends(newDynamic);
        setGeneratedSignals(prev => [...prev, ...items.flatMap(i => i.signals)]);
        setGenerationError(null);
        setTimeout(() => setFocusIdx(0), 60);
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
  }, [dynamicTrends]);

  const retryGeneration = useCallback(() => {
    const failedTopic = activeTopics.find(topic =>
      !dynamicTrends.some(t => t.topics?.includes(topic))
    );
    if (failedTopic) runGeneration(failedTopic, activeTopics);
  }, [activeTopics, dynamicTrends, runGeneration]);

  const addTopic = useCallback(async (raw: string) => {
    const key = normaliseTopicKey(raw);
    if (!key || activeTopics.includes(key)) return;
    const newTopics = [...activeTopics, key];
    setActiveTopics(newTopics);
    setTopicInput("");
    setAddingTopic(false);
    setGenerationError(null);

    // Stamp when this topic was first added — persists across sessions for color aging
    if (!topicAddedAt[key]) {
      const today = new Date().toISOString().split("T")[0];
      const next = { ...topicAddedAt, [key]: today };
      setTopicAddedAt(next);
      try { localStorage.setItem("ar_topicAddedAt", JSON.stringify(next)); } catch { /* ignore */ }
    }

    // Use pre-built library first — apply immediately, overriding stored positions
    const libraryTrends = (TOPIC_LIBRARY[key] ?? []).filter(t =>
      !dynamicTrends.find(e => e.id === t.id)
    ).map((t, i) => ({ ...t, position: computeTrendPosition(dynamicTrends.length + i) }));
    if (libraryTrends.length) {
      const newDynamic = [...dynamicTrends, ...libraryTrends];
      setDynamicTrends(newDynamic);
      setAppliedTopics(newTopics);
      setAppliedDynamicTrends(newDynamic);
      setTimeout(() => setFocusIdx(0), 60);
      return;
    }

    await runGeneration(key, newTopics);
  }, [activeTopics, dynamicTrends, runGeneration, topicAddedAt]);

  const removeTopic = useCallback((topic: string) => {
    setActiveTopics(prev => {
      const next = prev.filter(t => t !== topic);
      setAppliedTopics(next);
      setDynamicTrends(dt => {
        const kept = dt.filter(t => t.topics?.some(tp => next.includes(tp)));
        setAppliedDynamicTrends(kept);
        const removedIds = new Set(dt.filter(t => !kept.includes(t)).map(t => t.id));
        setGeneratedSignals(gs => gs.filter(s => !removedIds.has(s.trendId ?? "")));
        return kept;
      });
      return next;
    });
  }, []);


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
  const navTrends = useMemo(() => [...visibleTrends].sort((a, b) => {
    const pa = TREND_POSITIONS[a.id] ?? a.position ?? { x: 0, y: 0 };
    const pb = TREND_POSITIONS[b.id] ?? b.position ?? { x: 0, y: 0 };
    const rowA = Math.round(pa.y / 520);
    const rowB = Math.round(pb.y / 520);
    if (rowA !== rowB) return rowA - rowB;
    return pa.x - pb.x;
  }), [visibleTrends]);

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
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#000" }}>Augmented Radar</span>
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
      <div style={{
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
              if (e.key === "Enter" && topicInput.trim()) { addTopic(topicInput.trim()); setShowSuggestions(false); }
              if (e.key === "Escape") { setAddingTopic(false); setTopicInput(""); setShowSuggestions(false); }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="e.g. travel, music…"
            style={{
              flexShrink: 0, height: 28, padding: "0 10px",
              border: "1.5px dashed #ccc", borderRadius: 20,
              fontSize: 11, fontWeight: 600, color: "#555",
              background: "transparent", outline: "none",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              width: 160,
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
      </div>

      {/* Autocomplete dropdown */}
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
              onMouseDown={() => { addTopic(topic); setShowSuggestions(false); }}
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
              {TOPIC_DESCRIPTIONS[normaliseTopicKey(appliedTopics[0])] ?? `${appliedTopics.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" × ")} · ${visibleTrends.length} trend${visibleTrends.length === 1 ? "" : "s"}`}
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
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
          onClick={() => setSummaryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 680,
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
                    {appliedTopics.length > 0 ? appliedTopics.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" × ") : "Augmented Radar"}
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
                    A research tool for emerging tech × anything. Pick a topic and see what's actually moving.
                  </p>
                  <p style={{ fontSize: 12, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    Vibe coded by Martina,{" "}
                    <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Augmented Rarity
                    </a>
                  </p>
                </div>
              )}

              {/* ── Trends (topic selected) ── */}
              {appliedTopics.length > 0 && (
                <>
                  {(() => {
                    const desc = TOPIC_DESCRIPTIONS[normaliseTopicKey(appliedTopics[0])];
                    return desc ? (
                      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "4px 0 16px", fontFamily: "'EB Garamond', Georgia, serif" }}>
                        {desc}
                      </p>
                    ) : null;
                  })()}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20 }}>
                    {visibleTrends.map(t => (
                      <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 9, height: 9, borderRadius: "50%", background: darkenColor(t.color), marginTop: 6, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.25, fontFamily: "'EB Garamond', Georgia, serif" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#777", lineHeight: 1.55, marginTop: 3 }}>{t.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}


              {appliedTopics.length > 0 && (
                <div style={{ borderTop: "1px solid #f0ede8", padding: "14px 0 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    Vibe coded by Martina,{" "}
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
        {visibleTrends.length === 0 && (
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
                    on it, digging into {generatingTopic}…
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    give us a sec
                  </div>
                </>
              ) : generationError ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.3, marginBottom: 8 }}>
                    hmm, that didn't work
                  </div>
                  <div style={{ fontSize: 13, color: "#999", marginBottom: 16, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", lineHeight: 1.6 }}>
                    try one of these or hit retry
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
                    nothing here yet
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
                    Generate trends
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    what are we tracking?
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2, marginBottom: 24, letterSpacing: "-0.02em" }}>
                    pick a topic to start.
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", pointerEvents: "all", maxWidth: 320 }}>
                    {LIBRARY_TOPICS.map(t => (
                      <button key={t} onClick={() => addTopic(t)}
                        style={{
                          padding: "7px 16px",
                          background: `${TOPIC_COLORS[t] ?? "#eee"}20`,
                          border: `1.5px solid ${TOPIC_COLORS[t] ?? "#eee"}77`,
                          borderRadius: 24, fontSize: 12, fontWeight: 700, color: "#333",
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
        <ReactFlow
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
        </ReactFlow>
      </div>

      {/* Nav bar */}
      <div style={{
        flexShrink: 0, zIndex: 10,
        height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "0 24px", gap: 16,
      }}>
        {visibleTrends.length === 0 ? (
          <div style={{ flex: 1, textAlign: "center", padding: "0 12px" }}>
            {generatingTopic ? (
              <div style={{ fontSize: 13, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                on it… {generatingTopic}
              </div>
            ) : (
              <>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, margin: "0 0 6px", fontFamily: "'EB Garamond', Georgia, serif" }}>
                  pick a topic above to see what's actually moving.
                </p>
                <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  a research tool for emerging tech × anything —{" "}
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
          onClose={() => setActiveSignal(null)}
        />
      )}

      {showAdd && <AddSignalModal onAdd={handleAddSignal} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
