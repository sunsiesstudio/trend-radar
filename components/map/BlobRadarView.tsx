"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Trend, Signal } from "@/types";
import { SIGNALS } from "@/lib/trends";
import { EXTENDED_SIGNALS, LIBRARY_TOPICS, FEATURED_TOPICS, TOPIC_COLORS } from "@/lib/extended-trends";

// ── Helpers ───────────────────────────────────────────────────────────────────

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function blobAgeFactor(latestDate?: string): number {
  const ageDays = latestDate ? (Date.now() - new Date(latestDate).getTime()) / 86_400_000 : 30;
  const t = Math.min(1, Math.max(0, ageDays / 30));
  return 0.78 - t * 0.28;
}

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
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b) >>> 0; h ^= h >>> 16;
  let g = 0x811c9dc5 ^ id.length;
  for (let i = id.length - 1; i >= 0; i--) { g ^= id.charCodeAt(i); g = Math.imul(g, 0x01000193) >>> 0; }
  g ^= g >>> 16; g = Math.imul(g, 0x45d9f3b) >>> 0; g ^= g >>> 16;
  const v = (seed: number) => 28 + (seed % 52);
  return `${v(h & 0xff)}% ${v((h >> 8) & 0xff)}% ${v((h >> 16) & 0xff)}% ${v((h >>> 24) & 0xff)}% / ${v(g & 0xff)}% ${v((g >> 8) & 0xff)}% ${v((g >> 16) & 0xff)}% ${v((g >>> 24) & 0xff)}%`;
}

const CIRCLE_D = 164;

// ── Tap hook (works on iOS Safari + Android Chrome inside ReactFlow) ──────────

function useTapHandlers(onTap: (() => void) | undefined) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      e.stopPropagation();
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.stopPropagation();
      if (!start.current || !onTap) return;
      const moved = Math.hypot(
        e.changedTouches[0].clientX - start.current.x,
        e.changedTouches[0].clientY - start.current.y,
      );
      start.current = null;
      if (moved < 8) { e.preventDefault(); onTap(); }
    },
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onTap?.(); },
  };
}

// ── Node components ───────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number; d: number; latestDate?: string; onTap?: () => void };
type SignalNodeData = { id: string; title: string; color: string; isNew: boolean; w: number; h: number; fillAlpha: string; borderAlpha: string; onTap?: () => void };

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const blobColor = darkenColor(data.color, blobAgeFactor(data.latestDate));
  const tap = useTapHandlers(data.onTap);
  return (
    <div
      {...tap}
      style={{
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
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  const tap = useTapHandlers(data.onTap);
  return (
    <div
      {...tap}
      style={{
        width: data.w, height: data.h,
        background: `${data.color}${data.fillAlpha}`,
        borderRadius: blobFromId(data.id),
        padding: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
        cursor: "pointer", userSelect: "none",
        boxSizing: "border-box",
        boxShadow: data.isNew ? `0 3px 18px ${data.color}55` : `0 1px 10px ${data.color}22`,
      }}>
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "#000", lineHeight: 1.35, letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ── Graph builder ─────────────────────────────────────────────────────────────

function buildGraph(trends: Trend[], signals: Signal[], topicAddedAt: Record<string, string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const GAP = 5;
  const N_ANGLES = 16;
  type P = { sig: Signal; w: number; h: number; fillAlpha: string; borderAlpha: string; isNew: boolean; x: number; y: number };
  type Blob = { cx: number; cy: number; r: number };

  const allBlobs: Blob[] = [];
  const allSignalPlacements: P[] = [];

  trends.forEach((trend, idx) => {
    const pos = trend.position ?? { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
    const trendSignals = signals
      .filter((s) => s.trendId === trend.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
    const topicKey = trend.topics?.[0];
    const latestDate = topicKey ? topicAddedAt[topicKey] : undefined;
    const d = Math.round(75 + ((trend.relevanceScore ?? 50) / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore ?? 50, d, latestDate } as TrendNodeData,
    });

    const MAX_R = d / 2 + 280;
    const placements: P[] = [];

    trendSignals.forEach((sig) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      let h2 = 0;
      for (let k = 0; k < sig.id.length; k++) h2 = (h2 * 37 + sig.id.charCodeAt(k) * 17) >>> 0;
      const baseAngle = ((h & 0xffffff) / 0x1000000) * Math.PI * 2;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(165, Math.round(charsPerLine * 5.8) + 20));
      const innerW = w - 16;
      const estCharsPerLine = Math.max(1, Math.floor(innerW / 6.0));
      const estLines = Math.ceil(sig.title.length / estCharsPerLine);
      const sigH = Math.round(Math.min(78, Math.max(w * 0.72, estLines * 13 + 18)));
      const { fillAlpha, borderAlpha } = ageAlpha(sig.date);

      let x = cx, y = cy;

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

      let placed = tryPlace(d / 2 + GAP, MAX_R, true);
      if (!placed) placed = tryPlace(MAX_R + 3, MAX_R + 120, false);
      if (!placed) {
        x = cx + (MAX_R + 160) * Math.cos(baseAngle) - w / 2;
        y = cy + (MAX_R + 160) * Math.sin(baseAngle) - sigH / 2;
      }

      const entry: P = { sig, w, h: sigH, fillAlpha, borderAlpha, isNew: false, x, y };
      placements.push(entry);
      allSignalPlacements.push(entry);
    });

    placements.forEach(({ sig, w, h, fillAlpha, borderAlpha, isNew, x, y }) => {
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x, y },
        data: { id: sig.id, title: sig.title, color: trend.color, isNew, w, h, fillAlpha, borderAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 1, opacity: 0.18 },
      });
    });
  });

  return { nodes, edges };
}

// ── Controllers (must be children of ReactFlow) ───────────────────────────────

function BoardController({ fitViewRef }: {
  fitViewRef: React.MutableRefObject<(() => void) | null>;
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitViewRef.current = () => fitView({ duration: 420, padding: 0.08 });
  }, [fitView, fitViewRef]);
  return null;
}

// idx === -1 → overview (fitView all); idx >= 0 → zoom to trend cluster
// trendsKey changes whenever the trend set changes, forcing a re-fit on new topic loads
function FocusController({ trendId, signalIds, idx, trendsKey }: {
  trendId: string | undefined;
  signalIds: string[];
  idx: number;
  trendsKey: string;
}) {
  const { fitView } = useReactFlow();
  const prevKey       = useRef("");
  const prevTrendsKey = useRef("");
  const timerRef      = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const key = idx < 0 ? `__overview__:${trendsKey}` : `${trendId ?? "?"}:${idx}`;
    if (key === prevKey.current) return;
    const isFirst      = prevKey.current === "";
    const trendsChanged = trendsKey !== prevTrendsKey.current;
    prevKey.current       = key;
    prevTrendsKey.current = trendsKey;
    // Instant when topic loads (isFirst or trendsChanged); animated only for arrow navigation
    const instant = isFirst || trendsChanged;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (idx < 0) {
        fitView({ duration: instant ? 0 : 600, padding: 0.42 });
      } else if (trendId) {
        const fitNodes = [{ id: trendId }, ...signalIds.map(id => ({ id }))];
        fitView({ nodes: fitNodes, duration: instant ? 0 : 420, padding: 0.22 });
      }
    }, instant ? 80 : 400);
  }, [trendId, signalIds, idx, trendsKey, fitView]);
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  trends: Trend[];
  signals?: Signal[];
  topicAddedAt?: Record<string, string>;
  activeTopics: string[];
  generatingTopic?: string | null;
  onAddTopic: (topic: string) => void;
  onRemoveTopic: (topic: string) => void;
  onSelectTrend?: (trend: Trend) => void;
  onSelectSignal?: (signal: Signal) => void;
}

export function BlobRadarView({
  trends, signals, topicAddedAt = {},
  activeTopics, generatingTopic, onAddTopic, onRemoveTopic,
  onSelectTrend, onSelectSignal,
}: Props) {
  const fitViewRef = useRef<(() => void) | null>(null);
  // -1 = overview (zoomed out); >= 0 = focused on that trend
  const [focusIdx, setFocusIdx] = useState(-1);
  const [topicInput, setTopicInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sort highest-relevance first
  const sorted = useMemo(
    () => [...trends].sort((a, b) => (b.relevanceScore ?? 50) - (a.relevanceScore ?? 50)),
    [trends],
  );

  // A stable string that changes whenever the trend set changes — used by FocusController
  const trendsKey = useMemo(() => sorted.map(t => t.id).join(","), [sorted]);

  // Focus first trend when topic loads; back to overview when cleared
  useEffect(() => { setFocusIdx(trends.length > 0 ? 0 : -1); }, [trends]);

  const allSignals = useMemo(() => {
    const extra = signals ?? [];
    const base = [...SIGNALS, ...EXTENDED_SIGNALS];
    const extraIds = new Set(extra.map(s => s.id));
    return [...extra, ...base.filter(s => !extraIds.has(s.id))];
  }, [signals]);

  // Stable refs so node tap handlers don't need to be in useMemo deps
  const onSelectTrendRef = useRef(onSelectTrend);
  const onSelectSignalRef = useRef(onSelectSignal);
  onSelectTrendRef.current = onSelectTrend;
  onSelectSignalRef.current = onSelectSignal;

  const { nodes: baseNodes, edges } = useMemo(
    () => buildGraph(sorted, allSignals, topicAddedAt),
    [sorted, allSignals, topicAddedAt],
  );

  // Inject tap handlers into node data (refs keep this stable)
  const nodes = useMemo(() => {
    const trendMap = new Map(sorted.map((t, i) => [t.id, { trend: t, idx: i }]));
    const sigMap   = new Map(allSignals.map(s => [s.id, s]));
    return baseNodes.map(node => {
      if (node.type === "trendCircle") {
        const entry = trendMap.get(node.id);
        return { ...node, data: { ...node.data, onTap: () => {
          if (entry) { setFocusIdx(entry.idx); onSelectTrendRef.current?.(entry.trend); }
        }}};
      }
      if (node.type === "signalOrbit") {
        const sig = sigMap.get(node.id);
        return { ...node, data: { ...node.data, onTap: () => {
          if (sig) onSelectSignalRef.current?.(sig);
        }}};
      }
      return node;
    });
  }, [baseNodes, sorted, allSignals]);

  const safeIdx    = focusIdx >= 0 ? Math.min(focusIdx, sorted.length - 1) : -1;
  const focusTrend = safeIdx >= 0 ? sorted[safeIdx] : undefined;

  const focusSignalIds = useMemo(() => {
    if (!focusTrend) return [];
    return allSignals.filter(s => s.trendId === focusTrend.id).map(s => s.id);
  }, [focusTrend, allSignals]);

  // Arrows navigate radar focus only — tap a blob to open detail
  const prev = () => {
    setFocusIdx(i => i < 0 ? 0 : Math.max(0, i - 1));
  };
  const next = () => {
    setFocusIdx(i => i < 0 ? 0 : Math.min(sorted.length - 1, i + 1));
  };

  // ── Search helpers ────────────────────────────────────────────────────────────

  const topicSuggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    const available = LIBRARY_TOPICS.filter(t => !activeTopics.includes(t));
    if (!q) return available;
    return available.filter(t => t.includes(q) || t.replace(/-/g, " ").includes(q));
  }, [topicInput, activeTopics]);

  const inspirationPills = useMemo(
    () => FEATURED_TOPICS.filter(t => !activeTopics.includes(t)).slice(0, 8),
    [activeTopics],
  );

  function submitTopic(raw: string) {
    const key = raw.trim();
    if (!key) return;
    onAddTopic(key);
    setTopicInput("");
    setShowSuggestions(false);
  }

  // ── Empty state ───────────────────────────────────────────────────────────────

  if (trends.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f3" }}>
        <div style={{ textAlign: "center", padding: "0 32px", width: "100%", maxWidth: 460 }}>

          {generatingTopic ? (
            /* Loading state */
            <>
              <div style={{ fontSize: 15, color: "#aaa", fontFamily: "'EB Garamond', Georgia, serif" }}>
                Generating <em>{generatingTopic}</em>…
              </div>
            </>
          ) : (
            /* Search state */
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: "-0.02em" }}>
                What are we tracking?
              </div>

              {/* Search input */}
              <div style={{ position: "relative", marginTop: 18 }}>

                {/* Suggestions dropdown — opens downward */}
                {showSuggestions && topicSuggestions.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
                    background: "#fff", border: "1px solid #e8e4de", borderRadius: 14,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)", maxHeight: 220, overflowY: "auto", padding: "6px 0",
                  }}>
                    {topicSuggestions.slice(0, 8).map(topic => (
                      <button
                        key={topic}
                        onPointerDown={(e) => { e.preventDefault(); submitTopic(topic); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "9px 16px",
                          background: "none", border: "none", cursor: "pointer",
                          textAlign: "left", fontSize: 12, fontWeight: 600,
                          color: "#222", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: TOPIC_COLORS[topic] ?? "#ccc", flexShrink: 0, display: "inline-block" }} />
                        {topic.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f5f5f5", borderRadius: 28, padding: "10px 10px 10px 18px",
                }}>
                  <input
                    ref={inputRef}
                    value={topicInput}
                    onChange={(e) => { setTopicInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { submitTopic(topicSuggestions[0] ?? topicInput); }
                      if (e.key === "Escape") { setTopicInput(""); setShowSuggestions(false); }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search a culture topic to start"
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 14, fontWeight: 500, color: "#333",
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  />
                  <button
                    onClick={() => submitTopic(topicSuggestions[0] ?? topicInput)}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: topicInput.trim() ? "#000" : "#e0e0e0",
                      border: "none", cursor: topicInput.trim() ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke={topicInput.trim() ? "#fff" : "#bbb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Or try pills */}
              {!topicInput && inspirationPills.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <span style={{ fontSize: 11, color: "#ccc", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    or try
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
                    {inspirationPills.map(topic => {
                      const color = TOPIC_COLORS[topic] ?? "#aaa";
                      const dark = darkenColor(color);
                      return (
                        <button
                          key={topic}
                          onClick={() => submitTopic(topic)}
                          style={{
                            padding: "4px 10px 4px 8px", borderRadius: 20,
                            background: `${color}18`, border: `1px solid ${color}44`,
                            fontSize: 11, fontWeight: 700, color: dark,
                            cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            display: "flex", alignItems: "center", gap: 5,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {topic.replace(/-/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
      </div>
    );
  }

  const isOverview = safeIdx < 0;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* ReactFlow canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          nodesDraggable={false}
          minZoom={0.04}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "#f8f7f3" }}
        >
          <BoardController fitViewRef={fitViewRef} />
          <FocusController trendId={focusTrend?.id} signalIds={focusSignalIds} idx={safeIdx} trendsKey={trendsKey} />
        </ReactFlow>
      </div>

      {/* Bottom nav */}
      {sorted.length > 0 && (
        <div style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))",
          background: "rgba(245,242,236,0.96)", backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          gap: 12,
        }}>
          <button
            onClick={prev}
            disabled={isOverview || safeIdx <= 0}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent",
              border: (isOverview || safeIdx <= 0) ? "1.5px solid rgba(0,0,0,0.08)" : "1.5px solid rgba(0,0,0,0.18)",
              cursor: (isOverview || safeIdx <= 0) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke={(isOverview || safeIdx <= 0) ? "#ccc" : "#333"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ flex: 1, textAlign: "center" }}>
            {isOverview ? (
              <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "0.02em" }}>
                {sorted.length} trends — tap one to explore
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2 }}>
                  {focusTrend?.name}
                </div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {safeIdx + 1} / {sorted.length}
                </div>
              </>
            )}
          </div>

          <button
            onClick={next}
            disabled={!isOverview && safeIdx === sorted.length - 1}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent",
              border: (!isOverview && safeIdx === sorted.length - 1) ? "1.5px solid rgba(0,0,0,0.08)" : "1.5px solid rgba(0,0,0,0.18)",
              cursor: (!isOverview && safeIdx === sorted.length - 1) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12"
                stroke={(!isOverview && safeIdx === sorted.length - 1) ? "#ccc" : "#333"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    </div>
  );
}
