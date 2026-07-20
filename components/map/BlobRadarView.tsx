"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Trend, Signal } from "@/types";
import { SIGNALS } from "@/lib/trends";
import { EXTENDED_SIGNALS, EXTENDED_TRENDS, LIBRARY_TOPICS, FEATURED_TOPICS, TOPIC_COLORS } from "@/lib/extended-trends";

// ── Helpers ───────────────────────────────────────────────────────────────────


function mixWithBase(hex: string, ratio: number): string {
  // Mix color into the app beige (#f8f7f3) — this lightens AND desaturates, avoiding neon pastels
  const br = 0xf8, bg = 0xf7, bb = 0xf3;
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * ratio + br * (1 - ratio));
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * ratio + bg * (1 - ratio));
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * ratio + bb * (1 - ratio));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  const diffDays = Math.round((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  const v = (seed: number) => 15 + (seed % 70);
  return `${v(h & 0xff)}% ${v((h >> 8) & 0xff)}% ${v((h >> 16) & 0xff)}% ${v((h >>> 24) & 0xff)}% / ${v(g & 0xff)}% ${v((g >> 8) & 0xff)}% ${v((g >> 16) & 0xff)}% ${v((g >>> 24) & 0xff)}%`;
}

const CIRCLE_D = 164;

// ── Tap hook (works on iOS Safari + Android Chrome inside ReactFlow) ──────────

function useTapHandlers(onTap: (() => void) | undefined) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      e.stopPropagation();
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.stopPropagation();
      if (!start.current || !onTap) return;
      const moved = Math.hypot(
        e.changedTouches[0].clientX - start.current.x,
        e.changedTouches[0].clientY - start.current.y,
      );
      start.current = null;
      if (moved < 8) { e.preventDefault(); onTap(); }
    },
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onTap?.(); },
  };
}

// ── Node components ───────────────────────────────────────────────────────────

type TrendNodeData = { id: string; name: string; color: string; score: number; d: number; latestDate?: string; onTap?: () => void };
type SignalNodeData = { id: string; title: string; color: string; isNew: boolean; w: number; h: number; fillAlpha: string; borderAlpha: string; onTap?: () => void };

function TrendCircleNode({ data }: NodeProps<TrendNodeData>) {
  const blobColor = darkenColor(data.color, blobAgeFactor(data.latestDate));
  const tap = useTapHandlers(data.onTap);
  return (
    <div
      {...tap}
      style={{
        width: data.d, height: data.d,
        borderRadius: blobFromId(data.id),
        background: blobColor,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: 22,
        boxSizing: "border-box", cursor: "pointer", userSelect: "none",
        boxShadow: `0 6px 32px ${data.color}66`,
      }}>
      <div style={{ fontSize: Math.round(9 + data.d / 30), fontWeight: 700, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.02em", fontFamily: "var(--font-serif), serif" }}>
        {data.name}
      </div>
      <div style={{ marginTop: 5, fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {data.score}%
      </div>
    </div>
  );
}

function SignalOrbitNode({ data }: NodeProps<SignalNodeData>) {
  const tap = useTapHandlers(data.onTap);
  return (
    <div
      {...tap}
      style={{
        width: data.w, height: data.h,
        background: `${data.color}${data.fillAlpha}`,
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
    const color = trend.color ?? "#888";
    const d = Math.round(75 + ((trend.relevanceScore ?? 50) / 100) * 140);
    const cx = pos.x + CIRCLE_D / 2;
    const cy = pos.y + CIRCLE_D / 2;

    allBlobs.push({ cx, cy, r: d / 2 });

    nodes.push({
      id: trend.id, type: "trendCircle",
      position: { x: cx - d / 2, y: cy - d / 2 },
      data: { id: trend.id, name: trend.name, color, score: trend.relevanceScore ?? 50, d, latestDate } as TrendNodeData,
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
        data: { id: sig.id, title: sig.title, color, isNew, w, h, fillAlpha, borderAlpha } as SignalNodeData,
      });
      edges.push({
        id: `spoke-${trend.id}-${sig.id}`, source: trend.id, target: sig.id, type: "straight",
        style: { stroke: color, strokeWidth: 1, opacity: 0.18 },
      });
    });
  });

  return { nodes, edges };
}

// ── Controllers (must be children of ReactFlow) ───────────────────────────────

function BoardController({ fitViewRef }: {
  fitViewRef: React.MutableRefObject<(() => void) | null>;
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    fitViewRef.current = () => fitView({ duration: 420, padding: 0.08 });
  }, [fitView, fitViewRef]);
  return null;
}

// idx === -1 → overview (fitView all); idx >= 0 → zoom to trend cluster
// trendsKey changes whenever the trend set changes, forcing a re-fit on new topic loads
// panelOpen: when the side panel opens/closes, re-center the cluster in the now-narrower canvas
function FocusController({ trendId, signalIds, idx, trendsKey, panelOpen }: {
  trendId: string | undefined;
  signalIds: string[];
  idx: number;
  trendsKey: string;
  panelOpen: boolean;
}) {
  const { fitView } = useReactFlow();
  const prevKey       = useRef("");
  const prevTrendsKey = useRef("");
  const prevPanelOpen = useRef(panelOpen);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const panelChanged = panelOpen !== prevPanelOpen.current;
    prevPanelOpen.current = panelOpen;

    const key = idx < 0 ? `__overview__:${trendsKey}` : `${trendId ?? "?"}:${idx}`;
    const keyChanged = key !== prevKey.current;
    if (!keyChanged && !panelChanged) return;

    const isFirst       = prevKey.current === "";
    const trendsChanged = trendsKey !== prevTrendsKey.current;
    if (keyChanged) {
      prevKey.current       = key;
      prevTrendsKey.current = trendsKey;
    }

    const instant = !panelChanged && (isFirst || trendsChanged);
    // Panel open/close waits 350 ms for the flex layout to reflow before fitting
    const delay = panelChanged ? 350 : instant ? 180 : 400;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (idx < 0) {
        fitView({ duration: instant ? 0 : 600, padding: 0.42 });
      } else if (trendId) {
        const fitNodes = [{ id: trendId }, ...signalIds.map(id => ({ id }))];
        fitView({ nodes: fitNodes, duration: instant ? 0 : 420, padding: 0.22 });
      }
    }, delay);
  }, [trendId, signalIds, idx, trendsKey, panelOpen, fitView]);
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  trends: Trend[];
  signals?: Signal[];
  topicAddedAt?: Record<string, string>;
  activeTopics: string[];
  generatingTopic?: string | null;
  panelOpen?: boolean;
  onAddTopic: (topic: string) => void;
  onRemoveTopic: (topic: string) => void;
  onSelectTrend?: (trend: Trend) => void;
  onSelectSignal?: (signal: Signal) => void;
  onSetView?: (v: "map" | "radar") => void;
  initialFocusTrendId?: string;
}

export function BlobRadarView({
  trends, signals, topicAddedAt = {},
  activeTopics, generatingTopic, panelOpen = false, onAddTopic, onRemoveTopic,
  onSelectTrend, onSelectSignal, onSetView, initialFocusTrendId,
}: Props) {
  const fitViewRef = useRef<(() => void) | null>(null);
  // -1 = overview (zoomed out); >= 0 = focused on that trend
  const [focusIdx, setFocusIdx] = useState(-1);
  const [topicInput, setTopicInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shuffledTopics] = useState(() => [...LIBRARY_TOPICS].sort(() => Math.random() - 0.5));
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Sort highest-relevance first
  const sorted = useMemo(
    () => [...trends].sort((a, b) => (b.relevanceScore ?? 50) - (a.relevanceScore ?? 50)),
    [trends],
  );

  // A stable string that changes whenever the trend set changes — used by FocusController
  const trendsKey = useMemo(() => sorted.map(t => t.id).join(","), [sorted]);

  // Focus specific trend on load if requested, otherwise first trend
  useEffect(() => {
    if (trends.length === 0) { setFocusIdx(-1); return; }
    if (initialFocusTrendId) {
      const idx = sorted.findIndex(t => t.id === initialFocusTrendId);
      setFocusIdx(idx >= 0 ? idx : 0);
    } else {
      setFocusIdx(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trends]);

  const allSignals = useMemo(() => {
    const extra = signals ?? [];
    const base = [...SIGNALS, ...EXTENDED_SIGNALS];
    const extraIds = new Set(extra.map(s => s.id));
    return [...extra, ...base.filter(s => !extraIds.has(s.id))];
  }, [signals]);

  // Stable refs so node tap handlers don't need to be in useMemo deps
  const onSelectTrendRef = useRef(onSelectTrend);
  const onSelectSignalRef = useRef(onSelectSignal);
  onSelectTrendRef.current = onSelectTrend;
  onSelectSignalRef.current = onSelectSignal;

  const { nodes: baseNodes, edges } = useMemo(
    () => buildGraph(sorted, allSignals, topicAddedAt),
    [sorted, allSignals, topicAddedAt],
  );

  // Inject tap handlers into node data (refs keep this stable)
  const nodes = useMemo(() => {
    const trendMap = new Map(sorted.map((t, i) => [t.id, { trend: t, idx: i }]));
    const sigMap   = new Map(allSignals.map(s => [s.id, s]));
    return baseNodes.map(node => {
      if (node.type === "trendCircle") {
        const entry = trendMap.get(node.id);
        return { ...node, data: { ...node.data, onTap: () => {
          if (entry) { setFocusIdx(entry.idx); onSelectTrendRef.current?.(entry.trend); }
        }}};
      }
      if (node.type === "signalOrbit") {
        const sig = sigMap.get(node.id);
        return { ...node, data: { ...node.data, onTap: () => {
          if (sig) onSelectSignalRef.current?.(sig);
        }}};
      }
      return node;
    });
  }, [baseNodes, sorted, allSignals]);

  const safeIdx    = focusIdx >= 0 ? Math.min(focusIdx, sorted.length - 1) : -1;
  const focusTrend = safeIdx >= 0 ? sorted[safeIdx] : undefined;

  const focusSignalIds = useMemo(() => {
    if (!focusTrend) return [];
    return allSignals.filter(s => s.trendId === focusTrend.id).map(s => s.id);
  }, [focusTrend, allSignals]);

  // Latest signals for "Last arrivals" section on the home (empty) state
  // One representative signal per trend, deduped, sorted by most recent date
  const latestSignals = useMemo(() => {
    const trendMap = new Map(EXTENDED_TRENDS.map(t => [t.id, t]));
    const seenTrends = new Set<string>();
    return [...EXTENDED_SIGNALS]
      .filter(s => s.date && s.trendId)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
      .filter(s => {
        if (seenTrends.has(s.trendId!)) return false;
        seenTrends.add(s.trendId!);
        return true;
      })
      .slice(0, 10)
      .map(s => {
        const trend = trendMap.get(s.trendId!);
        const color = TOPIC_COLORS[trend?.topics?.[0] ?? ""] ?? "#aaa";
        return { signal: s, color, trend };
      });
  }, []);

  // Arrows navigate radar focus only — tap a blob to open detail
  const prev = () => {
    setFocusIdx(i => i < 0 ? 0 : Math.max(0, i - 1));
  };
  const next = () => {
    setFocusIdx(i => i < 0 ? 0 : Math.min(sorted.length - 1, i + 1));
  };

  // ── Search helpers ────────────────────────────────────────────────────────────

  const topicSuggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    const base = q ? LIBRARY_TOPICS : shuffledTopics;
    const available = base.filter(t => !activeTopics.includes(t));
    if (!q) return available;
    return available.filter(t => t.includes(q) || t.replace(/-/g, " ").includes(q));
  }, [topicInput, activeTopics, shuffledTopics]);

  const inspirationPills = useMemo(
    () => FEATURED_TOPICS.filter(t => !activeTopics.includes(t)).slice(0, isDesktop ? 16 : 8),
    [activeTopics, isDesktop],
  );

  function submitTopic(raw: string) {
    const key = raw.trim();
    if (!key) return;
    onAddTopic(key);
    setTopicInput("");
    setShowSuggestions(false);
  }

  // ── Empty state ───────────────────────────────────────────────────────────────

  if (trends.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#f8f7f3" }}>
        {/* Animated blob background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          {([
            { color: "#80B0E8", size: 300, x: -4,  y: 5,   dur: 26, seed: "bg-blob-sky" },
            { color: "#FFC0C0", size: 280, x: 104, y: 8,   dur: 33, seed: "bg-blob-peony" },
            { color: "#D6D35F", size: 260, x: -4,  y: 92,  dur: 21, seed: "bg-blob-lime" },
            { color: "#C45F3F", size: 300, x: 104, y: 88,  dur: 38, seed: "bg-blob-tomato" },
            { color: "#D1CAEA", size: 220, x: 50,  y: -4,  dur: 29, seed: "bg-blob-lavender" },
            { color: "#F4D242", size: 220, x: 50,  y: 104, dur: 32, seed: "bg-blob-sun" },
          ] as { color: string; size: number; x: number; y: number; dur: number; seed: string }[]).map((b, i) => (
            <div key={i} style={{
              position: "absolute",
              width: b.size, height: b.size,
              left: `${b.x}%`, top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
              background: "transparent",
              border: `1.5px solid ${b.color}`,
              opacity: 0.35,
              filter: "none",
              animation: `homeBlobDrift${i} ${b.dur}s ease-in-out infinite alternate`,
              borderRadius: blobFromId(b.seed),
            }} />
          ))}
          {/* Desktop-only extra blobs — fill the inner space on larger screens */}
          {([
            { color: "#78C9A8", size: 320, x: -4,  y: 50,  dur: 28, seed: "bg-d-teal" },
            { color: "#E8B87A", size: 320, x: 104, y: 50,  dur: 34, seed: "bg-d-amber" },
            { color: "#FD8326", size: 280, x: 25,  y: -4,  dur: 25, seed: "bg-d-orange" },
            { color: "#9DC47C", size: 280, x: 75,  y: -4,  dur: 31, seed: "bg-d-sage" },
            { color: "#FF8BB4", size: 280, x: 25,  y: 104, dur: 36, seed: "bg-d-rose" },
            { color: "#C4A0CE", size: 280, x: 75,  y: 104, dur: 27, seed: "bg-d-mauve" },
          ] as { color: string; size: number; x: number; y: number; dur: number; seed: string }[]).map((b, i) => (
            <div key={`d${i}`} className="home-desktop-blob" style={{
              position: "absolute",
              width: b.size, height: b.size,
              left: `${b.x}%`, top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
              background: "transparent",
              border: `1.5px solid ${b.color}`,
              opacity: 0.22,
              filter: "none",
              animation: `homeBlobDrift${6 + i} ${b.dur}s ease-in-out infinite alternate`,
              borderRadius: blobFromId(b.seed),
            }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          {generatingTopic ? (
            <div style={{ textAlign: "center", padding: "0 32px" }}>
              <div style={{ fontSize: 15, color: "#aaa", fontFamily: "var(--font-serif), serif" }}>
                Generating <em>{generatingTopic}</em>…
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              width: "100%", maxWidth: isDesktop ? 800 : 460,
              padding: "0 32px", boxSizing: "border-box",
            }}>
              {/* Title */}
              <div style={{ fontSize: isDesktop ? 42 : 26, fontWeight: 700, color: "#111", fontFamily: "var(--font-serif), serif", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                A research tool to identify<br />emerging tech trends in culture
              </div>

              {/* Search input */}
              <div style={{ position: "relative", marginTop: isDesktop ? 28 : 18, maxWidth: isDesktop ? 500 : "100%", margin: `${isDesktop ? 28 : 18}px auto 0` }}>
                {showSuggestions && topicSuggestions.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
                    background: "#fff", border: "1px solid #e8e4de", borderRadius: 14,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)", maxHeight: 280, overflowY: "auto", padding: "6px 0",
                    overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" as const,
                  }}>
                    {topicSuggestions.map(topic => (
                      <button
                        key={topic}
                        onPointerDown={(e) => { e.preventDefault(); submitTopic(topic); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "9px 16px",
                          background: "none", border: "none", cursor: "pointer",
                          textAlign: "left", fontSize: 12, fontWeight: 600,
                          color: "#222", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                      >
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: TOPIC_COLORS[topic] ?? "#ccc", flexShrink: 0, display: "inline-block" }} />
                        {topic.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f8f7f3", borderRadius: 28,
                  padding: isDesktop ? "12px 12px 12px 22px" : "10px 10px 10px 18px",
                  border: "1.5px solid rgba(0,0,0,0.18)",
                }}>
                  <input
                    ref={inputRef}
                    value={topicInput}
                    onChange={(e) => { setTopicInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { submitTopic(topicSuggestions[0] ?? topicInput); }
                      if (e.key === "Escape") { setTopicInput(""); setShowSuggestions(false); }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Start by searching a topic, e.g. art"
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: isDesktop ? 16 : 14, fontWeight: 400, color: "#333",
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  />
                  <button
                    onClick={() => submitTopic(topicSuggestions[0] ?? topicInput)}
                    style={{
                      background: "none", border: "none", padding: "0 4px",
                      cursor: topicInput.trim() ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke={topicInput.trim() ? "#333" : "#ccc"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Or try pills */}
              {!topicInput && inspirationPills.length > 0 && (
                <div style={{ marginTop: isDesktop ? 20 : 18, maxWidth: isDesktop ? 500 : "100%", margin: `${isDesktop ? 20 : 18}px auto 0` }}>
                  <span style={{ fontSize: 11, color: "#ccc", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    or try
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
                    {inspirationPills.map(topic => {
                      const color = TOPIC_COLORS[topic] ?? "#aaa";
                      const dark = darkenColor(color);
                      return (
                        <button
                          key={topic}
                          onClick={() => submitTopic(topic)}
                          style={{
                            padding: "5px 12px", borderRadius: 20,
                            background: mixWithBase(color, 0.18), border: `1px solid ${color}66`,
                            fontSize: 11, fontWeight: 700, color: dark,
                            cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {topic.replace(/-/g, " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Last arrivals — latest signal per trend, most recent first */}
        {latestSignals.length > 0 && (
          <div style={{ flexShrink: 0, paddingBottom: 8, position: "relative", zIndex: 1 }}>
            <div style={{ padding: "0 24px 10px" }}>
              <span style={{ fontSize: 9, color: "#c0bbb4", letterSpacing: "0.13em", textTransform: "uppercase" as const, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                Last arrivals
              </span>
            </div>
            <div className="last-arrivals-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "2px 24px 4px" }}>
              {latestSignals.map(item => (
                item.trend && (
                  <div
                    key={item.signal.id}
                    onClick={() => onSelectSignal?.(item.signal)}
                    style={{
                      flexShrink: 0, width: 172, cursor: "pointer",
                      background: "#faf9f7",
                      border: "1px solid #e8e4de",
                      borderRadius: 12, padding: "10px 13px",
                      display: "flex", flexDirection: "column", gap: 6,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#ccc8c0")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e4de")}
                  >
                    <div>
                      <span style={{
                        display: "inline-block",
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        background: mixWithBase(item.color, 0.18),
                        color: darkenColor(item.color),
                        border: `1px solid ${item.color}66`,
                        borderRadius: 20, padding: "5px 12px",
                      }}>
                        {item.trend.topics?.[0]?.replace(/-/g, " ") ?? ""}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#2e2b27", lineHeight: 1.35, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {item.signal.title}
                    </div>
                    {item.signal.date && (
                      <div style={{ fontSize: 9, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginTop: 1 }}>
                        {fmtDate(item.signal.date)}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <div style={{ flexShrink: 0, padding: "16px 24px", textAlign: "center", fontSize: 11, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
          By Martina from{" "}
          <a href="https://augmentedrarity.substack.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "#bbb", textDecoration: "underline", textUnderlineOffset: 2 }}>
            Augmented Rarity
          </a>.
        </div>

        <style>{`
          @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
          @keyframes homeBlobDrift0  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:68% 32% 78% 22%/22% 80% 20% 78% } 42% { transform:translate(calc(-50% + 38px),calc(-50% + 22px)) scale(1.06); border-radius:22% 78% 15% 85%/82% 18% 78% 22% } 100%{ transform:translate(calc(-50% + 55px),calc(-50% + 35px)) scale(1.08); border-radius:82% 18% 55% 45%/38% 72% 15% 85% } }
          @keyframes homeBlobDrift1  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:22% 78% 62% 38%/78% 18% 72% 28% } 38% { transform:translate(calc(-50% - 28px),calc(-50% + 16px)) scale(0.95); border-radius:80% 20% 18% 82%/20% 82% 25% 75% } 100%{ transform:translate(calc(-50% - 45px),calc(-50% + 25px)) scale(0.94); border-radius:18% 82% 78% 22%/84% 16% 72% 28% } }
          @keyframes homeBlobDrift2  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:78% 22% 20% 80%/30% 75% 25% 75% } 45% { transform:translate(calc(-50% + 32px),calc(-50% - 18px)) scale(1.04); border-radius:18% 82% 76% 24%/80% 20% 85% 15% } 100%{ transform:translate(calc(-50% + 40px),calc(-50% - 30px)) scale(1.05); border-radius:30% 70% 82% 18%/68% 32% 18% 82% } }
          @keyframes homeBlobDrift3  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:32% 68% 72% 28%/76% 24% 68% 32% } 40% { transform:translate(calc(-50% - 45px),calc(-50% + 28px)) scale(1.07); border-radius:82% 18% 28% 72%/22% 78% 18% 82% } 100%{ transform:translate(calc(-50% - 60px),calc(-50% + 40px)) scale(1.1);  border-radius:18% 82% 55% 45%/78% 22% 82% 18% } }
          @keyframes homeBlobDrift4  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:72% 28% 62% 38%/38% 72% 28% 72% } 35% { transform:translate(calc(-50% + 18px),calc(-50% - 30px)) scale(0.95); border-radius:28% 72% 18% 82%/78% 22% 82% 18% } 100%{ transform:translate(calc(-50% + 30px),calc(-50% - 45px)) scale(0.96); border-radius:82% 18% 72% 28%/18% 82% 38% 62% } }
          @keyframes homeBlobDrift5  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:25% 75% 55% 45%/72% 28% 78% 22% } 44% { transform:translate(calc(-50% + 20px),calc(-50% - 18px)) scale(1.05); border-radius:78% 22% 82% 18%/25% 75% 18% 82% } 100%{ transform:translate(calc(-50% + 35px),calc(-50% - 30px)) scale(1.06); border-radius:18% 82% 28% 72%/82% 18% 72% 28% } }
          @keyframes homeBlobDrift6  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:38% 62% 78% 22%/65% 35% 22% 78% } 42% { transform:translate(calc(-50% + 20px),calc(-50% + 16px)) scale(0.94); border-radius:82% 18% 25% 75%/28% 72% 78% 22% } 100%{ transform:translate(calc(-50% + 28px),calc(-50% + 22px)) scale(0.96); border-radius:22% 78% 68% 32%/78% 22% 35% 65% } }
          @keyframes homeBlobDrift7  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:75% 25% 42% 58%/28% 72% 58% 42% } 36% { transform:translate(calc(-50% - 22px),calc(-50% - 14px)) scale(1.06); border-radius:22% 78% 78% 22%/72% 28% 18% 82% } 100%{ transform:translate(calc(-50% - 32px),calc(-50% - 18px)) scale(1.07); border-radius:82% 18% 28% 72%/18% 82% 72% 28% } }
          @keyframes homeBlobDrift8  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:55% 45% 78% 22%/72% 28% 48% 52% } 48% { transform:translate(calc(-50% + 16px),calc(-50% + 26px)) scale(0.96); border-radius:18% 82% 28% 72%/28% 72% 82% 18% } 100%{ transform:translate(calc(-50% + 22px),calc(-50% + 34px)) scale(0.94); border-radius:72% 28% 18% 82%/82% 18% 28% 72% } }
          @keyframes homeBlobDrift9  { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:28% 72% 65% 35%/78% 22% 38% 62% } 40% { transform:translate(calc(-50% - 18px),calc(-50% + 20px)) scale(1.04); border-radius:72% 28% 18% 82%/22% 78% 82% 18% } 100%{ transform:translate(calc(-50% - 25px),calc(-50% + 28px)) scale(1.05); border-radius:18% 82% 78% 22%/68% 32% 22% 78% } }
          @keyframes homeBlobDrift10 { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:62% 38% 28% 72%/42% 58% 72% 28% } 45% { transform:translate(calc(-50% + 22px),calc(-50% - 16px)) scale(1.05); border-radius:25% 75% 78% 22%/78% 22% 18% 82% } 100%{ transform:translate(calc(-50% + 30px),calc(-50% - 24px)) scale(0.97); border-radius:78% 22% 45% 55%/22% 78% 82% 18% } }
          @keyframes homeBlobDrift11 { 0%  { transform:translate(-50%,-50%) scale(1);    border-radius:22% 78% 72% 28%/58% 42% 28% 72% } 38% { transform:translate(calc(-50% - 20px),calc(-50% - 14px)) scale(0.95); border-radius:78% 22% 22% 78%/18% 82% 72% 28% } 100%{ transform:translate(calc(-50% - 28px),calc(-50% - 20px)) scale(1.08); border-radius:35% 65% 82% 18%/72% 28% 18% 82% } }
          .home-desktop-blob { display: none; }
          @media (min-width: 768px) { .home-desktop-blob { display: block; } }
          .last-arrivals-scroll { scrollbar-width: none; -ms-overflow-style: none; }
          .last-arrivals-scroll::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    );
  }

  const isOverview = safeIdx < 0;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* ReactFlow canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          nodesDraggable={false}
          minZoom={0.04}
          maxZoom={2}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
          preventScrolling
          proOptions={{ hideAttribution: true }}
          style={{ background: "#f8f7f3" }}
        >
          <BoardController fitViewRef={fitViewRef} />
          <FocusController trendId={focusTrend?.id} signalIds={focusSignalIds} idx={safeIdx} trendsKey={trendsKey} panelOpen={panelOpen} />
        </ReactFlow>
      </div>

      {/* Bottom nav */}
      {sorted.length > 0 && (
        <div style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))",
          background: "rgba(248,247,243,0.96)", backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          gap: 12,
        }}>
          <button
            onClick={prev}
            disabled={isOverview || safeIdx <= 0}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent",
              border: (isOverview || safeIdx <= 0) ? "1.5px solid rgba(0,0,0,0.08)" : "1.5px solid rgba(0,0,0,0.18)",
              cursor: (isOverview || safeIdx <= 0) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke={(isOverview || safeIdx <= 0) ? "#ccc" : "#333"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ flex: 1, textAlign: "center" }}>
            {isOverview ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "var(--font-serif), serif", lineHeight: 1.2 }}>
                  {sorted.length} {sorted.length === 1 ? "trend" : "trends"}
                </div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  tap a trend to explore
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {focusTrend?.color && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: focusTrend.color, flexShrink: 0, display: "inline-block" }} />
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "var(--font-serif), serif", lineHeight: 1.2 }}>
                    {focusTrend?.name}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {safeIdx + 1} / {sorted.length}
                </div>
              </>
            )}
          </div>

          <button
            onClick={next}
            disabled={!isOverview && safeIdx === sorted.length - 1}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent",
              border: (!isOverview && safeIdx === sorted.length - 1) ? "1.5px solid rgba(0,0,0,0.08)" : "1.5px solid rgba(0,0,0,0.18)",
              cursor: (!isOverview && safeIdx === sorted.length - 1) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12"
                stroke={(!isOverview && safeIdx === sorted.length - 1) ? "#ccc" : "#333"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    </div>
  );
}
