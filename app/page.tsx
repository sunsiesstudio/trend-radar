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

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = "#ffffff";
const CIRCLE_D = 150;   // trend circle diameter
const SIG_W    = 188;
const SIG_H    = 38;
const SIG_GAP  = 7;
const SIG_BELOW = 20;

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}

// ─── Trend positions ──────────────────────────────────────────────────────────
const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 50,   y: 40   },
  "digital-identity":       { x: 310,  y: 20   },
  "ar-commerce":            { x: 570,  y: 50   },

  "biotech-beauty":         { x: 70,   y: 640  },
  "sustainable-materials":  { x: 330,  y: 615  },
  "3d-printing":            { x: 590,  y: 645  },
  "wearables":              { x: 850,  y: 510  },

  "neurotech":              { x: 90,   y: 1240 },
  "spatial-computing":      { x: 350,  y: 1215 },
  "longevity":              { x: 610,  y: 1250 },
};

// ─── Node types ───────────────────────────────────────────────────────────────

type TrendNodeData = {
  trendId: string;
  name: string;
  color: string;
  score: number;
  onClick: () => void;
};

type SignalNodeData = {
  title: string;
  color: string;
  sourceName?: string;
  onClick: () => void;
};

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const textColor = isLight(data.color) ? "#111" : "#fff";
  const subColor  = isLight(data.color) ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.55)";

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
        cursor: "pointer",
        userSelect: "none",
        textAlign: "center",
        padding: 18,
        boxSizing: "border-box",
        boxShadow: `0 2px 16px ${data.color}55`,
      }}
    >
      <div style={{
        fontSize: 11.5,
        fontWeight: 800,
        color: textColor,
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
      }}>
        {data.name}
      </div>
      <div style={{
        marginTop: 7,
        fontSize: 9,
        fontWeight: 700,
        color: subColor,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontFamily: "monospace",
      }}>
        {data.score}%
      </div>
    </div>
  );
}

function SignalDotNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div
      onClick={data.onClick}
      style={{
        width: SIG_W,
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        cursor: "pointer",
        userSelect: "none",
        padding: "2px 0",
      }}
    >
      <div style={{
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: data.color,
        flexShrink: 0,
        marginTop: 3,
      }} />
      <div style={{
        fontSize: 10.5,
        fontWeight: 500,
        color: "#1a1a1a",
        lineHeight: 1.38,
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
  trendCircle: TrendCircleNode,
  signalDot:   SignalDotNode,
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
        trendId: trend.id,
        name: trend.name,
        color: trend.color,
        score: trend.relevanceScore,
        onClick: () => onTrendClick(trend),
      } as TrendNodeData,
    });

    // Signal dots — centered column below circle
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    trendSignals.forEach((sig, i) => {
      const sigX = pos.x + (CIRCLE_D - SIG_W) / 2;
      const sigY = pos.y + CIRCLE_D + SIG_BELOW + i * (SIG_H + SIG_GAP);

      nodes.push({
        id: sig.id,
        type: "signalDot",
        position: { x: sigX, y: sigY },
        draggable: false,
        selectable: false,
        data: {
          title: sig.title,
          color: trend.color,
          sourceName: sig.sourceName,
          onClick: () => onSignalClick(sig),
        } as SignalNodeData,
      });

      // Connecting line: trend circle → signal dot
      edges.push({
        id: `link-${trend.id}-${sig.id}`,
        source: trend.id,
        target: sig.id,
        type: "straight",
        style: { stroke: trend.color, strokeWidth: 1.2, opacity: 0.35 },
      });
    });
  });

  // Cross-signal dashed edges
  const seenEdges = new Set<string>();
  allSignals.forEach((sig) => {
    (sig.crossLinks ?? []).forEach((targetId) => {
      const key = [sig.id, targetId].sort().join("--");
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        edges.push({
          id: `cross-${key}`,
          source: sig.id,
          target: targetId,
          type: "straight",
          style: { stroke: "#aaa", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 },
        });
      }
    });
  });

  return { nodes, edges };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend, setActiveTrend]   = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
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
      background: BG,
      // Subtle horizontal staff lines — nod to the musical score reference
      backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(0,0,0,0.04) 40px)",
    }}>
      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: "0 20px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#111",
        }}>
          Trend Radar
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.02em", fontFamily: "monospace" }}>
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
              letterSpacing: "0.01em",
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
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.1}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
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
