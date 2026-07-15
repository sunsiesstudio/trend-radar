"use client";

import { useState, useEffect, useMemo } from "react";
import { EXTENDED_TRENDS, EXTENDED_SIGNALS } from "@/lib/extended-trends";
import { Signal } from "@/types";

interface Props {
  onExploreMap: () => void;
  onOpenRadar: (topic?: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Water-toned background blobs — river, lake, sea
const WATER_BLOBS = [
  {
    color: "#1B5E8C", left: "-18%", top: "-10%", w: 520, h: 480,
    shape: "62% 38% 70% 30% / 48% 58% 42% 52%",
    blur: 80, op: 0.07, dx: 24, dy: 18, ds: 0.06, dur: 24,
  },
  {
    color: "#5B9ED6", left: "68%", top: "-6%", w: 360, h: 340,
    shape: "38% 62% 28% 72% / 68% 32% 60% 40%",
    blur: 65, op: 0.06, dx: -18, dy: 28, ds: -0.07, dur: 19,
  },
  {
    color: "#0A4A6E", left: "58%", top: "36%", w: 440, h: 420,
    shape: "68% 32% 52% 48% / 38% 62% 48% 52%",
    blur: 90, op: 0.055, dx: -26, dy: -16, ds: 0.09, dur: 29,
  },
  {
    color: "#6AAFD4", left: "-14%", top: "60%", w: 380, h: 350,
    shape: "48% 52% 38% 62% / 58% 42% 68% 32%",
    blur: 70, op: 0.065, dx: 16, dy: -22, ds: -0.05, dur: 21,
  },
  {
    color: "#A8D4EC", left: "30%", top: "22%", w: 270, h: 250,
    shape: "58% 42% 65% 35% / 42% 58% 38% 62%",
    blur: 60, op: 0.045, dx: 12, dy: 18, ds: 0.04, dur: 17,
  },
  {
    color: "#2C7BB6", left: "20%", top: "75%", w: 310, h: 290,
    shape: "45% 55% 60% 40% / 52% 48% 55% 45%",
    blur: 75, op: 0.05, dx: -10, dy: -20, ds: 0.06, dur: 22,
  },
];

export function HomeView({ onExploreMap, onOpenRadar }: Props) {
  const topTrends = useMemo(() =>
    EXTENDED_TRENDS.slice(-4).reverse(),
  []);

  // Latest signal date per trend (static baseline)
  const latestSignalByTrend = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of EXTENDED_SIGNALS) {
      if (s.trendId && s.date) {
        if (!map[s.trendId] || s.date > map[s.trendId]) map[s.trendId] = s.date;
      }
    }
    return map;
  }, []);

  // Live signal dates fetched on mount
  const [liveSignalDates, setLiveSignalDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const topics = [...new Set(topTrends.flatMap(t => t.topics ?? []))];
    const trendData = topTrends.map(t => ({ id: t.id, name: t.name, description: t.description }));
    fetch("/api/live-signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topics, trends: trendData }),
    })
      .then(r => r.json())
      .then(({ signals }: { signals: Signal[] }) => {
        const dates: Record<string, string> = {};
        for (const s of signals) {
          if (s.trendId && s.date) {
            if (!dates[s.trendId] || s.date > dates[s.trendId]) dates[s.trendId] = s.date;
          }
        }
        setLiveSignalDates(dates);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live dates take priority over static
  const effectiveSignalDates = useMemo(() => ({
    ...latestSignalByTrend,
    ...liveSignalDates,
  }), [latestSignalByTrend, liveSignalDates]);

  const topName = topTrends[0]?.name ?? "something";

  // Generate CSS keyframes for each blob
  const blobKeyframes = WATER_BLOBS.map((b, i) => `
    @keyframes homeBlob${i} {
      from { transform: translate(0px, 0px) scale(1); }
      to   { transform: translate(${b.dx}px, ${b.dy}px) scale(${1 + b.ds}); }
    }
  `).join("");

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#fff", overflowY: "auto",
      display: "flex", flexDirection: "column",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>

      {/* Water blob background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {WATER_BLOBS.map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            left: b.left, top: b.top,
            width: b.w, height: b.h,
            background: b.color,
            borderRadius: b.shape,
            filter: `blur(${b.blur}px)`,
            opacity: b.op,
            animation: `homeBlob${i} ${b.dur}s ease-in-out infinite alternate`,
            willChange: "transform",
          }} />
        ))}
        <style>{blobKeyframes}</style>
      </div>

      <div style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: "36px 24px 60px", position: "relative", zIndex: 1 }}>

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
          what&apos;s shifting
        </h1>

        {/* Brief */}
        <p style={{
          fontSize: "clamp(15px, 2vw, 17px)",
          fontFamily: "'EB Garamond', Georgia, serif",
          lineHeight: 1.75, color: "#444", margin: "0 0 36px",
        }}>
          {topName} is one I keep coming back to lately. I track the places
          where technology is quietly reshaping how people live, spend, feel,
          look — all of it. Most of it doesn&apos;t look like a trend from the
          inside. But the signals are there if you know what to look for.
          This is where I put it all.
        </p>

        {/* Trend cards */}
        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: 24, marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
            latest additions
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 28px" }}>
            {topTrends.map(t => {
              const lastDate = effectiveSignalDates[t.id];
              return (
              <div key={t.id} onClick={() => onOpenRadar(t.topics?.[0])} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {t.topics?.[0]?.replace(/-/g, " ") ?? ""}
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", color: "#111", lineHeight: 1.3, marginBottom: 5 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.55, marginBottom: lastDate ? 6 : 0 }}>
                  {t.description.split(/\.(\s|$)/)[0].trim()}.
                </div>
                {lastDate && (
                  <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "0.04em" }}>
                    signals updated {formatDate(lastDate)}
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: 24 }}>
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
                Every trend mapped against cultural domains and human tensions. The full picture.
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>→</div>
            </button>

            {/* Radar */}
            <button
              onClick={() => onOpenRadar()}
              style={{
                padding: "20px 18px", borderRadius: 14,
                background: "#f5f4f1", color: "#111", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.2, marginBottom: 8 }}>
                Trends Radar
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                Search a topic and see every signal I&apos;ve been tracking on it.
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "#bbb" }}>→</div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
