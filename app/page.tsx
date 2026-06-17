"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  NodeProps,
  NodeMouseHandler,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { TRENDS, SIGNALS } from "@/lib/trends";
import { Trend, Signal } from "@/types";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE_D = 164;
const ORBIT_R  = 230;
const SIG_W    = 158;
const SIG_H    = 44;

const BLOB: Record<string, string> = {
  "ai-creativity":         "65% 35% 40% 60% / 55% 45% 55% 45%",
  "digital-identity":      "45% 55% 65% 35% / 35% 65% 45% 55%",
  "ar-commerce":           "55% 45% 35% 65% / 65% 35% 55% 45%",
  "biotech-beauty":        "40% 60% 55% 45% / 60% 40% 35% 65%",
  "sustainable-materials": "70% 30% 45% 55% / 45% 55% 65% 35%",
  "3d-printing":           "35% 65% 60% 40% / 55% 45% 40% 60%",
  "wearables":             "50% 50% 40% 60% / 65% 35% 50% 50%",
  "neurotech":             "60% 40% 50% 50% / 40% 60% 35% 65%",
  "spatial-computing":     "45% 55% 70% 30% / 50% 50% 45% 55%",
  "longevity":             "55% 45% 45% 55% / 70% 30% 60% 40%",
};

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}

const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 80,   y: 80   },
  "digital-identity":       { x: 820,  y: 60   },
  "ar-commerce":            { x: 1560, y: 80   },
  "biotech-beauty":         { x: 120,  y: 940  },
  "sustainable-materials":  { x: 860,  y: 920  },
  "3d-printing":            { x: 1600, y: 940  },
  "wearables":              { x: 2340, y: 900  },
  "neurotech":              { x: 80,   y: 1800 },
  "spatial-computing":      { x: 820,  y: 1780 },
  "longevity":              { x: 1560, y: 1800 },
};

// ─── Node types ───────────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number };
type SignalNodeData = { id: string; title: string; color: string; source?: string; isLive?: boolean };

const SOURCE_ICON: Record<string, string> = {
  reddit: "●", arxiv: "◆", youtube: "▶", hackernews: "○", news: "·", manual: "·",
};

function blobFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const v = (n: number) => 30 + (((h >> n) & 0x1f) % 41);
  return `${v(0)}% ${100 - v(0)}% ${v(5)}% ${100 - v(5)}% / ${v(10)}% ${v(15)}% ${100 - v(15)}% ${100 - v(10)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const dark = !isLight(data.color);
  return (
    <div style={{
      width: CIRCLE_D, height: CIRCLE_D,
      borderRadius: BLOB[data.id] ?? "50%",
      background: data.color,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: 22,
      boxSizing: "border-box", cursor: "pointer", userSelect: "none",
      boxShadow: `0 6px 32px ${data.color}50`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: dark ? "#fff" : "#111", lineHeight: 1.22, letterSpacing: "-0.01em" }}>
        {data.name}
      </div>
      <div style={{ marginTop: 8, fontSize: 9, fontWeight: 700, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.32)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {data.score}%
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div style={{
      width: SIG_W,
      background: data.isLive ? `${data.color}18` : `${data.color}12`,
      border: `1.5px solid ${data.isLive ? data.color + "88" : data.color + "55"}`,
      borderRadius: blobFromId(data.id),
      padding: "8px 13px 8px 11px",
      display: "flex", alignItems: "flex-start", gap: 6,
      cursor: "pointer", userSelect: "none",
      boxSizing: "border-box",
      boxShadow: `0 2px 12px ${data.color}18`,
      position: "relative",
    }}>
      {data.isLive && (
        <span style={{
          position: "absolute", top: 5, right: 7,
          width: 5, height: 5, borderRadius: "50%",
          background: "#00c47a",
        }} />
      )}
      <span style={{ fontSize: 7, color: data.color, flexShrink: 0, opacity: 0.8, marginTop: 3 }}>
        {SOURCE_ICON[data.source ?? "news"] ?? "·"}
      </span>
      <div style={{ fontSize: 9.5, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.42, letterSpacing: "-0.01em" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(extraSignals: Signal[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...extraSignals];

  TRENDS.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? { x: 0, y: 0 };
    nodes.push({
      id: trend.id, type: "trendCircle", position: pos,
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore } as TrendNodeData,
    });

    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    const total = trendSignals.length;
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    trendSignals.forEach((sig, i) => {
      const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x: cx + ORBIT_R * Math.cos(angle) - SIG_W / 2, y: cy + ORBIT_R * Math.sin(angle) - SIG_H / 2 },
        data: { id: sig.id, title: sig.title, color: trend.color, source: sig.source, isLive: sig.isLive } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 1.2, opacity: 0.3 },
      });
    });
  });

  const seen = new Set<string>();
  allSignals.forEach((sig) => {
    (sig.crossLinks ?? []).forEach((targetId) => {
      const key = [sig.id, targetId].sort().join("--");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ id: `cross-${key}`, source: sig.id, target: targetId, type: "straight", style: { stroke: "#ccc", strokeWidth: 1, strokeDasharray: "4 4" } });
      }
    });
  });

  return { nodes, edges };
}

// ─── Mobile: focus one trend cluster ─────────────────────────────────────────

function FocusController({ trendId }: { trendId: string }) {
  const { fitBounds } = useReactFlow();
  const first = useRef(true);

  useEffect(() => {
    const pos = TREND_POSITIONS[trendId] ?? { x: 0, y: 0 };
    const pad = 48;
    fitBounds(
      {
        x: pos.x - ORBIT_R - SIG_W / 2 - pad,
        y: pos.y - ORBIT_R - SIG_H - pad,
        width:  CIRCLE_D + 2 * (ORBIT_R + SIG_W / 2) + pad * 2,
        height: CIRCLE_D + 2 * (ORBIT_R + SIG_H)     + pad * 2,
      },
      { duration: first.current ? 0 : 420 },
    );
    first.current = false;
  }, [trendId, fitBounds]);

  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend,  setActiveTrend]  = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [extraSignals, setExtraSignals] = useState<Signal[]>([]);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [focusIdx,     setFocusIdx]     = useState(0);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/live-signals")
        .then((r) => r.json())
        .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); } })
        .catch(() => { if (!cancelled) setLiveLoading(false); });
    };
    load();
    const timer = setInterval(load, 2 * 60 * 60 * 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  const allExtraSignals = useMemo(() => [...extraSignals, ...liveSignals], [extraSignals, liveSignals]);
  const { nodes: graphNodes, edges: graphEdges } = useMemo(() => buildGraph(allExtraSignals), [allExtraSignals]);
  const [nodes, setNodes] = useNodesState(graphNodes);
  const [edges, setEdges] = useEdgesState(graphEdges);

  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphNodes, graphEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = TRENDS.find((t) => t.id === node.id);
      if (trend) setActiveTrend(trend);
    } else if (node.type === "signalOrbit") {
      const sig = [...SIGNALS, ...extraSignals, ...liveSignals].find((s) => s.id === node.id);
      if (sig) setActiveSignal(sig);
    }
  }, [extraSignals, liveSignals]);

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  const allSignals = useMemo(() => [...SIGNALS, ...extraSignals, ...liveSignals], [extraSignals, liveSignals]);
  const activeTrendForSignal = activeSignal ? TRENDS.find((t) => t.id === activeSignal.trendId) ?? null : null;

  const prev = () => setFocusIdx((i) => Math.max(0, i - 1));
  const next = () => setFocusIdx((i) => Math.min(TRENDS.length - 1, i + 1));
  const focusTrend = TRENDS[focusIdx];

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "fixed", inset: 0, background: "#fff" }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        height: 52, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#111" }}>Trend Radar</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>
            {TRENDS.length} trends · {SIGNALS.length + extraSignals.length} signals
            {liveSignals.length > 0 && (
              <span style={{ color: "#00c47a", marginLeft: 6, fontWeight: 700 }}>
                +{liveSignals.length} live
              </span>
            )}
            {liveLoading && <span style={{ marginLeft: 6, opacity: 0.4 }}>●</span>}
          </span>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "6px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            + Signal
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{ position: "absolute", inset: 0, paddingTop: 52, paddingBottom: 80 }}
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
          nodes={nodes}
          edges={edges}
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
          style={{ background: "#fff" }}
        >
          <FocusController trendId={focusTrend.id} />
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
            borderRadius: "50%", background: focusTrend.color, marginBottom: 5,
          }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {focusTrend.name}
          </div>
          <div style={{ fontSize: 10, color: "#bbb", marginTop: 3, fontFamily: "monospace" }}>
            {focusIdx + 1} / {TRENDS.length}
          </div>
        </div>

        <button
          onClick={next}
          disabled={focusIdx === TRENDS.length - 1}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #e8e4de",
            background: focusIdx === TRENDS.length - 1 ? "#f5f3ee" : "#fff",
            fontSize: 20, color: focusIdx === TRENDS.length - 1 ? "#ccc" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: focusIdx === TRENDS.length - 1 ? "default" : "pointer", flexShrink: 0,
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
          allSignals={allSignals}
          onClose={() => setActiveSignal(null)}
          onSelectSignal={(s) => setActiveSignal(s)}
        />
      )}

      {showAdd && <AddSignalModal onAdd={handleAddSignal} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
