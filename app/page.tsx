"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  NodeProps,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { TRENDS, SIGNALS } from "@/lib/trends";
import { Trend, Signal } from "@/types";
import { TrendShape } from "@/components/map/TrendShape";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CARD_W = 200;
const CARD_H = 248;
const SIG_W = 190;
const SIG_H = 52;
const SIG_GAP = 7;
const SIG_BELOW = 18;

// Trend grid positions — Row 1 / Row 2 / Row 3
const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 60,   y: 40  },
  "digital-identity":       { x: 360,  y: 20  },
  "ar-commerce":            { x: 660,  y: 40  },

  "biotech-beauty":         { x: 60,   y: 650 },
  "sustainable-materials":  { x: 360,  y: 630 },
  "3d-printing":            { x: 660,  y: 650 },
  "wearables":              { x: 960,  y: 635 },

  "neurotech":              { x: 60,   y: 1260 },
  "spatial-computing":      { x: 360,  y: 1240 },
  "longevity":              { x: 660,  y: 1260 },
};

// Slight moodboard rotations per card
const ROTATIONS: Record<string, number> = {
  "ai-creativity": -1.4,
  "digital-identity": 1.1,
  "ar-commerce": -0.7,
  "biotech-beauty": 1.8,
  "sustainable-materials": -1.1,
  "3d-printing": 1.4,
  "wearables": -2.0,
  "neurotech": 0.9,
  "spatial-computing": -1.3,
  "longevity": 1.2,
};

// ─── Custom node types ────────────────────────────────────────────────────────

type TrendNodeData = {
  trendId: string;
  name: string;
  color: string;
  score: number;
  rotation: number;
  onClick: () => void;
};

type SignalNodeData = {
  title: string;
  color: string;
  sourceName?: string;
  date?: string;
  onClick: () => void;
};

function TrendCardNode({ data }: NodeProps<TrendNodeData>) {
  return (
    <div
      onClick={data.onClick}
      style={{
        width: CARD_W,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
        border: "1px solid #ece9e3",
        overflow: "hidden",
        cursor: "pointer",
        transform: `rotate(${data.rotation}deg)`,
        transformOrigin: "center",
        transition: "box-shadow 0.15s ease, transform 0.15s ease",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Color stripe top */}
      <div style={{ height: 3, background: data.color }} />

      {/* Shape art area */}
      <div style={{
        background: data.color + "0E",
        padding: "22px 20px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ width: 88, height: 88 }}>
          <TrendShape trendId={data.trendId} color={data.color} />
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: "12px 14px 16px", borderTop: "1px solid #f5f2ec" }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: data.color,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7,
        }}>
          {data.score}% relevance
        </div>
        <div
          className="serif"
          style={{
            fontSize: 13.5,
            lineHeight: 1.28,
            color: "#1a1a1a",
            letterSpacing: "-0.02em",
          }}
        >
          {data.name}
        </div>
      </div>
    </div>
  );
}

function SignalCardNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div
      onClick={data.onClick}
      style={{
        width: SIG_W,
        background: "#fff",
        border: "1px solid #ece9e3",
        borderLeft: `3px solid ${data.color}`,
        borderRadius: 8,
        padding: "7px 10px 8px",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 9, color: "#bbb", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {data.sourceName} {data.date ? `· ${data.date}` : ""}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#1a1a1a",
        lineHeight: 1.35,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = {
  trendCard: TrendCardNode,
  signalCard: SignalCardNode,
};

// ─── Build initial nodes & edges ──────────────────────────────────────────────

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
    const rot = ROTATIONS[trend.id] ?? 0;

    // Trend card node
    nodes.push({
      id: trend.id,
      type: "trendCard",
      position: pos,
      draggable: false,
      selectable: false,
      data: {
        trendId: trend.id,
        name: trend.name,
        color: trend.color,
        score: trend.relevanceScore,
        rotation: rot,
        onClick: () => onTrendClick(trend),
      } as TrendNodeData,
    });

    // Signal nodes — column below the trend card
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    trendSignals.forEach((sig, i) => {
      const sigX = pos.x + (CARD_W - SIG_W) / 2;
      const sigY = pos.y + CARD_H + SIG_BELOW + i * (SIG_H + SIG_GAP);

      nodes.push({
        id: sig.id,
        type: "signalCard",
        position: { x: sigX, y: sigY },
        draggable: false,
        selectable: false,
        data: {
          title: sig.title,
          color: trend.color,
          sourceName: sig.sourceName,
          date: sig.date
            ? new Date(sig.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : undefined,
          onClick: () => onSignalClick(sig),
        } as SignalNodeData,
      });
    });
  });

  // Cross-signal edges derived from crossLinks (deduplicated)
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
          style: { stroke: "#C8C3BA", strokeWidth: 1, strokeDasharray: "5 4" },
          animated: false,
        });
      }
    });
  });

  return { nodes, edges };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend, setActiveTrend] = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
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
      background: "#F5F2EC",
    }}>
      {/* Floating header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        padding: "0 16px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(245,242,236,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span className="serif" style={{ fontSize: 20, letterSpacing: "-0.03em", color: "#1a1a1a" }}>
          Trend Radar
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#aaa" }}>
            {TRENDS.length} trends · {SIGNALS.length + extraSignals.length} signals
          </span>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "7px 14px",
              background: "#1a1a1a",
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

      {/* React Flow canvas */}
      <div style={{ position: "absolute", inset: 0, paddingTop: 52 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.15}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          panOnScroll={false}
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "#F5F2EC" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1.2}
            color="#D9D4CB"
          />
          <Controls
            position="bottom-right"
            showInteractive={false}
            style={{ bottom: 24, right: 16 }}
          />
        </ReactFlow>
      </div>

      {/* Trend detail modal */}
      {activeTrend && (
        <TrendDetailModal
          trend={activeTrend}
          extraSignals={extraSignals}
          onClose={() => setActiveTrend(null)}
          onSelectSignal={(s) => setActiveSignal(s)}
        />
      )}

      {/* Signal popup */}
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

      {/* Add signal */}
      {showAdd && (
        <AddSignalModal
          onAdd={handleAddSignal}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
