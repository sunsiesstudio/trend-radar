"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

import { TOPIC_LIBRARY, TOPIC_COLORS, normaliseTopicKey } from "@/lib/extended-trends";
import { Trend, Signal } from "@/types";

import { AddSignalModal } from "@/components/map/AddSignalModal";
import { AddTrendModal } from "@/components/map/AddTrendModal";
import { CultureMap } from "@/components/map/CultureMap";

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Grid for dynamically added trends — 3 columns, 760 px apart.
function computeTrendPosition(idx: number): { x: number; y: number } {
  return { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
}

const BOARD_PALETTE = [
  "#FF8BB4", "#FD8326", "#80B0E8", "#B6D693", "#FFD65C",
  "#008471", "#78C9A8", "#D1CAEA", "#FFB04A", "#A7D47C",
  "#C45F3F", "#FFC0C0", "#8C93C7", "#F4D242", "#D6D35F", "#898E46",
];

function assignUniqueColors(trends: Trend[]): Trend[] {
  const used = new Set<string>();
  return trends.map((t, i) => {
    let color = BOARD_PALETTE[i % BOARD_PALETTE.length];
    if (used.has(color)) {
      const fresh = BOARD_PALETTE.find(c => !used.has(c));
      if (fresh) color = fresh;
    }
    used.add(color);
    return { ...t, color };
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [showAdd,       setShowAdd]       = useState(false);
  const [showAddTrend,  setShowAddTrend]  = useState(false);
  const [showAddMenu,   setShowAddMenu]   = useState(false);
  const [extraSignals,  setExtraSignals]  = useState<Signal[]>([]);
  const [liveSignals,   setLiveSignals]   = useState<Signal[]>([]);
  const [liveLoading,   setLiveLoading]   = useState(true);
  const [lastUpdated,   setLastUpdated]   = useState<Date | null>(null);
  const [topicAddedAt, setTopicAddedAt] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem("ar_topicAddedAt") ?? "{}"); } catch { return {}; }
  });
  const [activeTopics,     setActiveTopics]     = useState<string[]>([]);
  const [dynamicTrends,    setDynamicTrends]    = useState<Trend[]>([]);
  const [generatedSignals, setGeneratedSignals] = useState<Signal[]>([]);
  const [generatingTopic,  setGeneratingTopic]  = useState<string | null>(null);
  const [generationError,  setGenerationError]  = useState<string | null>(null);
  const [appliedTopics,        setAppliedTopics]        = useState<string[]>([]);
  const [appliedDynamicTrends, setAppliedDynamicTrends] = useState<Trend[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [view, setView] = useState<"map" | "radar">("radar");

  const liveTopicsRef = useRef<string[]>([]);
  const liveTrendsRef = useRef<Array<{ id: string; name: string; description: string }>>([]);

  useEffect(() => { liveTopicsRef.current = appliedTopics; }, [appliedTopics]);
  useEffect(() => { liveTrendsRef.current = appliedDynamicTrends.map(t => ({ id: t.id, name: t.name, description: t.description })); }, [appliedDynamicTrends]);

  const topicsKey = appliedTopics.join(",");
  useEffect(() => {
    if (!topicsKey) return;
    let cancelled = false;
    const fetchLive = () => {
      const topics = liveTopicsRef.current;
      const trends = liveTrendsRef.current;
      if (topics.length === 0) return;
      fetch("/api/live-signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, trends }),
      })
        .then((r) => r.json())
        .then(({ signals }) => { if (!cancelled) { setLiveSignals(signals ?? []); setLiveLoading(false); setLastUpdated(new Date()); } })
        .catch(() => { if (!cancelled) { setLiveLoading(false); setLastUpdated(new Date()); } });
    };
    setLiveLoading(true);
    fetchLive();
    const interval = setInterval(fetchLive, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsKey]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const runGeneration = useCallback(async (key: string, newTopics: string[], baseTrends: Trend[] = [], intersectionTopics?: string[]) => {
    const displayKey = intersectionTopics && intersectionTopics.length > 1 ? intersectionTopics.join(" × ") : key;
    setGeneratingTopic(displayKey);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: key, topics: intersectionTopics ?? [key], existingTrendIds: baseTrends.map(t => t.id), positionOffset: baseTrends.length }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.trends as Array<{ trend: Trend; signals: Signal[] }>;
        const sorted = [...items].sort((a, b) => (b.trend.relevanceScore ?? 0) - (a.trend.relevanceScore ?? 0));
        const newDynamic = baseTrends.length > 0
          ? assignUniqueColors([
              ...baseTrends,
              ...sorted.map((item, i) => ({ ...item.trend, position: computeTrendPosition(baseTrends.length + i) })),
            ])
          : assignUniqueColors(sorted.map((item, i) => ({ ...item.trend, position: computeTrendPosition(i) })));
        setDynamicTrends(newDynamic);
        setAppliedDynamicTrends(newDynamic);
        setGeneratedSignals(sorted.flatMap(i => i.signals));
        setGenerationError(null);
        try {
          const stored = localStorage.getItem("ar_trendGeneratedAt");
          const ts: Record<string, number> = stored ? JSON.parse(stored) : {};
          ts[key] = Date.now();
          localStorage.setItem("ar_trendGeneratedAt", JSON.stringify(ts));
        } catch { /* ignore */ }
      } else {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        setGenerationError(errData.error ?? "Generation failed. Please try again.");
      }
    } catch {
      setGenerationError("Network error. Check connection and try again.");
    } finally {
      setAppliedTopics(newTopics);
      setGeneratingTopic(null);
    }
  }, []);

  const loadTopic = useCallback(async (key: string) => {
    setAppliedTopics([key]);
    setDynamicTrends([]);
    setAppliedDynamicTrends([]);
    setGeneratedSignals([]);
    const libraryTrends = [...(TOPIC_LIBRARY[key] ?? [])]
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
      .map((t, i) => ({ ...t, position: computeTrendPosition(i) }));
    if (libraryTrends.length) {
      const colored = assignUniqueColors(libraryTrends);
      setDynamicTrends(colored);
      setAppliedDynamicTrends(colored);
      return;
    }
    await runGeneration(key, [key], []);
  }, [runGeneration]);

  const retryGeneration = useCallback(() => {
    const failedTopic = activeTopics.find(topic =>
      !dynamicTrends.some(t => t.topics?.includes(topic))
    );
    if (failedTopic) runGeneration(failedTopic, [failedTopic]);
  }, [activeTopics, dynamicTrends, runGeneration]);

  const TREND_TTL_MS = 48 * 60 * 60 * 1000;
  useEffect(() => {
    const stored = localStorage.getItem("ar_trendGeneratedAt");
    const timestamps: Record<string, number> = stored ? JSON.parse(stored) : {};
    const now = Date.now();
    activeTopics.forEach(topic => {
      const hasLibrary = (TOPIC_LIBRARY[topic] ?? []).length > 0;
      if (hasLibrary) return;
      const last = timestamps[topic] ?? 0;
      if (now - last > TREND_TTL_MS) runGeneration(topic, [topic], []);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTopic = useCallback(async (raw: string) => {
    const key = normaliseTopicKey(raw);
    if (!key || activeTopics.includes(key)) return;
    const newTopics = [...activeTopics, key];
    setActiveTopics(newTopics);
    setAppliedTopics(newTopics);
    setGenerationError(null);

    if (!topicAddedAt[key]) {
      const today = new Date().toISOString().split("T")[0];
      const next = { ...topicAddedAt, [key]: today };
      setTopicAddedAt(next);
      try { localStorage.setItem("ar_topicAddedAt", JSON.stringify(next)); } catch { /* ignore */ }
    }

    if (activeTopics.length === 0) {
      await loadTopic(key);
      return;
    }

    setDynamicTrends([]);
    setAppliedDynamicTrends([]);
    setGeneratedSignals([]);
    await runGeneration(key, newTopics, [], newTopics);
  }, [activeTopics, dynamicTrends, loadTopic, runGeneration, topicAddedAt]);

  const removeTopic = useCallback((topic: string) => {
    const remaining = activeTopics.filter(t => t !== topic);
    setActiveTopics(remaining);
    setAppliedTopics(remaining);
    if (remaining.length === 0) {
      setDynamicTrends([]);
      setAppliedDynamicTrends([]);
      setGeneratedSignals([]);
      return;
    }
    if (remaining.length === 1) {
      loadTopic(remaining[0]);
      return;
    }
    setDynamicTrends([]);
    setAppliedDynamicTrends([]);
    setGeneratedSignals([]);
    runGeneration(remaining[0], remaining, [], remaining);
  }, [activeTopics, loadTopic, runGeneration]);

  const allExtraSignals = useMemo(
    () => [...generatedSignals, ...extraSignals, ...liveSignals],
    [generatedSignals, extraSignals, liveSignals],
  );

  const handleAddSignal = useCallback((s: Signal) => {
    setExtraSignals((prev) => [...prev, s]);
    setShowAdd(false);
  }, []);

  const handleAddTrend = useCallback((t: Trend) => {
    const positioned = { ...t, position: computeTrendPosition(appliedDynamicTrends.length) };
    const newTrends = assignUniqueColors([...appliedDynamicTrends, positioned]);
    setDynamicTrends(newTrends);
    setAppliedDynamicTrends(newTrends);
    setShowAddTrend(false);
  }, [appliedDynamicTrends]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#F5F2EC", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, height: isDesktop ? 60 : 52, padding: "0 20px",
        display: "flex", alignItems: "center", gap: 14,
        background: "rgba(245,242,236,0.96)", backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)", zIndex: 10,
      }}>

        {/* Logo */}
        <div onClick={() => setView("radar")} style={{ cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", gap: 1, flexShrink: 0 }}>
          <span style={{ fontSize: isDesktop ? 18 : 16, fontWeight: 400, letterSpacing: "-0.02em", color: "#111", fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic", lineHeight: 1 }}>
            Augmented Culture
          </span>
          {isDesktop && (
            <span style={{ fontSize: 8, color: "#bbb", letterSpacing: "0.18em", textTransform: "uppercase" as const, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", lineHeight: 1 }}>
              Culture × Technology
            </span>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          {lastUpdated && isDesktop && (
            <span style={{ fontSize: 10, color: "#bbb", fontWeight: 500, whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
              {(() => {
                const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
                if (mins < 1) return "just now";
                if (mins === 1) return "1 min ago";
                return `${mins} min ago`;
              })()}
            </span>
          )}
          {/* + button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowAddMenu(m => !m)}
              style={{ width: 34, height: 34, borderRadius: "50%", background: "transparent", border: "1.5px solid rgba(0,0,0,0.18)", color: "#333", fontSize: 21, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 300, transition: "all 0.15s" }}
            >+</button>
            {showAddMenu && (
              <>
                <div onClick={() => setShowAddMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", border: "1px solid #e8e4de", borderRadius: 14,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 50,
                  minWidth: 140,
                }}>
                  <button
                    onClick={() => { setShowAdd(true); setShowAddMenu(false); }}
                    style={{ display: "block", width: "100%", padding: "12px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#111", textAlign: "left", whiteSpace: "nowrap", fontFamily: "inherit" }}
                  >Add signal</button>
                  <div style={{ height: 1, background: "#f0f0f0", margin: "0 10px" }} />
                  <button
                    onClick={() => { setShowAddTrend(true); setShowAddMenu(false); }}
                    style={{ display: "block", width: "100%", padding: "12px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#111", textAlign: "left", whiteSpace: "nowrap", fontFamily: "inherit" }}
                  >Add trend</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter chip sub-bar (when a topic is active) ─────────────────────── */}
      {appliedTopics.length > 0 && (
        <div style={{
          flexShrink: 0, padding: "6px 16px",
          background: "#F5F2EC", borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", gap: 8, zIndex: 9,
        }}>
          <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.10em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", flexShrink: 0 }}>
            tech
          </span>
          <span style={{ fontSize: 11, color: "#ddd", fontWeight: 400 }}>&amp;
          {appliedTopics.map(topic => {
            const color = TOPIC_COLORS[topic] ?? "#aaa";
            const dark = darkenColor(color);
            return (
              <div key={topic} style={{
                display: "flex", alignItems: "center", gap: 3,
                background: `${color}18`, border: `1px solid ${color}44`,
                borderRadius: 20, padding: "3px 8px 3px 10px",
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: dark, letterSpacing: "0.02em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  {topic.replace(/-/g, " ")}
                </span>
                <button
                  onClick={() => removeTopic(topic)}
                  style={{ background: "none", border: "none", padding: "0 2px", cursor: "pointer", fontSize: 14, color: dark, lineHeight: 1, display: "flex", alignItems: "center" }}
                >×</button>
              </div>
            );
          })}
          {generatingTopic && (
            <span style={{ fontSize: 11, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              generating…
            </span>
          )}

          {/* View toggle — right side of filter bar */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 1, background: "rgba(0,0,0,0.06)", borderRadius: 20, padding: 2 }}>
            {(["Radar", "Map"] as const).map(v => {
              const active = view === v.toLowerCase();
              return (
                <button key={v} onClick={() => setView(v.toLowerCase() as "radar" | "map")} style={{
                  padding: "4px 13px", borderRadius: 16, border: "none", cursor: "pointer",
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  letterSpacing: "0.04em",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#111" : "#999",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.18s",
                }}>{v}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main canvas ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <CultureMap
          dynamicTrends={appliedDynamicTrends}
          activeTopics={appliedTopics}
          extraSignals={allExtraSignals}
          topicAddedAt={topicAddedAt}
          generatingTopic={generatingTopic}
          onAddTopic={addTopic}
          onRemoveTopic={removeTopic}
          view={view}
          onSetView={setView}
        />
      </div>

      {showAdd && <AddSignalModal onAdd={handleAddSignal} onClose={() => setShowAdd(false)} trends={appliedDynamicTrends} />}
      {showAddTrend && <AddTrendModal onAdd={handleAddTrend} onClose={() => setShowAddTrend(false)} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
      `}</style>
    </div>
  );
}
