"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  NodeProps,
  NodeMouseHandler,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { TRENDS, SIGNALS } from "@/lib/trends";
import { Trend, Signal } from "@/types";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

// ─── Layout constants ─────────────────────────────────────────────────────────
const CIRCLE_D = 164;
const ORBIT_R  = 160;
const SIG_W    = 158;
const SIG_H    = 44;

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

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

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

// ─── Seen-signal tracking (localStorage) ─────────────────────────────────────

const SEEN_KEY = "tr-seen-v1";

function loadSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function saveSeen(ids: Set<string>) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...ids])); } catch {}
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function toCSV(headers: string[], rows: string[][]): string {
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
}

function dlCSV(content: string, name: string) {
  const url = URL.createObjectURL(new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Node types ───────────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number; newCount: number; d: number };
type SignalNodeData = { id: string; title: string; color: string; source?: string; isLive?: boolean; isNew?: boolean; w: number; fillAlpha: string };

function blobFromId(id: string): string {
  // Two independent hashes → 8 fully uncorrelated corner values
  let h1 = 0, h2 = 0;
  for (let i = 0; i < id.length; i++) {
    h1 = (h1 * 31 + id.charCodeAt(i)) >>> 0;
    h2 = (h2 * 37 + id.charCodeAt(i) * 17) >>> 0;
  }
  // Wider range → fatter, more organic shapes
  const v = (h: number, n: number) => 8 + (((h >>> n) & 0xff) % 82);
  return `${v(h1,0)}% ${v(h1,8)}% ${v(h1,16)}% ${v(h1,24)}% / ${v(h2,0)}% ${v(h2,8)}% ${v(h2,16)}% ${v(h2,24)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = data.d;
    const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, baseR = size / 2 - 1;

    // Deterministic wobble seed per trend
    let hv = 0;
    for (let i = 0; i < data.id.length; i++) hv = (hv * 31 + data.id.charCodeAt(i)) >>> 0;
    const hf = hv / 0xffffffff;

    const wobblyPath = (radius: number, seed: number) => {
      const pts = 80;
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const w = 1
          + Math.sin(a * 3 + seed) * 0.055
          + Math.sin(a * 7 + seed * 1.7) * 0.028
          + Math.sin(a * 13 + seed * 0.9) * 0.012;
        const rx = cx + radius * w * Math.cos(a);
        const ry = cy + radius * w * Math.sin(a);
        if (i === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
    };

    const { r, g, b } = hexToRgb(data.color);

    // Clip everything to the outer blob shape
    wobblyPath(baseR, hf * 8);
    ctx.save();
    ctx.clip();

    // Very light tinted background (pale wash of the trend color)
    ctx.fillStyle = `rgba(${Math.min(255,r+95)},${Math.min(255,g+92)},${Math.min(255,b+88)},0.95)`;
    ctx.fillRect(0, 0, size, size);

    // Dense contour strokes — topographic / IMG_0449 style
    const NUM_CONTOURS = 20;
    for (let i = 0; i <= NUM_CONTOURS; i++) {
      const ratio = (1 - i / (NUM_CONTOURS + 2)) * 0.97;
      wobblyPath(baseR * ratio, hf * 8 + i * 0.68);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.52)`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    ctx.restore();
  }, [data.d, data.color, data.id]);

  return (
    <div style={{ position: "relative", width: data.d, height: data.d, cursor: "pointer", userSelect: "none" }}>
      {data.newCount > 0 && (
        <div style={{
          position: "absolute", top: -6, right: -6, zIndex: 2,
          minWidth: 18, height: 18, borderRadius: 9,
          background: "#FF2D78", color: "#fff",
          fontSize: 9, fontWeight: 900, padding: "0 5px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 6px rgba(255,45,120,0.4)",
          letterSpacing: "0.02em",
        }}>
          {data.newCount}
        </div>
      )}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 22, boxSizing: "border-box",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: Math.round(9 + data.d / 30), fontWeight: 800, color: "#111", lineHeight: 1.22, letterSpacing: "-0.01em" }}>
          {data.name}
        </div>
        <div style={{ marginTop: 6, fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,0.45)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "monospace" }}>
          {data.score}%
        </div>
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  return (
    <div style={{
      width: data.w,
      height: data.w,
      background: `${data.color}12`,
      border: `1.8px solid ${data.color}`,
      borderRadius: blobFromId(data.id),
      padding: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center",
      cursor: "pointer", userSelect: "none",
      boxSizing: "border-box",
      boxShadow: data.isNew ? `0 3px 20px ${data.color}60` : `0 2px 12px ${data.color}35`,
      position: "relative",
    }}>
      {data.isNew && (
        <span style={{
          position: "absolute", top: -7, left: 8,
          fontSize: 7, fontWeight: 900, color: "#fff",
          background: "#FF2D78",
          borderRadius: 3, padding: "1px 4px",
          letterSpacing: "0.07em", lineHeight: 1.5,
        }}>NEW</span>
      )}
      {data.isLive && (
        <span style={{
          position: "absolute", top: 5, right: 7,
          width: 5, height: 5, borderRadius: "50%",
          background: "#00c47a",
        }} />
      )}
      <div style={{ fontSize: 10, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
        {data.title}
      </div>
    </div>
  );
}

const NODE_TYPES = { trendCircle: TrendCircleNode, signalOrbit: SignalOrbitNode };

// ─── Build graph ──────────────────────────────────────────────────────────────

function buildGraph(extraSignals: Signal[], seenIds: Set<string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const allSignals = [...SIGNALS, ...extraSignals];

  TRENDS.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? { x: 0, y: 0 };
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    const newCount = trendSignals.filter((s) => !seenIds.has(s.id)).length;
    // Diameter scales with relevance: 48→130px, 88→200px
    const d = Math.round(75 + (trend.relevanceScore / 100) * 140);

    // Keep cluster center fixed regardless of node size
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore, newCount, d } as TrendNodeData,
    });

    // Start every signal just outside the blob — only push outward on actual overlap.
    // Produces a tight multi-ring flower instead of one large sparse ring.
    const GOLDEN_ANGLE = 2.399963;
    const GAP = 8;
    type P = { sig: Signal; w: number; fillAlpha: string; isNew: boolean; x: number; y: number };
    const placements: P[] = [];

    trendSignals.forEach((sig, i) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      const jitter = ((h & 0xff) / 255 - 0.5) * 0.1;
      const angle = i * GOLDEN_ANGLE + jitter;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(170, Math.round(charsPerLine * 5.8) + 20));
      const alphaByte = 0x2d + ((h >> 14 & 0x7f) % 0x4d);
      const fillAlpha = alphaByte.toString(16).padStart(2, "0");

      let r = d / 2 + GAP; // start tight against the blob
      let x = 0, y = 0;
      for (let step = 0; step < 300; step++, r += 4) {
        x = cx + r * Math.cos(angle) - w / 2;
        y = cy + r * Math.sin(angle) - w / 2;
        const ncx = x + w / 2, ncy = y + w / 2;
        // Check clearance from trend blob (nearest point of rect to circle center)
        const nearX = Math.max(x, Math.min(cx, x + w));
        const nearY = Math.max(y, Math.min(cy, y + w));
        const clearBlob = Math.hypot(nearX - cx, nearY - cy) >= d / 2 + GAP;
        // AABB check against all prior nodes (correct for square nodes, no false-clear at diagonals)
        let clearNodes = true;
        for (const p of placements) {
          if (Math.abs(ncx - (p.x + p.w / 2)) < (w + p.w) / 2 + GAP &&
              Math.abs(ncy - (p.y + p.w / 2)) < (w + p.w) / 2 + GAP) { clearNodes = false; break; }
        }
        if (clearBlob && clearNodes) break;
      }
      placements.push({ sig, w, fillAlpha, isNew: !seenIds.has(sig.id), x, y });
    });

    placements.forEach(({ sig, w, fillAlpha, isNew, x, y }) => {
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x, y },
        data: { id: sig.id, title: sig.title, color: trend.color, source: sig.source, isLive: sig.isLive, isNew, w, fillAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 2, opacity: 0.55 },
      });
    });
  });

  const seen = new Set<string>();
  allSignals.forEach((sig) => {
    (sig.crossLinks ?? []).forEach((targetId) => {
      const key = [sig.id, targetId].sort().join("--");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ id: `cross-${key}`, source: sig.id, target: targetId, type: "straight", style: { stroke: "#ccc", strokeWidth: 1, strokeDasharray: "4 4" } });
      }
    });
  });

  return { nodes, edges };
}

// ─── Mobile: focus one trend cluster ─────────────────────────────────────────

function FocusController({ trendId }: { trendId: string }) {
  const { fitBounds } = useReactFlow();
  const first = useRef(true);

  useEffect(() => {
    const pos = TREND_POSITIONS[trendId] ?? { x: 0, y: 0 };
    const pad = 24;
    const viewR = 460; // ringR(max≈270) + nudge(≈60) + w/2(85) ≈ 415
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;
    fitBounds(
      {
        x: cx - viewR - pad,
        y: cy - viewR - pad,
        width:  (viewR + pad) * 2,
        height: (viewR + pad) * 2,
      },
      { duration: first.current ? 0 : 420 },
    );
    first.current = false;
  }, [trendId, fitBounds]);

  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTrend,  setActiveTrend]  = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [extraSignals, setExtraSignals] = useState<Signal[]>([]);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [focusIdx,     setFocusIdx]     = useState(0);
  // Seed seen IDs with all static signals on first visit so they don't show NEW
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    const stored = loadSeen();
    if (stored.size === 0) {
      const initial = new Set(SIGNALS.map((s) => s.id));
      saveSeen(initial);
      return initial;
    }
    return stored;
  });
  const swipeStart = useRef<number | null>(null);

  const markSeen = useCallback((ids: string[]) => {
    setSeenIds((prev) => {
      const next = new Set([...prev, ...ids]);
      saveSeen(next);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/live-signals")
        .then((r) => r.json())
        .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); } })
        .catch(() => { if (!cancelled) setLiveLoading(false); });
    };
    load();
    const timer = setInterval(load, 2 * 60 * 60 * 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  const allSignals = useMemo(() => [...SIGNALS, ...extraSignals, ...liveSignals], [extraSignals, liveSignals]);
  const allExtraSignals = useMemo(() => [...extraSignals, ...liveSignals], [extraSignals, liveSignals]);
  const { nodes: graphNodes, edges: graphEdges } = useMemo(() => buildGraph(allExtraSignals, seenIds), [allExtraSignals, seenIds]);
  const [nodes, setNodes] = useNodesState(graphNodes);
  const [edges, setEdges] = useEdgesState(graphEdges);

  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphNodes, graphEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === "trendCircle") {
      const trend = TRENDS.find((t) => t.id === node.id);
      if (trend) {
        setActiveTrend(trend);
        markSeen(allSignals.filter((s) => s.trendId === trend.id).map((s) => s.id));
      }
    } else if (node.type === "signalOrbit") {
      const sig = allSignals.find((s) => s.id === node.id);
      if (sig) { setActiveSignal(sig); markSeen([sig.id]); }
    }
  }, [allSignals, markSeen]);

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  const activeTrendForSignal = activeSignal ? TRENDS.find((t) => t.id === activeSignal.trendId) ?? null : null;

  const exportCSV = useCallback(() => {
    const date = new Date().toISOString().split("T")[0];
    dlCSV(toCSV(
      ["ID", "Name", "Description", "Color", "Relevance Score", "Why Relevant", "Macro Context", "Trajectory", "Next Steps"],
      TRENDS.map((t) => [t.id, t.name, t.description, t.color, String(t.relevanceScore), t.whyRelevant, t.macroContext ?? "", t.trajectory, t.nextSteps.join(" | ")])
    ), `trend-radar-trends-${date}.csv`);
    setTimeout(() => dlCSV(toCSV(
      ["Signal ID", "Trend ID", "Trend Name", "Title", "Summary", "Source", "Source Name", "URL", "Date", "Is Live"],
      allSignals.map((s) => {
        const t = TRENDS.find((x) => x.id === s.trendId);
        return [s.id, s.trendId ?? "", t?.name ?? "", s.title, s.summary, s.source ?? "", s.sourceName ?? "", s.sourceUrl ?? "", s.date ?? "", s.isLive ? "yes" : "no"];
      })
    ), `trend-radar-signals-${date}.csv`), 400);
  }, [allSignals]);

  const prev = () => setFocusIdx((i) => Math.max(0, i - 1));
  const next = () => setFocusIdx((i) => Math.min(TRENDS.length - 1, i + 1));
  const focusTrend = TRENDS[focusIdx];

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "fixed", inset: 0, background: "#f5ece8" }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        height: 52, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#111" }}>Trend Radar</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>
            {TRENDS.length} trends · {SIGNALS.length + extraSignals.length} signals
            {liveSignals.length > 0 && (
              <span style={{ color: "#00c47a", marginLeft: 6, fontWeight: 700 }}>
                +{liveSignals.length} live
              </span>
            )}
            {liveLoading && <span style={{ marginLeft: 6, opacity: 0.4 }}>●</span>}
          </span>
          <button
            onClick={exportCSV}
            style={{ padding: "6px 14px", background: "#f5f3ee", color: "#555", border: "1px solid #e8e4de", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "6px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            + Signal
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{ position: "absolute", inset: 0, paddingTop: 52, paddingBottom: 80 }}
        onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.changedTouches[0].clientX - swipeStart.current;
          if (dx < -50) next();
          else if (dx > 50) prev();
          swipeStart.current = null;
        }}
      >
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
          style={{ background: "#f5ece8" }}
        >
          <FocusController trendId={focusTrend.id} />
        </ReactFlow>
      </div>

      {/* Nav bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "0 24px", gap: 16,
      }}>
        <button
          onClick={prev}
          disabled={focusIdx === 0}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #e8e4de",
            background: focusIdx === 0 ? "#f5f3ee" : "#fff",
            fontSize: 20, color: focusIdx === 0 ? "#ccc" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: focusIdx === 0 ? "default" : "pointer", flexShrink: 0,
          }}
        >‹</button>

        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            display: "inline-block", width: 10, height: 10,
            borderRadius: "50%", background: focusTrend.color, marginBottom: 5,
          }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {focusTrend.name}
          </div>
          <div style={{ fontSize: 10, color: "#bbb", marginTop: 3, fontFamily: "monospace" }}>
            {focusIdx + 1} / {TRENDS.length}
          </div>
        </div>

        <button
          onClick={next}
          disabled={focusIdx === TRENDS.length - 1}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "1.5px solid #e8e4de",
            background: focusIdx === TRENDS.length - 1 ? "#f5f3ee" : "#fff",
            fontSize: 20, color: focusIdx === TRENDS.length - 1 ? "#ccc" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: focusIdx === TRENDS.length - 1 ? "default" : "pointer", flexShrink: 0,
          }}
        >›</button>
      </div>

      {activeTrend && (
        <TrendDetailModal
          trend={activeTrend}
          extraSignals={allExtraSignals}
          onClose={() => setActiveTrend(null)}
          onSelectSignal={(s) => { setActiveTrend(null); setActiveSignal(s); }}
        />
      )}

      {activeSignal && activeTrendForSignal && (
        <SignalPopup
          signal={activeSignal}
          trendColor={activeTrendForSignal.color}
          trendName={activeTrendForSignal.name}
          onClose={() => setActiveSignal(null)}
        />
      )}

      {showAdd && <AddSignalModal onAdd={handleAddSignal} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
