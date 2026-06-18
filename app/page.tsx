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
import { TOPIC_LIBRARY, TOPIC_COLORS, TOPIC_DESCRIPTIONS, EXTENDED_SIGNALS, normaliseTopicKey } from "@/lib/extended-trends";
import { Trend, Signal } from "@/types";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE_D = 164;
const ORBIT_R  = 160;
const SIG_W    = 158;
const SIG_H    = 44;

const BLOB: Record<string, string> = {
  "ai-creativity":         "65% 35% 40% 60% / 55% 45% 65% 35%",  // leans top-left
  "digital-identity":      "25% 75% 55% 45% / 45% 55% 25% 75%",  // pointy TL + BR
  "ar-commerce":           "75% 25% 50% 50% / 50% 50% 75% 25%",  // two sharp corners opposite
  "biotech-beauty":        "50% 50% 30% 70% / 70% 30% 55% 45%",  // droops bottom-right
  "sustainable-materials": "40% 60% 70% 30% / 30% 70% 40% 60%",  // diagonal S-curve
  "3d-printing":           "60% 40% 60% 40% / 40% 60% 40% 60%",  // alternating wave
  "wearables":             "70% 30% 45% 55% / 55% 45% 70% 30%",  // top-heavy
  "neurotech":             "30% 70% 65% 35% / 65% 35% 30% 70%",  // bottom-heavy opposite
  "spatial-computing":     "55% 45% 55% 45% / 25% 75% 75% 25%",  // vertically pinched
  "longevity":             "45% 55% 35% 65% / 70% 30% 55% 45%",  // irregular organic
};


function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

// Cluster centres spaced 580 px apart so clusters feel densely packed
// while each cluster's signal zone (MAX_R = d/2+320 ≈ 390) still fits
// without crossing into a neighbour's trend blob.
// pos = top-left of CIRCLE_D×CIRCLE_D anchor; centre = pos + CIRCLE_D/2.
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

type TrendNodeData = { id: string; name: string; color: string; score: number; newCount: number; d: number };
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
  // Two independent hashes → 8 fully uncorrelated corner values
  let h1 = 0, h2 = 0;
  for (let i = 0; i < id.length; i++) {
    h1 = (h1 * 31 + id.charCodeAt(i)) >>> 0;
    h2 = (h2 * 37 + id.charCodeAt(i) * 17) >>> 0;
  }
  // Full 5-90% range for maximum blob wobble
  const v = (h: number, n: number) => 5 + (((h >>> n) & 0xff) % 86);
  return `${v(h1,0)}% ${v(h1,8)}% ${v(h1,16)}% ${v(h1,24)}% / ${v(h2,0)}% ${v(h2,8)}% ${v(h2,16)}% ${v(h2,24)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  return (
    <div style={{ position: "relative" }}>
      {data.newCount > 0 && (
        <div style={{
          position: "absolute", top: -6, right: -6, zIndex: 2,
          minWidth: 18, height: 18, borderRadius: 9,
          background: "#FF2D78", color: "#fff",
          fontSize: 9, fontWeight: 900, padding: "0 5px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 6px rgba(255,45,120,0.4)",
          letterSpacing: "0.02em",
        }}>
          {data.newCount}
        </div>
      )}
      <div style={{
        width: data.d, height: data.d,
        borderRadius: BLOB[data.id] ?? "50%",
        background: darkenColor(data.color),
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
      {data.isNew && (
        <span style={{
          position: "absolute", top: -7, left: 8,
          fontSize: 7, fontWeight: 900, color: "#fff",
          background: "#FF2D78",
          borderRadius: 3, padding: "1px 4px",
          letterSpacing: "0.07em", lineHeight: 1.5,
        }}>NEW</span>
      )}
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "#000", lineHeight: 1.35, letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(extraSignals: Signal[], seenIds: Set<string>, visibleTrends: Trend[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...EXTENDED_SIGNALS, ...extraSignals];

  const GOLDEN_ANGLE = 2.399963;
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
    const d = Math.round(75 + (trend.relevanceScore / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore, newCount, d } as TrendNodeData,
    });

    const MAX_R = d / 2 + 320;

    // Local list for this cluster only — used when building nodes/edges below.
    const placements: P[] = [];

    trendSignals.forEach((sig, i) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      const jitter = ((h & 0xff) / 255 - 0.5) * 0.1;
      const baseAngle = i * GOLDEN_ANGLE + jitter;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(165, Math.round(charsPerLine * 5.8) + 20));
      // Height from text wrapping so text never overflows the blob
      const innerW = w - 16;
      const estCharsPerLine = Math.max(1, Math.floor(innerW / 6.0));
      const estLines = Math.ceil(sig.title.length / estCharsPerLine);
      const sigH = Math.round(Math.max(w * 0.75, estLines * 13.5 + 20));
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

      // Pass 1: within MAX_R, respect all blob clearances
      placed = tryPlace(d / 2 + GAP, MAX_R, true);
      // Pass 2: beyond MAX_R if needed (no global blob check — keeps cluster together visually)
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

function BoardController({ fitViewRef }: { fitViewRef: React.MutableRefObject<(() => void) | null> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitViewRef.current = () => fitView({ duration: 420, padding: 0.18 });
  }, [fitView, fitViewRef]);
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
  const [activeTopics,     setActiveTopics]     = useState<string[]>(["fashion", "beauty", "lifestyle"]);
  const [dynamicTrends,    setDynamicTrends]    = useState<Trend[]>([]);
  const [generatedSignals, setGeneratedSignals] = useState<Signal[]>([]);
  const [generatingTopic,  setGeneratingTopic]  = useState<string | null>(null);
  const [appliedTopics,        setAppliedTopics]        = useState<string[]>(["fashion", "beauty", "lifestyle"]);
  const [appliedDynamicTrends, setAppliedDynamicTrends] = useState<Trend[]>([]);
  const [addingTopic,   setAddingTopic]   = useState(false);
  const [topicInput,    setTopicInput]    = useState("");
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

  const allTrends = useMemo(() => [...TRENDS, ...appliedDynamicTrends], [appliedDynamicTrends]);
  const visibleTrends = useMemo(() =>
    allTrends.filter(t => !t.topics?.length || t.topics.some(tp => appliedTopics.includes(tp))),
    [allTrends, appliedTopics]
  );
  const hasPendingChanges = useMemo(() =>
    JSON.stringify([...activeTopics].sort()) !== JSON.stringify([...appliedTopics].sort()),
    [activeTopics, appliedTopics]
  );

  const allSignals = useMemo(() => [...SIGNALS, ...EXTENDED_SIGNALS, ...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const allExtraSignals = useMemo(() => [...extraSignals, ...liveSignals, ...generatedSignals], [extraSignals, liveSignals, generatedSignals]);
  const { nodes: graphNodes, edges: graphEdges } = useMemo(() => buildGraph(allExtraSignals, seenIds, visibleTrends), [allExtraSignals, seenIds, visibleTrends]);
  const fitViewRef = useRef<(() => void) | null>(null);

  const addTopic = useCallback(async (raw: string) => {
    const key = normaliseTopicKey(raw);
    if (!key || activeTopics.includes(key)) return;
    setActiveTopics(prev => [...prev, key]);
    setTopicInput("");
    setAddingTopic(false);

    // Use pre-built library first
    const libraryTrends = (TOPIC_LIBRARY[key] ?? []).filter(t =>
      !TRENDS.find(e => e.id === t.id) && !dynamicTrends.find(e => e.id === t.id)
    );
    if (libraryTrends.length) {
      setDynamicTrends(prev => [...prev, ...libraryTrends]);
      return;
    }

    // Otherwise generate via Claude
    setGeneratingTopic(key);
    try {
      const existingIds = [...TRENDS, ...dynamicTrends].map(t => t.id);
      const res = await fetch("/api/generate-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: key, existingTrendIds: existingIds, positionOffset: dynamicTrends.length }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.trends as Array<{ trend: Trend; signals: Signal[] }>;
        setDynamicTrends(prev => [...prev, ...items.map(i => i.trend)]);
        setGeneratedSignals(prev => [...prev, ...items.flatMap(i => i.signals)]);
      }
    } catch (err) {
      console.error("generate-trends failed:", err);
    } finally {
      setGeneratingTopic(null);
    }
  }, [activeTopics, dynamicTrends]);

  const removeTopic = useCallback((topic: string) => {
    setActiveTopics(prev => {
      const next = prev.filter(t => t !== topic);
      setDynamicTrends(dt => {
        const kept = dt.filter(t => t.topics?.some(tp => next.includes(tp)));
        const removedIds = new Set(dt.filter(t => !kept.includes(t)).map(t => t.id));
        setGeneratedSignals(gs => gs.filter(s => !removedIds.has(s.trendId ?? "")));
        return kept;
      });
      return next;
    });
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = [...TRENDS, ...appliedDynamicTrends].find((t) => t.id === node.id);
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

  // Clamp focusIdx when visibleTrends shrinks after topics are applied
  useEffect(() => {
    setFocusIdx(i => Math.min(i, Math.max(0, visibleTrends.length - 1)));
  }, [visibleTrends.length]);

  const focusTrend = visibleTrends[Math.min(focusIdx, visibleTrends.length - 1)] ?? visibleTrends[0];
  const focusTrendPos = TREND_POSITIONS[focusTrend?.id] ?? focusTrend?.position ?? { x: 0, y: 0 };

  const prev = () => setFocusIdx((i) => Math.max(0, i - 1));
  const next = () => setFocusIdx((i) => Math.min(visibleTrends.length - 1, i + 1));

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "fixed", inset: 0, background: "#ffffff" }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
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
        position: "absolute", top: 52, left: 0, right: 0, zIndex: 9,
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
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && topicInput.trim()) addTopic(topicInput.trim());
              if (e.key === "Escape") { setAddingTopic(false); setTopicInput(""); }
            }}
            onBlur={() => { if (!topicInput.trim()) { setAddingTopic(false); } }}
            placeholder="e.g. gaming, wellness…"
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
        {hasPendingChanges && (
          <button
            onClick={() => {
              setAppliedTopics(activeTopics);
              setAppliedDynamicTrends(dynamicTrends);
              setTimeout(() => fitViewRef.current?.(), 80);
            }}
            style={{
              flexShrink: 0, height: 28, padding: "0 14px",
              border: "none", borderRadius: 20,
              fontSize: 11, fontWeight: 700, color: "#fff",
              background: "#111", cursor: "pointer",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              display: "flex", alignItems: "center", gap: 4,
              marginLeft: 4,
            }}
          >
            Update board
          </button>
        )}
      </div>

      {/* Summary strip — click anywhere to open */}
      <div
        onClick={() => setSummaryOpen(true)}
        role="button"
        style={{
          position: "absolute", top: 96, left: 0, right: 0, zIndex: 9,
          padding: "10px 12px 10px 20px",
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 8,
          cursor: "pointer", WebkitTapHighlightColor: "transparent",
        } as React.CSSProperties}
      >
        <p style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: "#000", lineHeight: 1.55, letterSpacing: "-0.01em", fontFamily: "'EB Garamond', Georgia, serif", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
          {RADAR_OVERVIEW}
        </p>
        <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e8e4de", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#555", lineHeight: 1 }}>
          ↓
        </span>
      </div>

      {/* Summary expanded overlay */}
      {summaryOpen && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", flexDirection: "column" }}
          onClick={() => setSummaryOpen(false)}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", top: 96, left: 0, right: 0,
              background: "#fff",
              borderBottom: "1px solid rgba(0,0,0,0.09)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
              maxHeight: "60svh", overflowY: "auto", WebkitOverflowScrolling: "touch",
              padding: "18px 20px 0",
            } as React.CSSProperties}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {"What you're tracking"}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#000", lineHeight: 1.2, letterSpacing: "-0.03em", fontFamily: "'EB Garamond', Georgia, serif", margin: 0 }}>
                  {appliedTopics.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" × ")}
                </h3>
              </div>
              <button
                onClick={() => setSummaryOpen(false)}
                aria-label="Close overview"
                style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "none", background: "#f0f0f0", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
              >×</button>
            </div>

            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.65, margin: "12px 0 16px" }}>
              Every trend here is a place where something new is genuinely happening at the intersection of tech and the topics you are tracking.
            </p>

            {/* Per-topic descriptions */}
            {appliedTopics.map(topic => TOPIC_DESCRIPTIONS[topic] ? (
              <div key={topic} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: darkenColor(TOPIC_COLORS[topic] ?? "#aaa", 0.55), textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {topic}
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>
                  {TOPIC_DESCRIPTIONS[topic]}
                </p>
              </div>
            ) : null)}

            {/* Visible trend list */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f0ede8" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {visibleTrends.length} trends on the board
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {visibleTrends.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: darkenColor(t.color), marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.3, fontFamily: "'EB Garamond', Georgia, serif" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, marginTop: 2 }}>{t.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit */}
            <div style={{ borderTop: "1px solid #f0ede8", padding: "14px 0 20px", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Vibe coded by Martina —{" "}
                <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Augmented Rarity
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        style={{ position: "absolute", inset: 0, paddingTop: 158, paddingBottom: 80 }}
        onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.changedTouches[0].clientX - swipeStart.current;
          if (dx < -50) next();
          else if (dx > 50) prev();
          swipeStart.current = null;
        }}
      >
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
          <BoardController fitViewRef={fitViewRef} />
          {focusTrend && <FocusController trendId={focusTrend.id} trendPos={focusTrendPos} />}
        </ReactFlow>
      </div>

      {/* Nav bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "0 24px", gap: 16,
      }}>
        <button
          onClick={prev}
          disabled={focusIdx === 0}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #e8e4de",
            background: focusIdx === 0 ? "#f5f3ee" : "#fff",
            fontSize: 20, color: focusIdx === 0 ? "#ccc" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: focusIdx === 0 ? "default" : "pointer", flexShrink: 0,
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
            {focusIdx + 1} / {visibleTrends.length}
          </div>
        </div>

        <button
          onClick={next}
          disabled={focusIdx === visibleTrends.length - 1}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #e8e4de",
            background: focusIdx === visibleTrends.length - 1 ? "#f5f3ee" : "#fff",
            fontSize: 20, color: focusIdx === visibleTrends.length - 1 ? "#ccc" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: focusIdx === visibleTrends.length - 1 ? "default" : "pointer", flexShrink: 0,
          }}
        >›</button>
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
