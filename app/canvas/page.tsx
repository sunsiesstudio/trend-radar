"use client";

import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { Signal } from "@/types";
import { MOCK_SIGNALS, getSignalColor } from "@/lib/signals";
import { SignalNode } from "@/components/SignalNode";
import { SignalEditModal } from "@/components/SignalEditModal";
import { Plus, FileText, Zap } from "lucide-react";

const nodeTypes = { signal: SignalNode };

function signalToNode(signal: Signal, onEdit: (s: Signal) => void): Node {
  return {
    id: signal.id,
    type: "signal",
    position: signal.position ?? { x: Math.random() * 600, y: Math.random() * 400 },
    data: { ...signal, onEdit },
  };
}

export default function CanvasPage() {
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    MOCK_SIGNALS.map((s) => signalToNode(s, setEditingSignal))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
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

  const addSignal = useCallback(() => {
    const id = crypto.randomUUID();
    const position = rfInstance
      ? rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      : { x: 300, y: 300 };
    const newSignal: Signal = {
      id,
      title: "New signal",
      summary: "Describe what this signal is about.",
      why_emerging: "Why is this gaining momentum?",
      brand_relevance: "What does this mean for brands?",
      category: "other",
      strength: "weak",
      sources: [],
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      manual: true,
      position,
    };
    setSignals((prev) => [...prev, newSignal]);
    setNodes((nds) => [...nds, signalToNode(newSignal, setEditingSignal)]);
    setEditingSignal(newSignal);
  }, [rfInstance, setNodes]);

  const generateReport = useCallback(() => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      window.location.href = "/reports?from=canvas";
    }, 1200);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-indigo-600" />
          <span className="font-bold text-gray-900">Signal Canvas</span>
          <span className="ml-2 text-xs text-gray-400">{signals.length} signals</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addSignal}
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 font-medium"
          >
            <Plus size={15} />
            Add signal
          </button>
          <button
            onClick={generateReport}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-60"
          >
            <FileText size={15} />
            {generatingReport ? "Generating…" : "Generate report"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#e5e7eb" gap={24} />
          <Controls />
          <MiniMap
            nodeColor={(n) => getSignalColor((n.data as Signal).category)}
            className="!bg-white !border !border-gray-200 !rounded-xl"
          />
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
