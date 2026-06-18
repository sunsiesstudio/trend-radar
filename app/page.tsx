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

import { TRENDS, SIGNALS, RADAR_OVERVIEW } from "@/lib/trends";
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

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 155;
}

// Cluster centres spaced ≥800 px apart so each cluster's signal zone
// (MAX_R = d/2+320) fits without crossing into a neighbour's territory.
// pos = top-left of CIRCLE_D×CIRCLE_D anchor; centre = pos + CIRCLE_D/2.
const TREND_POSITIONS: Record<string, { x: number; y: number }> = {
  "ai-creativity":          { x: 418,  y: 318  },
  "longevity":              { x: 1318, y: 318  },
  "ar-commerce":            { x: 2218, y: 318  },
  "biotech-beauty":         { x: 18,   y: 1218 },
  "digital-identity":       { x: 868,  y: 1218 },
  "sustainable-materials":  { x: 1668, y: 1218 },
  "wearables":              { x: 2518, y: 1218 },
  "neurotech":              { x: 218,  y: 2118 },
  "spatial-computing":      { x: 1018, y: 2118 },
  "3d-printing":            { x: 1918, y: 2118 },
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
type SignalNodeData = { id: string; title: string; color: string; source?: string; isLive?: boolean; isNew?: boolean; w: number; h: number; fillAlpha: string };

function blobFromId(id: string): string {
  // Two independent hashes → 8 fully uncorrelated corner values
  let h1 = 0, h2 = 0;
  for (let i = 0; i < id.length; i++) {
    h1 = (h1 * 31 + id.charCodeAt(i)) >>> 0;
    h2 = (h2 * 37 + id.charCodeAt(i) * 17) >>> 0;
  }
  // Full 5-90% range for maximum blob wobble
  const v = (h: number, n: number) => 5 + (((h >>> n) & 0xff) % 86);
  return `${v(h1,0)}% ${v(h1,8)}% ${v(h1,16)}% ${v(h1,24)}% / ${v(h2,0)}% ${v(h2,8)}% ${v(h2,16)}% ${v(h2,24)}%`;
}

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  return (
    <div style={{ position: "relative" }}>
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
      <div style={{
        width: data.d, height: data.d,
        borderRadius: BLOB[data.id] ?? "50%",
        background: data.color,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 22,
        boxSizing: "border-box", cursor: "pointer", userSelect: "none",
        boxShadow: `0 6px 32px ${data.color}55`,
      }}>
        <div style={{ fontSize: Math.round(9 + data.d / 30), fontWeight: 700, color: "#000", lineHeight: 1.18, letterSpacing: "-0.02em", fontFamily: "'EB Garamond', Georgia, serif" }}>
          {data.name}
        </div>
        <div style={{ marginTop: 5, fontSize: 8, fontWeight: 600, color: "rgba(0,0,0,0.5)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
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
      height: data.h,
      background: `${data.color}${data.fillAlpha}`,
      border: `1.5px solid ${data.color}bb`,
      borderRadius: blobFromId(data.id),
      padding: "8px",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center",
      cursor: "pointer", userSelect: "none",
      boxSizing: "border-box",
      boxShadow: data.isNew ? `0 3px 18px ${data.color}55` : `0 1px 10px ${data.color}22`,
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
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "#000", lineHeight: 1.35, letterSpacing: "-0.01em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
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

  const GOLDEN_ANGLE = 2.399963;
  const GAP = 5;
  // 16 evenly-spaced angle probes per radius level (22.5° steps around full circle)
  const N_ANGLES = 16;
  type P = { sig: Signal; w: number; h: number; fillAlpha: string; isNew: boolean; x: number; y: number };
  type Blob = { cx: number; cy: number; r: number };

  // All trend blobs — signals from every cluster must avoid these globally.
  const allBlobs: Blob[] = [];

  TRENDS.forEach((trend) => {
    const pos = TREND_POSITIONS[trend.id] ?? { x: 0, y: 0 };
    const trendSignals = allSignals.filter((s) => s.trendId === trend.id);
    const newCount = trendSignals.filter((s) => !seenIds.has(s.id)).length;
    const d = Math.round(75 + (trend.relevanceScore / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color: trend.color, score: trend.relevanceScore, newCount, d } as TrendNodeData,
    });

    // Signals may not travel more than 320 px from the blob edge — keeps
    // each cluster's signals within its own territory.
    const MAX_R = d / 2 + 320;

    // Collision list: only this cluster's already-placed signals.
    // Different clusters are separated enough that cross-cluster signal
    // overlap can't happen within MAX_R.
    const placements: P[] = [];

    trendSignals.forEach((sig, i) => {
      let h = 0;
      for (let k = 0; k < sig.id.length; k++) h = (h * 31 + sig.id.charCodeAt(k)) >>> 0;
      const jitter = ((h & 0xff) / 255 - 0.5) * 0.1;
      const baseAngle = i * GOLDEN_ANGLE + jitter;
      const charsPerLine = Math.ceil(sig.title.length / 4);
      const w = Math.max(90, Math.min(165, Math.round(charsPerLine * 5.8) + 20));
      // Height from text wrapping so text never overflows the blob
      const innerW = w - 16;
      const estCharsPerLine = Math.max(1, Math.floor(innerW / 6.0));
      const estLines = Math.ceil(sig.title.length / estCharsPerLine);
      const sigH = Math.round(Math.max(w * 0.75, estLines * 13.5 + 20));
      // Watercolor fill: vary opacity 33–67% per signal
      const alphaByte = 0x55 + ((h >> 14 & 0x7f) % 0x55);
      const fillAlpha = alphaByte.toString(16).padStart(2, "0");

      // Radius-first search: expand outward, probe N_ANGLES directions at each ring.
      // This guarantees the closest valid spot and never drops a signal on top of another.
      let x = cx, y = cy, placed = false;

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
            for (const p of placements) {
              if (Math.abs(ncx - (p.x + p.w / 2)) < (w + p.w) / 2 + GAP &&
                  Math.abs(ncy - (p.y + p.h / 2)) < (sigH + p.h) / 2 + GAP) { clearNodes = false; break; }
            }
            if (clearNodes) { x = tx; y = ty; return true; }
          }
        }
        return false;
      };

      // Pass 1: within MAX_R, respect all blob clearances
      placed = tryPlace(d / 2 + GAP, MAX_R, true);
      // Pass 2: beyond MAX_R if needed (no global blob check — keeps cluster together visually)
      if (!placed) placed = tryPlace(MAX_R + 3, MAX_R * 2, false);

      placements.push({ sig, w, h: sigH, fillAlpha, isNew: !seenIds.has(sig.id), x, y });
    });

    placements.forEach(({ sig, w, h, fillAlpha, isNew, x, y }) => {
      nodes.push({
        id: sig.id, type: "signalOrbit",
        position: { x, y },
        data: { id: sig.id, title: sig.title, color: trend.color, source: sig.source, isLive: sig.isLive, isNew, w, h, fillAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: trend.color, strokeWidth: 1, opacity: 0.18 },
      });
    });
  });

  const seen = new Set<string>();
  allSignals.forEach((sig) => {
    (sig.crossLinks ?? []).forEach((targetId) => {
      const key = [sig.id, targetId].sort().join("--");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ id: `cross-${key}`, source: sig.id, target: targetId, type: "straight", style: { stroke: "#bbb", strokeWidth: 0.8, strokeDasharray: "3 5", opacity: 0.35 } });
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
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
    setLiveLoading(true);
    fetch("/api/live-signals")
      .then((r) => r.json())
      .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); setLastUpdated(new Date()); } })
      .catch(() => { if (!cancelled) { setLiveLoading(false); setLastUpdated(new Date()); } });
    return () => { cancelled = true; };
  }, [refreshTick]);

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

  const updatedLabel = (() => {
    if (!lastUpdated) return null;
    const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (mins < 1) return "Updated just now";
    if (mins === 1) return "Updated 1 min ago";
    return `Updated ${mins} min ago`;
  })();

  return (
    <div style={{ width: "100vw", height: "100dvh", position: "fixed", inset: 0, background: "#ffffff" }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        height: 52, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", color: "#000" }}>Trend Radar</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setRefreshTick((t) => t + 1)}
            title="Refresh live signals"
            style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888", lineHeight: 1 }}
          >
            <span className={liveLoading ? "spin" : ""}>↻</span>
          </button>
          <button
            onClick={exportCSV}
            style={{ padding: "6px 14px", background: "#f5f3ee", color: "#555", border: "1px solid #e8e4de", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: "6px 16px", background: "#000", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            + Signal
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0, zIndex: 9,
        padding: "10px 20px 10px",
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <p style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: "#000", lineHeight: 1.55, letterSpacing: "-0.01em", fontFamily: "'EB Garamond', Georgia, serif", margin: 0 }}>
          {RADAR_OVERVIEW}
        </p>
      </div>

      {/* Canvas */}
      <div
        style={{ position: "absolute", inset: 0, paddingTop: 112, paddingBottom: 80 }}
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
          style={{ background: "#ffffff" }}
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
          {updatedLabel && (
            <div style={{ fontSize: 9, color: "#ccc", marginTop: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              {updatedLabel}
            </div>
          )}
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
