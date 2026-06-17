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
const BG = "#060c1e";
const BLOB_FILL = "rgba(80, 160, 255, 0.055)";
const BLOB_BORDER = "rgba(120, 200, 255, 0.38)";

// ─── Layout ───────────────────────────────────────────────────────────────────
const CARD_W = 250;
const CARD_H = 260;
const SIG_W = 188;
const SIG_H = 30;
const SIG_GAP = 6;
const SIG_BELOW = 18;

// Organic blob border-radius per trend — each blob is a different shape
const BLOB_RADII: Record<string, string> = {
  "ai-creativity":         "62% 38% 56% 44% / 46% 54% 46% 54%",
  "digital-identity":      "48% 52% 38% 62% / 60% 40% 62% 38%",
  "ar-commerce":           "55% 45% 62% 38% / 40% 60% 50% 50%",
  "biotech-beauty":        "40% 60% 55% 45% / 54% 46% 42% 58%",
  "sustainable-materials": "58% 42% 44% 56% / 48% 52% 60% 40%",
  "3d-printing":           "44% 56% 60% 40% / 56% 44% 38% 62%",
  "wearables":             "52% 48% 46% 54% / 38% 62% 54% 46%",
  "neurotech":             "60% 40% 52% 48% / 44% 56% 62% 38%",
  "spatial-computing":     "46% 54% 58% 42% / 60% 40% 46% 54%",
  "longevity":             "54% 46% 40% 60% / 52% 48% 56% 44%",
};

// Trend positions — tighter organic cluster
const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 50,   y: 50  },
  "digital-identity":       { x: 320,  y: 20  },
  "ar-commerce":            { x: 580,  y: 65  },

  "biotech-beauty":         { x: 80,   y: 400 },
  "sustainable-materials":  { x: 355,  y: 370 },
  "3d-printing":            { x: 610,  y: 415 },
  "wearables":              { x: 870,  y: 280 },

  "neurotech":              { x: 120,  y: 760 },
  "spatial-computing":      { x: 390,  y: 730 },
  "longevity":              { x: 650,  y: 775 },
};

const ROTATIONS: Record<string, number> = {
  "ai-creativity": -1.2,
  "digital-identity": 0.8,
  "ar-commerce": -0.5,
  "biotech-beauty": 1.4,
  "sustainable-materials": -0.9,
  "3d-printing": 1.1,
  "wearables": -1.7,
  "neurotech": 0.7,
  "spatial-computing": -1.1,
  "longevity": 1.0,
};

// ─── Node types ───────────────────────────────────────────────────────────────

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
  onClick: () => void;
};

function TrendBlobNode({ data }: NodeProps<TrendNodeData>) {
  const radii = BLOB_RADII[data.trendId] ?? "50%";

  return (
    <div
      onClick={data.onClick}
      style={{
        width: CARD_W,
        height: CARD_H,
        background: BLOB_FILL,
        borderRadius: radii,
        border: `1.5px solid ${BLOB_BORDER}`,
        boxShadow: `0 0 32px rgba(80,200,255,0.28), 0 0 80px rgba(60,160,255,0.10), inset 0 0 60px rgba(80,200,255,0.04)`,
        cursor: "pointer",
        transform: `rotate(${data.rotation}deg)`,
        userSelect: "none",
        WebkitUserSelect: "none",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "24px 22px",
        transition: "box-shadow 0.18s ease",
      }}
    >
      {/* Score watermark */}
      <div style={{
        position: "absolute",
        bottom: -10,
        right: 10,
        fontSize: 96,
        fontWeight: 900,
        color: "rgba(100,200,255,0.06)",
        lineHeight: 1,
        letterSpacing: "-0.06em",
        fontFamily: "monospace",
        pointerEvents: "none",
        userSelect: "none",
      }}>
        {data.score}
      </div>

      {/* Colour accent — glowing dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: data.color,
        boxShadow: `0 0 10px ${data.color}, 0 0 22px ${data.color}88`,
        flexShrink: 0,
      }} />

      {/* Trend name */}
      <div style={{
        fontSize: 14.5,
        fontWeight: 600,
        color: "rgba(210,235,255,0.88)",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        maxWidth: 190,
      }}>
        {data.name}
      </div>

      {/* Sci-fi data row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 24,
          height: 1,
          background: "rgba(100,200,255,0.35)",
        }} />
        <div style={{
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(100,200,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: "monospace",
        }}>
          {data.score}%
        </div>
      </div>
    </div>
  );
}

function SignalPillNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div
      onClick={data.onClick}
      style={{
        width: SIG_W,
        background: "rgba(80,160,255,0.06)",
        borderRadius: 100,
        border: "1px solid rgba(100,200,255,0.18)",
        padding: "5px 13px",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: data.color,
        boxShadow: `0 0 6px ${data.color}`,
        flexShrink: 0,
      }} />
      <div style={{
        fontSize: 10,
        fontWeight: 400,
        color: "rgba(180,220,255,0.65)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        letterSpacing: "0.005em",
      }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = {
  trendBlob: TrendBlobNode,
  signalPill: SignalPillNode,
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
    const rot = ROTATIONS[trend.id] ?? 0;

    nodes.push({
      id: trend.id,
      type: "trendBlob",
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

    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    trendSignals.forEach((sig, i) => {
      const sigX = pos.x + (CARD_W - SIG_W) / 2;
      const sigY = pos.y + CARD_H + SIG_BELOW + i * (SIG_H + SIG_GAP);

      nodes.push({
        id: sig.id,
        type: "signalPill",
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
    });
  });

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
          style: { stroke: "rgba(255,255,255,0.08)", strokeWidth: 1, strokeDasharray: "4 4" },
        });
      }
    });
  });

  return { nodes, edges };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

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
    <div style={{ width: "100vw", height: "100dvh", position: "fixed", inset: 0, background: BG }}>
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
        background: "rgba(6,12,30,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(100,200,255,0.1)",
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "rgba(180,220,255,0.9)",
        }}>
          Trend Radar
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(100,180,255,0.35)", letterSpacing: "0.04em", fontFamily: "monospace" }}>
            {TRENDS.length} trends · {SIGNALS.length + extraSignals.length} signals
          </span>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "6px 16px",
              background: "rgba(100,200,255,0.15)",
              color: "rgba(180,230,255,0.9)",
              border: "1px solid rgba(100,200,255,0.3)",
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
          minZoom={0.12}
          maxZoom={2}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: BG }}
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
