"use client";

import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { Signal } from "@/types";
import { MOCK_SIGNALS, SIGNAL_EDGES, SIGNAL_TEMPLATES, getSignalColor } from "@/lib/signals";
import { SignalNode } from "@/components/SignalNode";
import { SignalEditModal } from "@/components/SignalEditModal";

const nodeTypes = { signal: SignalNode };

function signalToNode(signal: Signal, onEdit: (s: Signal) => void): Node {
  return {
    id: signal.id,
    type: "signal",
    position: signal.position ?? { x: Math.random() * 600, y: Math.random() * 400 },
    data: { ...signal, onEdit },
  };
}

const defaultEdgeStyle = {
  style: { stroke: "#c0b0a0", strokeWidth: 1.1 },
  labelStyle: { fontSize: 9, fill: "#9a8a7a" },
  labelBgStyle: { fill: "#ede8df", fillOpacity: 0.88 },
};

export default function CanvasPage() {
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    MOCK_SIGNALS.map((s) => signalToNode(s, setEditingSignal))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    SIGNAL_EDGES.map((e) => ({ ...e, ...defaultEdgeStyle }))
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeStyle }, eds)),
    [setEdges]
  );

  const syncNode = useCallback(
    (updated: Signal) => {
      setSignals((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setNodes((nds) =>
        nds.map((n) =>
          n.id === updated.id
            ? { ...n, data: { ...updated, onEdit: setEditingSignal } }
            : n
        )
      );
    },
    [setNodes]
  );

  const deleteSignal = useCallback(
    (id: string) => {
      setSignals((prev) => prev.filter((s) => s.id !== id));
      setNodes((nds) => nds.filter((n) => n.id !== id));
    },
    [setNodes]
  );

  const addSignal = useCallback(
    (templateIndex?: number) => {
      const id = crypto.randomUUID();
      const position = rfInstance
        ? rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
        : { x: 300, y: 300 };
      const template = templateIndex !== undefined ? SIGNAL_TEMPLATES[templateIndex].defaults : {};
      const newSignal: Signal = {
        id,
        trendId: "",
        source: "manual",
        sourceName: "Manual",
        date: new Date().toISOString().slice(0, 10),
        crossLinks: [],
        title: "New signal",
        summary: "",
        why_emerging: "",
        brand_relevance: "",
        category: "other",
        strength: "weak",
        sources: [],
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        manual: true,
        position,
        ...template,
      };
      setSignals((prev) => [...prev, newSignal]);
      setNodes((nds) => [...nds, signalToNode(newSignal, setEditingSignal)]);
      setEditingSignal(newSignal);
      setShowTemplates(false);
    },
    [rfInstance, setNodes]
  );

  const generateReport = useCallback(() => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      window.location.href = "/reports?from=canvas";
    }, 800);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-sm">Signal Canvas</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {signals.length} signals
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTemplates((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              + Add signal
            </button>
            {showTemplates && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg w-52 z-50 overflow-hidden">
                <div className="px-3 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                  Choose template
                </div>
                {SIGNAL_TEMPLATES.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => addSignal(i)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  onClick={() => addSignal()}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                >
                  Blank signal
                </button>
              </div>
            )}
          </div>
          <button
            onClick={generateReport}
            disabled={generatingReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-60"
          >
            {generatingReport ? "Generating…" : "Generate report"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-[#ede8df]" ref={wrapperRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.15}
          maxZoom={1.5}
        >
          <Background color="#d4cabd" gap={40} size={0.8} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {editingSignal && (
        <SignalEditModal
          signal={editingSignal}
          onSave={syncNode}
          onDelete={deleteSignal}
          onClose={() => setEditingSignal(null)}
        />
      )}
    </div>
  );
}
