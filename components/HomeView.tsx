"use client";

import { useState, useMemo } from "react";
import { EXTENDED_TRENDS, FEATURED_TOPICS, TOPIC_COLORS } from "@/lib/extended-trends";

interface Props {
  onExploreMap: () => void;
  onOpenRadar: (topic?: string) => void;
}

export function HomeView({ onExploreMap, onOpenRadar }: Props) {
  const [topicInput, setTopicInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const topTrends = useMemo(() =>
    [...EXTENDED_TRENDS]
      .sort((a, b) => (b.relevanceScore ?? 50) - (a.relevanceScore ?? 50))
      .slice(0, 6),
  []);

  const briefLines = useMemo(() => {
    return topTrends.slice(0, 4).map(t => {
      const raw = t.description.split(/\.(\s|$)/)[0].trim();
      const first = raw.charAt(0).toLowerCase() + raw.slice(1);
      const topic = t.topics?.[0]?.replace(/-/g, " ") ?? "";
      return topic ? `In ${topic}, ${first}` : first;
    });
  }, [topTrends]);

  const suggestions = useMemo(() => {
    const q = topicInput.toLowerCase().trim();
    if (!q) return [];
    return FEATURED_TOPICS.filter(t =>
      t.includes(q) || t.replace(/-/g, " ").includes(q)
    ).slice(0, 6);
  }, [topicInput]);

  function submitRadar(raw: string) {
    const key = raw.trim();
    if (!key) return;
    onOpenRadar(key);
    setTopicInput("");
  }

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#fff", overflowY: "auto",
      display: "flex", flexDirection: "column",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Dateline */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "2px solid #111", paddingBottom: 10, marginBottom: 24,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "#888", textTransform: "uppercase" }}>
            Culture × Technology
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "#bbb", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Masthead */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase", marginBottom: 8 }}>
            Today&apos;s Briefing
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800,
            fontFamily: "'EB Garamond', Georgia, serif",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            color: "#111", margin: 0,
          }}>
            What&apos;s moving<br />in culture
          </h1>
        </div>

        {/* Brief prose */}
        <div style={{
          fontSize: "clamp(15px, 2.2vw, 18px)",
          fontFamily: "'EB Garamond', Georgia, serif",
          lineHeight: 1.7, color: "#333",
          marginBottom: 32,
        }}>
          {briefLines.map((line, i) => (
            <span key={i}>{line[0].toUpperCase() + line.slice(1)}{i < briefLines.length - 1 ? ". " : "."}</span>
          ))}
        </div>

        {/* Top trend headlines */}
        <div style={{ borderTop: "1px solid #e8e4de", paddingTop: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase", marginBottom: 16 }}>
            Signals to watch
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            {topTrends.slice(0, 4).map(t => (
              <div key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {t.topics?.[0]?.replace(/-/g, " ") ?? ""}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", color: "#111", lineHeight: 1.25, marginBottom: 4 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                  {t.description.split(/\.(\s|$)/)[0].trim()}.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ borderTop: "1px solid #e8e4de", paddingTop: 24 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase", marginBottom: 20 }}>
            Explore
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Culture Map CTA */}
            <button
              onClick={onExploreMap}
              style={{
                padding: "20px 18px", borderRadius: 14,
                background: "#111", color: "#fff", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Spatial view
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2, marginBottom: 6 }}>
                Culture Map
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.45 }}>
                Explore cultural domains and tensions mapped spatially.
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>→</div>
            </button>

            {/* Radar CTA */}
            <div style={{ padding: "20px 18px", borderRadius: 14, background: "#f5f4f1", textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 8 }}>
                Trends × signals
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", color: "#111", lineHeight: 1.2, marginBottom: 6 }}>
                Trends Radar
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.45, marginBottom: 14 }}>
                Search a culture topic to explore its signals.
              </div>

              {/* Inline search */}
              <div style={{ position: "relative" }}>
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
                    background: "#fff", border: "1px solid #e8e4de", borderRadius: 10,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)", padding: "4px 0", overflow: "hidden",
                  }}>
                    {suggestions.map(t => (
                      <button
                        key={t}
                        onPointerDown={(e) => { e.preventDefault(); submitRadar(t); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, width: "100%",
                          padding: "8px 14px", background: "none", border: "none",
                          cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#222", textAlign: "left",
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: TOPIC_COLORS[t] ?? "#ccc", flexShrink: 0, display: "inline-block" }} />
                        {t.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 24, padding: "6px 6px 6px 14px" }}>
                  <input
                    value={topicInput}
                    onChange={e => { setTopicInput(e.target.value); setShowSuggestions(true); }}
                    onKeyDown={e => {
                      if (e.key === "Enter") submitRadar(suggestions[0] ?? topicInput);
                      if (e.key === "Escape") { setTopicInput(""); setShowSuggestions(false); }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="e.g. fashion, gaming…"
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 13, fontWeight: 500, color: "#333", minWidth: 0,
                    }}
                  />
                  <button
                    onClick={() => topicInput.trim() ? submitRadar(topicInput) : onOpenRadar()}
                    style={{
                      width: 30, height: 30, borderRadius: "50%", background: "#111",
                      border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Or try pills */}
              {!topicInput && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                  {FEATURED_TOPICS.slice(0, 4).map(t => (
                    <button
                      key={t}
                      onClick={() => submitRadar(t)}
                      style={{
                        padding: "4px 10px", borderRadius: 16,
                        background: "#fff", border: "1px solid #e8e4de",
                        fontSize: 11, fontWeight: 600, color: "#555",
                        cursor: "pointer",
                      }}
                    >
                      {t.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
