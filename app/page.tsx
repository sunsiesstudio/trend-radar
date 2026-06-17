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
  style: { stroke: "#d1d5db", strokeWidth: 1, strokeDasharray: "4 3" },
  markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "#d1d5db" },
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
    <div className="w-screen h-screen overflow-hidden bg-[#f5f5f3] relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-5 z-30">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 tracking-tight text-sm">⚡ Trend Radar</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">
            {TRENDS.length} trends · {signals.length} signals
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs text-gray-400 mr-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-indigo-400 inline-block" />
              Trend node (click for report)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-gray-200 rounded inline-block" />
              Signal (click for detail)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border-t-2 border-dashed border-gray-300 w-5 inline-block" />
              Cross-trend link
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors"
          >
            + Add signal
          </button>
        </div>
      </div>

      {/* React Flow canvas */}
      <div className="w-full h-full pt-12">
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
          <Background color="#e8e8e4" gap={30} size={1} />
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
