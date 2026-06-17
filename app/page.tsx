"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  NodeProps,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { TRENDS, SIGNALS } from "@/lib/trends";
import { Trend, Signal } from "@/types";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// ─── Layout ───────────────────────────────────────────────────────────────────
const CIRCLE_D    = 160;   // trend circle diameter
const ORBIT_R     = 220;   // orbit radius (center-to-center)
const SIG_W       = 154;   // signal pill width
const SIG_H       = 44;    // signal pill height

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}

// Trends spaced 750 px apart so orbiting signals never clash
const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 80,   y: 80   },
  "digital-identity":       { x: 800,  y: 60   },
  "ar-commerce":            { x: 1520, y: 80   },

  "biotech-beauty":         { x: 120,  y: 920  },
  "sustainable-materials":  { x: 840,  y: 900  },
  "3d-printing":            { x: 1560, y: 920  },
  "wearables":              { x: 2280, y: 880  },

  "neurotech":              { x: 80,   y: 1760 },
  "spatial-computing":      { x: 800,  y: 1740 },
  "longevity":              { x: 1520, y: 1760 },
};

// ─── Node components ──────────────────────────────────────────────────────────

type TrendNodeData = {
  name: string;
  color: string;
  score: number;
  onClick: () => void;
};

type SignalNodeData = {
  title: string;
  color: string;
  onClick: () => void;
};

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const dark = !isLight(data.color);
  return (
    <div
      onClick={data.onClick}
      style={{
        width: CIRCLE_D,
        height: CIRCLE_D,
        borderRadius: "50%",
        background: data.color,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        boxSizing: "border-box",
        cursor: "pointer",
        userSelect: "none",
        boxShadow: `0 4px 24px ${data.color}55`,
      }}
    >
      <div style={{
        fontSize: 11.5,
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
        color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.38)",
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
  return (
    <div
      onClick={data.onClick}
      style={{
        width: SIG_W,
        background: `${data.color}12`,
        border: `1.5px solid ${data.color}`,
        borderRadius: 100,
        padding: "6px 12px 6px 8px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: data.color,
        flexShrink: 0,
      }} />
      <div style={{
        fontSize: 9.5,
        fontWeight: 600,
        color: "#111",
        lineHeight: 1.32,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        letterSpacing: "-0.005em",
      }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = {
  trendCircle:  TrendCircleNode,
  signalOrbit:  SignalOrbitNode,
};

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(
  extraSignals: Signal[],
  onTrendClick: (t: Trend) => void,
  onSignalClick: (s: Signal) => void,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...extraSignals];

  TRENDS.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? { x: 0, y: 0 };

    // Trend circle
    nodes.push({
      id: trend.id,
      type: "trendCircle",
      position: pos,
      draggable: false,
      selectable: false,
      data: {
        name: trend.name,
        color: trend.color,
        score: trend.relevanceScore,
        onClick: () => onTrendClick(trend),
      } as TrendNodeData,
    });

    // Signals orbit radially around the trend circle
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    const total = trendSignals.length;
    const trendCX = pos.x + CIRCLE_D / 2;
    const trendCY = pos.y + CIRCLE_D / 2;

    trendSignals.forEach((sig, i) => {
      // Distribute evenly around the circle, starting at the top
      const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
      const orbitX = trendCX + ORBIT_R * Math.cos(angle);
      const orbitY = trendCY + ORBIT_R * Math.sin(angle);

      nodes.push({
        id: sig.id,
        type: "signalOrbit",
        position: {
          x: orbitX - SIG_W / 2,
          y: orbitY - SIG_H / 2,
        },
        draggable: false,
        selectable: false,
        data: {
          title: sig.title,
          color: trend.color,
          onClick: () => onSignalClick(sig),
        } as SignalNodeData,
      });

      // Spoke from trend circle to signal
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`,
        source: trend.id,
        target: sig.id,
        type: "straight",
        style: { stroke: trend.color, strokeWidth: 1.4, opacity: 0.4 },
      });
    });
  });

  // Cross-signal links
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend,  setActiveTrend]  = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [extraSignals, setExtraSignals] = useState<Signal[]>([]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(extraSignals, setActiveTrend, setActiveSignal),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  return (
    <div style={{
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      inset: 0,
      background: "#fff",
    }}>
      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        height: 52,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
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
              padding: "6px 16px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
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
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.08}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "#fff" }}
        >
          <Controls
            position="bottom-right"
            showInteractive={false}
            style={{ bottom: 24, right: 16 }}
          />
        </ReactFlow>
      </div>

      {activeTrend && (
        <TrendDetailModal
          trend={activeTrend}
          extraSignals={extraSignals}
          onClose={() => setActiveTrend(null)}
          onSelectSignal={(s) => setActiveSignal(s)}
        />
      )}

      {activeSignal && (() => {
        const t = TRENDS.find((t) => t.id === activeSignal.trendId);
        return t ? (
          <SignalPopup
            signal={activeSignal}
            trendColor={t.color}
            trendName={t.name}
            onClose={() => setActiveSignal(null)}
          />
        ) : null;
      })()}

      {showAdd && (
        <AddSignalModal
          onAdd={handleAddSignal}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
