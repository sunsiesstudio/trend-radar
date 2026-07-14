"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

import { TOPIC_LIBRARY, TOPIC_COLORS, EXTENDED_SIGNALS, normaliseTopicKey, LIBRARY_TOPICS, TOPIC_DESCRIPTIONS } from "@/lib/extended-trends";
import { Trend, Signal } from "@/types";

import { AddSignalModal } from "@/components/map/AddSignalModal";
import { AddTrendModal } from "@/components/map/AddTrendModal";
import { CultureMap } from "@/components/map/CultureMap";

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}

// Grid for dynamically added trends — 3 columns, 760 px apart.
function computeTrendPosition(idx: number): { x: number; y: number } {
  return { x: 100 + (idx % 3) * 760, y: 100 + Math.floor(idx / 3) * 760 };
}

const BOARD_PALETTE = [
  "#FF8BB4", "#FD8326", "#8C93C7", "#B6D693", "#FFD65C",
  "#53A373", "#78C9A8", "#C4A0CE", "#FFB04A", "#A7D47C",
  "#F4A4C0", "#E88B5A", "#9B8FCE", "#94C472", "#EFC54E",
  "#4A9368", "#6BB9A0", "#B490BE", "#FFA03A", "#95C468",
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
  const [topicInput, setTopicInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const topicSuggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    const all = LIBRARY_TOPICS.filter(t => !activeTopics.includes(t));
    if (!q) return all;
    return all.filter(t => t.includes(q) || t.replace(/-/g, " ").includes(q));
  }, [topicInput, activeTopics]);

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
    <div style={{ position: "fixed", inset: 0, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, height: isDesktop ? 56 : 48, padding: "0 16px",
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)", zIndex: 10,
      }}>

        {/* Logo + tagline */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <button
            onClick={() => { setActiveTopics([]); setAppliedTopics([]); setDynamicTrends([]); setAppliedDynamicTrends([]); setGeneratedSignals([]); setGenerationError(null); }}
            style={{ fontSize: isDesktop ? 14 : 13, fontWeight: 800, letterSpacing: "-0.03em", color: "#000", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, fontFamily: "inherit" }}
          >Augmented Culture</button>
          <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.10em", textTransform: "uppercase" as const, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: isDesktop ? "inline" : "none" }}>
            Culture × Technology
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto", flexShrink: 0 }}>
          {lastUpdated && isDesktop && (
            <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500, whiteSpace: "nowrap" }}>
              {(() => {
                const mins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
                if (mins < 1) return "Updated just now";
                if (mins === 1) return "Updated 1 min ago";
                return `Updated ${mins} min ago`;
              })()}
            </span>
          )}
          {/* Round + FAB */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowAddMenu(m => !m)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#000", color: "#fff", border: "none", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 300 }}
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

      {/* ── Map canvas ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <CultureMap
          dynamicTrends={appliedDynamicTrends}
          activeTopics={appliedTopics}
          extraSignals={allExtraSignals}
          topicAddedAt={topicAddedAt}
        />
      </div>

      {/* ── Bottom search bar ─────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(0,0,0,0.07)", zIndex: 10,
        padding: "10px 16px",
        paddingBottom: "max(14px, env(safe-area-inset-bottom, 14px))",
      }}>
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>

          {/* Suggestions — pops upward */}
          {showSuggestions && topicSuggestions.length > 0 && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, zIndex: 200,
              background: "#fff", border: "1px solid #e8e4de", borderRadius: 16,
              boxShadow: "0 -8px 24px rgba(0,0,0,0.1)", maxHeight: 240, overflowY: "auto", padding: "6px 0",
            }}>
              {topicSuggestions.map(topic => (
                <button
                  key={topic}
                  onPointerDown={(e) => { e.preventDefault(); addTopic(topic); setTopicInput(""); setShowSuggestions(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#222", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: TOPIC_COLORS[topic] ?? "#ccc", flexShrink: 0, display: "inline-block" }} />
                  {topic.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          )}

          {/* Input pill */}
          <div
            style={{
              display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6,
              background: "#f5f5f5", borderRadius: 28, padding: "8px 14px",
              minHeight: 46, cursor: "text",
            }}
            onClick={() => (document.getElementById("topic-search-input") as HTMLInputElement)?.focus()}
          >
            {activeTopics.map(topic => {
              const color = TOPIC_COLORS[topic] ?? "#aaa";
              const darkC = darkenColor(color);
              return (
                <div key={topic} style={{ display: "flex", alignItems: "center", gap: 3, background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 20, padding: "3px 8px 3px 10px", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: darkC, letterSpacing: "0.02em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{topic.replace(/-/g, " ")}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeTopic(topic); }} style={{ background: "none", border: "none", padding: "0 2px", cursor: "pointer", fontSize: 15, color: darkC, lineHeight: 1, display: "flex", alignItems: "center" }}>×</button>
                </div>
              );
            })}
            {generatingTopic ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#aaa", padding: "0 4px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ccc", animation: "pulse 1.2s infinite" }} />
                generating {generatingTopic}…
              </div>
            ) : (
              <input
                id="topic-search-input"
                value={topicInput}
                onChange={(e) => { setTopicInput(e.target.value); setShowSuggestions(true); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && topicInput.trim()) { addTopic(topicInput.trim()); setTopicInput(""); setShowSuggestions(false); }
                  if (e.key === "Escape") { setTopicInput(""); setShowSuggestions(false); }
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                placeholder={activeTopics.length === 0 ? "Search a topic to filter the map…" : "Add another topic…"}
                style={{ flex: 1, minWidth: 120, background: "none", border: "none", outline: "none", fontSize: 13, fontWeight: 500, color: "#333", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: "0 4px" }}
              />
            )}
          </div>
        </div>
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
