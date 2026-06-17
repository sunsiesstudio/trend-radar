"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  NodeProps,
  useNodesState,
  useEdgesState,
  NodeMouseHandler,
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

// Organic blob shapes per trend (CSS 8-value border-radius)
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

// Trends spaced widely so orbiting signals never overlap
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

type TrendNodeData = {
  id: string;
  name: string;
  color: string;
  score: number;
};

type SignalNodeData = {
  id: string;
  title: string;
  color: string;
  source?: string;
};

const SOURCE_ICON: Record<string, string> = {
  reddit: "●",
  arxiv: "◆",
  youtube: "▶",
  hackernews: "○",
  news: "·",
  manual: "·",
};

// Deterministic blob shape from string hash
function blobFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const v = (n: number) => 30 + (((h >> n) & 0x1f) % 41); // 30–70
  return `${v(0)}% ${100 - v(0)}% ${v(5)}% ${100 - v(5)}% / ${v(10)}% ${v(15)}% ${100 - v(15)}% ${100 - v(10)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const dark = !isLight(data.color);
  const blobR = BLOB[data.id] ?? "50%";
  return (
    <div
      style={{
        width: CIRCLE_D,
        height: CIRCLE_D,
        borderRadius: blobR,
        background: data.color,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 22,
        boxSizing: "border-box",
        cursor: "pointer",
        userSelect: "none",
        boxShadow: `0 6px 32px ${data.color}50`,
      }}
    >
      <div style={{
        fontSize: 11,
        fontWeight: 800,
        color: dark ? "#fff" : "#111",
        lineHeight: 1.22,
        letterSpacing: "-0.01em",
      }}>
        {data.name}
      </div>
      <div style={{
        marginTop: 8,
        fontSize: 9,
        fontWeight: 700,
        color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.32)",
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}>
        {data.score}%
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  const icon = SOURCE_ICON[data.source ?? "news"] ?? "·";
  const blobR = blobFromId(data.id);
  return (
    <div
      style={{
        width: SIG_W,
        minHeight: SIG_H,
        background: `${data.color}12`,
        border: `1.5px solid ${data.color}55`,
        borderRadius: blobR,
        padding: "8px 13px 8px 11px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",
        boxShadow: `0 2px 12px ${data.color}18`,
      }}
    >
      <span style={{ fontSize: 7, color: data.color, flexShrink: 0, opacity: 0.8 }}>{icon}</span>
      <div style={{
        fontSize: 9.5,
        fontWeight: 600,
        color: "#1a1a1a",
        lineHeight: 1.38,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        letterSpacing: "-0.01em",
      }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = {
  trendCircle: TrendCircleNode,
  signalOrbit: SignalOrbitNode,
};

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(
  extraSignals: Signal[],
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...extraSignals];

  TRENDS.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? { x: 0, y: 0 };

    nodes.push({
      id: trend.id,
      type: "trendCircle",
      position: pos,
      draggable: false,
      selectable: false,
      data: {
        id: trend.id,
        name: trend.name,
        color: trend.color,
        score: trend.relevanceScore,
      } as TrendNodeData,
    });

    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    const total = trendSignals.length;
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    trendSignals.forEach((sig, i) => {
      const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
      const ox = cx + ORBIT_R * Math.cos(angle);
      const oy = cy + ORBIT_R * Math.sin(angle);

      nodes.push({
        id: sig.id,
        type: "signalOrbit",
        position: { x: ox - SIG_W / 2, y: oy - SIG_H / 2 },
        draggable: false,
        selectable: false,
        data: {
          id: sig.id,
          title: sig.title,
          color: trend.color,
          source: sig.source,
        } as SignalNodeData,
      });

      edges.push({
        id: `spoke-${trend.id}-${sig.id}`,
        source: trend.id,
        target: sig.id,
        type: "straight",
        style: { stroke: trend.color, strokeWidth: 1.2, opacity: 0.3 },
      });
    });
  });

  // Cross-signal dashed links
  const seen = new Set<string>();
  allSignals.forEach((sig) => {
    (sig.crossLinks ?? []).forEach((targetId) => {
      const key = [sig.id, targetId].sort().join("--");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({
          id: `cross-${key}`,
          source: sig.id,
          target: targetId,
          type: "straight",
          style: { stroke: "#ccc", strokeWidth: 1, strokeDasharray: "4 4" },
        });
      }
    });
  });

  return { nodes, edges };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend,  setActiveTrend]  = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [extraSignals, setExtraSignals] = useState<Signal[]>([]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(extraSignals),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = TRENDS.find((t) => t.id === node.id);
      if (trend) setActiveTrend(trend);
    } else if (node.type === "signalOrbit") {
      const sig = [...SIGNALS, ...extraSignals].find((s) => s.id === node.id);
      if (sig) setActiveSignal(sig);
    }
  }, [extraSignals]);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  const allSignals = useMemo(() => [...SIGNALS, ...extraSignals], [extraSignals]);

  const activeTrendForSignal = activeSignal
    ? TRENDS.find((t) => t.id === activeSignal.trendId) ?? null
    : null;

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
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#111" }}>
          Trend Radar
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>
            {TRENDS.length} trends · {SIGNALS.length + extraSignals.length} signals
          </span>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "6px 16px", background: "#111", color: "#fff",
              border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            + Signal
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: "absolute", inset: 0, paddingTop: 52 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.06}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "#fff" }}
        >
          <Controls position="bottom-right" showInteractive={false} style={{ bottom: 24, right: 16 }} />
        </ReactFlow>
      </div>

      {activeTrend && (
        <TrendDetailModal
          trend={activeTrend}
          extraSignals={extraSignals}
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

      {showAdd && (
        <AddSignalModal
          onAdd={handleAddSignal}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
