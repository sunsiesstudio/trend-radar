"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import { Trend, Signal } from "@/types";
import { TRENDS, SIGNALS, computeLayout, getSourceIcon } from "@/lib/trends";
import { TrendNode } from "@/components/map/TrendNode";
import { SignalNodeMap } from "@/components/map/SignalNode";
import { SignalPopup } from "@/components/map/SignalPopup";
import { TrendPanel } from "@/components/map/TrendPanel";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// Node types defined outside component to avoid React Flow re-render issues
const nodeTypes = {
  trend: TrendNode,
  signal: SignalNodeMap,
};

// Cross-connection edge style
const crossEdge = {
  type: "default",
  animated: true,
  style: { stroke: "#3a3a3a", strokeWidth: 1.5, strokeDasharray: "5 4" },
  markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "#3a3a3a" },
};

export default function ConceptMap() {
  const { trends: layoutTrends, signalPositions } = useMemo(() => computeLayout(), []);

  const [signals, setSignals] = useState<Signal[]>(SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<(Trend & { radius: number }) | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [liveScores, setLiveScores] = useState<Record<string, number>>({});
  const [scoringTrendId, setScoringTrendId] = useState<string | null>(null);

  const handleSignalClick = useCallback((sig: Signal) => {
    setSelectedSignal(sig);
    setSelectedTrend(null);
  }, []);

  const handleTrendClick = useCallback((trend: Trend & { radius: number }) => {
    setSelectedTrend(trend);
    setSelectedSignal(null);
    // Fetch live score for this trend
    if (!liveScores[trend.id]) {
      setScoringTrendId(trend.id);
      fetch(`/api/score?trendId=${trend.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.blendedScore) setLiveScores((prev) => ({ ...prev, [trend.id]: d.blendedScore }));
        })
        .catch(() => {})
        .finally(() => setScoringTrendId(null));
    }
  }, [liveScores]);

  // Build initial nodes
  const buildNodes = useCallback(
    (sigs: Signal[], handlers: { onSignalClick: (s: Signal) => void; onTrendClick: (t: Trend & { radius: number }) => void }) => {
      const trendNodes: Node[] = layoutTrends.map((t) => ({
        id: t.id,
        type: "trend",
        position: { x: t.position.x - t.radius, y: t.position.y - t.radius },
        data: { ...t, onClick: handlers.onTrendClick },
        draggable: true,
      }));

      const signalNodes: Node[] = sigs.map((s) => {
        const pos = signalPositions.get(s.id) ?? { x: 0, y: 0 };
        const trend = layoutTrends.find((t) => t.id === s.trendId);
        return {
          id: s.id,
          type: "signal",
          position: pos,
          data: { ...s, trendColor: trend?.color ?? "#6366f1", onClick: handlers.onSignalClick },
          draggable: true,
        };
      });

      return [...trendNodes, ...signalNodes];
    },
    [layoutTrends, signalPositions]
  );

  const initialEdges: Edge[] = useMemo(() => {
    return signals.flatMap((s) =>
      (s.crossLinks ?? []).map((targetId) => ({
        id: `cross-${s.id}-${targetId}`,
        source: s.id,
        target: targetId,
        ...crossEdge,
      }))
    );
  }, [signals]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    buildNodes(SIGNALS, { onSignalClick: handleSignalClick, onTrendClick: handleTrendClick })
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, ...crossEdge }, eds)),
    [setEdges]
  );

  const addSignal = useCallback((signal: Signal) => {
    const trend = layoutTrends.find((t) => t.id === signal.trendId);
    if (!trend) return;
    const existing = signals.filter((s) => s.trendId === signal.trendId).length;
    const angle = (2 * Math.PI * existing) / (existing + 1) - Math.PI / 2;
    const orbitRadius = trend.radius + 200;
    const pos = {
      x: trend.position.x + orbitRadius * Math.cos(angle) - 95,
      y: trend.position.y + orbitRadius * Math.sin(angle) - 32,
    };
    setSignals((prev) => [...prev, signal]);
    setNodes((nds) => [
      ...nds,
      {
        id: signal.id,
        type: "signal",
        position: pos,
        data: { ...signal, trendColor: trend.color ?? "#6366f1", onClick: handleSignalClick },
        draggable: true,
      },
    ]);
  }, [signals, layoutTrends, setNodes, handleSignalClick]);

  const selectedSignalTrend = selectedSignal
    ? layoutTrends.find((t) => t.id === selectedSignal.trendId)
    : null;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#0a0a0a", position: "relative" }}>
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 52,
        backgroundColor: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e1e1e",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", zIndex: 30,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#f0ede8", letterSpacing: "-0.02em" }}>
            Trend Radar
          </span>
          <span style={{ width: 1, height: 16, backgroundColor: "#2a2a2a" }} />
          <span style={{ fontSize: 11, color: "#3a3a3a", fontWeight: 500 }}>
            {TRENDS.length} trends · {signals.length} signals
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 10, color: "#333", fontWeight: 600, letterSpacing: "0.04em" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FF2D78", display: "inline-block" }} />
              Click trend for report
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 5, backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: 2, display: "inline-block" }} />
              Click signal for detail
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, borderTop: "1.5px dashed #333", display: "inline-block" }} />
              Cross-trend link
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px",
              backgroundColor: "#f0ede8", color: "#0a0a0a",
              border: "none", borderRadius: 8,
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            + Add signal
          </button>
        </div>
      </div>

      {/* React Flow canvas */}
      <div style={{ width: "100%", height: "100%", paddingTop: 52 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.15}
          maxZoom={1.8}
          onPaneClick={() => { setSelectedSignal(null); setSelectedTrend(null); }}
        >
          <Background color="#1e1e1e" gap={32} size={1} />
          <Controls showInteractive={false} className="!bottom-6 !left-6 !top-auto" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "trend") return (n.data as Trend).color;
              const t = layoutTrends.find((t) => t.id === (n.data as Signal).trendId);
              return t?.color ?? "#ccc";
            }}
            className="!bg-white !border !border-gray-200 !rounded-xl !bottom-6 !right-6 !top-auto"
            zoomable
            pannable
          />
        </ReactFlow>
      </div>

      {/* Signal popup */}
      {selectedSignal && selectedSignalTrend && (
        <SignalPopup
          signal={selectedSignal}
          trendColor={selectedSignalTrend.color}
          trendName={selectedSignalTrend.name}
          onClose={() => setSelectedSignal(null)}
        />
      )}

      {/* Trend panel */}
      {selectedTrend && (
        <TrendPanel
          trend={
            liveScores[selectedTrend.id]
              ? { ...selectedTrend, relevanceScore: liveScores[selectedTrend.id] }
              : selectedTrend
          }
          onClose={() => setSelectedTrend(null)}
          loading={scoringTrendId === selectedTrend.id}
        />
      )}

      {/* Add signal modal */}
      {showAddModal && (
        <AddSignalModal
          onAdd={addSignal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
