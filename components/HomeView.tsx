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
      .slice(0, 4),
  []);

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

  const topName = topTrends[0]?.name ?? "a lot";

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#fff", overflowY: "auto",
      display: "flex", flexDirection: "column",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, color: "#bbb", letterSpacing: "0.10em",
          textTransform: "uppercase", marginBottom: 20,
        }}>
          culture × technology
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(28px, 5.5vw, 46px)", fontWeight: 800,
          fontFamily: "'EB Garamond', Georgia, serif",
          letterSpacing: "-0.03em", lineHeight: 1.12,
          color: "#111", margin: "0 0 20px",
        }}>
          so, here&apos;s what&apos;s<br />going on right now
        </h1>

        {/* Casual brief */}
        <p style={{
          fontSize: "clamp(15px, 2vw, 17px)",
          fontFamily: "'EB Garamond', Georgia, serif",
          lineHeight: 1.75, color: "#444", margin: "0 0 36px",
        }}>
          {topName} is having a proper moment — and honestly, there&apos;s
          a lot more shifting underneath it. Tech keeps bleeding into every
          corner of culture, and some of it is obvious, some of it you&apos;d
          only notice if you know where to look. This is our attempt to keep
          track of it all.
        </p>

        {/* Trend cards */}
        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: 24, marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            things worth knowing about
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 28px" }}>
            {topTrends.map(t => (
              <div key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {t.topics?.[0]?.replace(/-/g, " ") ?? ""}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", color: "#111", lineHeight: 1.3, marginBottom: 5 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.55 }}>
                  {t.description.split(/\.(\s|$)/)[0].trim()}.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: 24 }}>
          <div style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            where do you want to go?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Culture Map */}
            <button
              onClick={onExploreMap}
              style={{
                padding: "20px 18px", borderRadius: 14,
                background: "#111", color: "#fff", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2, marginBottom: 8 }}>
                Culture Map
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                See how all the trends connect to each other — domains, tensions, the whole picture.
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>→</div>
            </button>

            {/* Radar */}
            <div style={{ padding: "20px 18px", borderRadius: 14, background: "#f5f4f1", textAlign: "left" }}>
              <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", color: "#111", lineHeight: 1.2, marginBottom: 8 }}>
                Trends Radar
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 14 }}>
                Pick something you&apos;re curious about and see what&apos;s coming through.
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
                    placeholder="what are you into right now?"
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: 12, fontWeight: 500, color: "#333", minWidth: 0,
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
