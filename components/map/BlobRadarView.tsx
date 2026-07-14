"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  NodeMouseHandler,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Trend, Signal } from "@/types";
import { SIGNALS } from "@/lib/trends";
import { EXTENDED_SIGNALS } from "@/lib/extended-trends";

// ── Helpers ───────────────────────────────────────────────────────────────────

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function blobAgeFactor(latestDate?: string): number {
  const ageDays = latestDate ? (Date.now() - new Date(latestDate).getTime()) / 86_400_000 : 30;
  const t = Math.min(1, Math.max(0, ageDays / 30));
  return 0.78 - t * 0.28;
}

function ageAlpha(date: string | undefined): { fillAlpha: string; borderAlpha: string } {
  const ageDays = date ? (Date.now() - new Date(date).getTime()) / 86_400_000 : 30;
  const t = Math.pow(Math.min(1, Math.max(0, ageDays / 180)), 0.6);
  const fill   = Math.round(0x2E + t * (0xCC - 0x2E));
  const border = Math.round(0x44 + t * (0xDD - 0x44));
  return {
    fillAlpha:   fill.toString(16).padStart(2, "0"),
    borderAlpha: border.toString(16).padStart(2, "0"),
  };
}

function blobFromId(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b) >>> 0; h ^= h >>> 16;
  let g = 0x811c9dc5 ^ id.length;
  for (let i = id.length - 1; i >= 0; i--) { g ^= id.charCodeAt(i); g = Math.imul(g, 0x01000193) >>> 0; }
  g ^= g >>> 16; g = Math.imul(g, 0x45d9f3b) >>> 0; g ^= g >>> 16;
  const v = (seed: number) => 28 + (seed % 52);
  return `${v(h & 0xff)}% ${v((h >> 8) & 0xff)}% ${v((h >> 16) & 0xff)}% ${v((h >>> 24) & 0xff)}% / ${v(g & 0xff)}% ${v((g >> 8) & 0xff)}% ${v((g >> 16) & 0xff)}% ${v((g >>> 24) & 0xff)}%`;
}

const CIRCLE_D = 164;

// ── Node components ───────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number; d: number; latestDate?: string };
type SignalNodeData = { id: string; title: string; color: string; isNew: boolean; w: number; h: number; fillAlpha: string; borderAlpha: string };

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const blobColor = darkenColor(data.color, blobAgeFactor(data.latestDate));
  return (
    <div>
      <div style={{
        width: data.d, height: data.d,
        borderRadius: blobFromId(data.id),
        background: blobColor,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 22,
        boxSizing: "border-box", cursor: "pointer", userSelect: "none",
        boxShadow: `0 6px 32px ${data.color}66`,
      }}>
        <div style={{ fontSize: Math.round(9 + data.d / 30), fontWeight: 700, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.02em", fontFamily: "'EB Garamond', Georgia, serif" }}>
          {data.name}
        </div>
        <div style={{ marginTop: 5, fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          {data.score}%
        </div>
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div style={{
      width: data.w, height: data.h,
      background: `${data.color}${data.fillAlpha}`,
      border: `1.5px solid ${data.color}${data.borderAlpha}`,
      borderRadius: blobFromId(data.id),
      padding: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center",
      cursor: "pointer", userSelect: "none",
      boxSizing: "border-box",
      boxShadow: data.isNew ? `0 3px 18px ${data.color}55` : `0 1px 10px ${data.color}22`,
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "#000", lineHeight: 1.35, letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ── Graph builder ─────────────────────────────────────────────────────────────

function buildGraph(trends: Trend[], signals: Signal[], topicAddedAt: Record<string, string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const GAP = 5;
  const N_ANGLES = 16;
  type P = { sig: Signal; w: number; h: number; fillAlpha: string; borderAlpha: string; isNew: boolean; x: number; y: number };
  type Blob = { cx: number; cy: number; r: number };

  const allBlobs: Blob[] = [];
  const allSignalPlacements: P[] = [];

  trends.forEach((trend, idx) => {
    const pos = trend.position ?? { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
    const trendSignals = signals
      .filter((s) => s.trendId === trend.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
    const topicKey = trend.topics?.[0];
    const latestDate = topicKey ? topicAddedAt[topicKey] : undefined;
    const d = Math.round(75 + ((trend.relevanceScore ?? 50) / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore ?? 50, d, latestDate } as TrendNodeData,
    });

    const MAX_R = d / 2 + 280;
    const placements: P[] = [];

    trendSignals.forEach((sig) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      let h2 = 0;
      for (let k = 0; k < sig.id.length; k++) h2 = (h2 * 37 + sig.id.charCodeAt(k) * 17) >>> 0;
      const baseAngle = ((h & 0xffffff) / 0x1000000) * Math.PI * 2;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(165, Math.round(charsPerLine * 5.8) + 20));
      const innerW = w - 16;
      const estCharsPerLine = Math.max(1, Math.floor(innerW / 6.0));
      const estLines = Math.ceil(sig.title.length / estCharsPerLine);
      const sigH = Math.round(Math.min(78, Math.max(w * 0.72, estLines * 13 + 18)));
      const { fillAlpha, borderAlpha } = ageAlpha(sig.date);

      let x = cx, y = cy;

      const tryPlace = (rMin: number, rMax: number, checkBlobs: boolean): boolean => {
        for (let r = rMin; r <= rMax; r += 3) {
          for (let k = 0; k < N_ANGLES; k++) {
            const angle = baseAngle + (k * Math.PI * 2) / N_ANGLES;
            const tx = cx + r * Math.cos(angle) - w / 2;
            const ty = cy + r * Math.sin(angle) - sigH / 2;
            const ncx = tx + w / 2, ncy = ty + sigH / 2;
            if (checkBlobs) {
              let ok = true;
              for (const blob of allBlobs) {
                const nearX = Math.max(tx, Math.min(blob.cx, tx + w));
                const nearY = Math.max(ty, Math.min(blob.cy, ty + sigH));
                if (Math.hypot(nearX - blob.cx, nearY - blob.cy) < blob.r + GAP) { ok = false; break; }
              }
              if (!ok) continue;
            }
            let clearNodes = true;
            for (const p of allSignalPlacements) {
              if (Math.abs(ncx - (p.x + p.w / 2)) < (w + p.w) / 2 + GAP &&
                  Math.abs(ncy - (p.y + p.h / 2)) < (sigH + p.h) / 2 + GAP) { clearNodes = false; break; }
            }
            if (clearNodes) { x = tx; y = ty; return true; }
          }
        }
        return false;
      };

      let placed = tryPlace(d / 2 + GAP, MAX_R, true);
      if (!placed) placed = tryPlace(MAX_R + 3, MAX_R + 120, false);
      if (!placed) {
        x = cx + (MAX_R + 160) * Math.cos(baseAngle) - w / 2;
        y = cy + (MAX_R + 160) * Math.sin(baseAngle) - sigH / 2;
      }

      const entry: P = { sig, w, h: sigH, fillAlpha, borderAlpha, isNew: false, x, y };
      placements.push(entry);
      allSignalPlacements.push(entry);
    });

    placements.forEach(({ sig, w, h, fillAlpha, borderAlpha, isNew, x, y }) => {
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x, y },
        data: { id: sig.id, title: sig.title, color: trend.color, isNew, w, h, fillAlpha, borderAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 1, opacity: 0.18 },
      });
    });
  });

  return { nodes, edges };
}

// ── Controllers (must be children of ReactFlow) ───────────────────────────────

function BoardController({ fitViewRef, nodeCount }: {
  fitViewRef: React.MutableRefObject<(() => void) | null>;
  nodeCount: number;
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitViewRef.current = () => fitView({ duration: 420, padding: 0.22 });
  }, [fitView, fitViewRef]);
  const prev = useRef(0);
  useEffect(() => {
    if (nodeCount === prev.current) return;
    prev.current = nodeCount;
    if (nodeCount > 0) setTimeout(() => fitView({ duration: 600, padding: 0.22 }), 80);
  }, [nodeCount, fitView]);
  return null;
}

function FocusController({ trend, idx }: { trend: Trend | undefined; idx: number }) {
  const { fitBounds } = useReactFlow();
  const prevIdx = useRef(-1);
  useEffect(() => {
    if (!trend || idx === prevIdx.current) return;
    prevIdx.current = idx;
    const pos = trend.position ?? { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;
    const viewR = 300;
    fitBounds(
      { x: cx - viewR, y: cy - viewR, width: viewR * 2, height: viewR * 2 },
      { duration: 420 },
    );
  }, [trend, idx, fitBounds]);
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  trends: Trend[];
  signals?: Signal[];
  topicAddedAt?: Record<string, string>;
  onSelectTrend?: (trend: Trend) => void;
  onSelectSignal?: (signal: Signal) => void;
}

export function BlobRadarView({ trends, signals, topicAddedAt = {}, onSelectTrend, onSelectSignal }: Props) {
  const fitViewRef = useRef<(() => void) | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);

  // Sort highest-relevance first — same order as displayed bottom nav
  const sorted = useMemo(
    () => [...trends].sort((a, b) => (b.relevanceScore ?? 50) - (a.relevanceScore ?? 50)),
    [trends],
  );

  // Reset focus when the trend set changes
  useEffect(() => { setFocusIdx(0); }, [trends]);

  const allSignals = useMemo(() => {
    const extra = signals ?? [];
    const base = [...SIGNALS, ...EXTENDED_SIGNALS];
    const extraIds = new Set(extra.map(s => s.id));
    return [...extra, ...base.filter(s => !extraIds.has(s.id))];
  }, [signals]);

  const { nodes, edges } = useMemo(
    () => buildGraph(sorted, allSignals, topicAddedAt),
    [sorted, allSignals, topicAddedAt],
  );

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = sorted.find((t) => t.id === node.id);
      if (trend) {
        setFocusIdx(sorted.indexOf(trend));
        onSelectTrend?.(trend);
      }
    } else if (node.type === "signalOrbit") {
      const sig = allSignals.find((s) => s.id === node.id);
      if (sig) onSelectSignal?.(sig);
    }
  }, [sorted, allSignals, onSelectTrend, onSelectSignal]);

  const safeIdx = sorted.length > 0 ? Math.min(focusIdx, sorted.length - 1) : 0;
  const focusTrend = sorted[safeIdx];

  const prev = () => setFocusIdx(i => Math.max(0, i - 1));
  const next = () => setFocusIdx(i => Math.min(sorted.length - 1, i + 1));

  if (trends.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <div style={{ textAlign: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 28, color: "#e8e8e8", marginBottom: 12, fontFamily: "'EB Garamond', Georgia, serif" }}>○</div>
          <div style={{ fontSize: 14, color: "#bbb", fontFamily: "'EB Garamond', Georgia, serif" }}>
            Search a topic below to start the radar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* ReactFlow canvas */}
      <div style={{ flex: 1, position: "relative" }}>
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
          style={{ background: "#ffffff" }}
        >
          <BoardController fitViewRef={fitViewRef} nodeCount={nodes.length} />
          <FocusController trend={focusTrend} idx={safeIdx} />
        </ReactFlow>
      </div>

      {/* Bottom nav — arrows + trend name + count */}
      {sorted.length > 0 && (
        <div style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))",
          background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          gap: 12,
        }}>
          <button
            onClick={prev}
            disabled={safeIdx === 0}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: safeIdx === 0 ? "#f5f5f5" : "#000",
              border: "none", cursor: safeIdx === 0 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke={safeIdx === 0 ? "#ccc" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2 }}>
              {focusTrend?.name}
            </div>
            <div style={{ fontSize: 10, color: "#bbb", marginTop: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              {safeIdx + 1} / {sorted.length}
            </div>
          </div>

          <button
            onClick={next}
            disabled={safeIdx === sorted.length - 1}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: safeIdx === sorted.length - 1 ? "#f5f5f5" : "#000",
              border: "none", cursor: safeIdx === sorted.length - 1 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke={safeIdx === sorted.length - 1 ? "#ccc" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
