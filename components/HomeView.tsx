"use client";

import { useMemo } from "react";
import { EXTENDED_TRENDS } from "@/lib/extended-trends";

interface Props {
  onExploreMap: () => void;
  onOpenRadar: (topic?: string) => void;
}

export function HomeView({ onExploreMap, onOpenRadar }: Props) {
  const topTrends = useMemo(() =>
    EXTENDED_TRENDS.slice(-4).reverse(),
  []);

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
                Pick something you&apos;re curious about and see what&apos;s coming through.
              </div>
              <div style={{ marginTop: 14, fontSize: 14, color: "#bbb" }}>→</div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
