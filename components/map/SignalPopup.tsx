"use client";

import { Signal } from "@/types";
import { SIGNALS, getSourceIcon } from "@/lib/trends";

interface Props {
  signal: Signal;
  trendColor: string;
  trendName: string;
  allSignals?: Signal[];
  onClose: () => void;
  onSelectSignal?: (s: Signal) => void;
}

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  news: "Press",
  youtube: "YouTube",
  arxiv: "Research",
  hackernews: "Hacker News",
  manual: "Manual",
};

export function SignalPopup({ signal, trendColor, trendName, allSignals, onClose, onSelectSignal }: Props) {
  const pool = allSignals ?? SIGNALS;
  const related = (signal.crossLinks ?? [])
    .map((id) => pool.find((s) => s.id === id))
    .filter(Boolean) as Signal[];

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 680,
          maxHeight: "88svh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -12px 80px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Color bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trendColor}, ${trendColor}44)`, flexShrink: 0 }} />

        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" } as React.CSSProperties}>
          {/* Header */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: trendColor, textTransform: "uppercase",
                letterSpacing: "0.07em", background: `${trendColor}14`, padding: "3px 10px", borderRadius: 20,
              }}>
                {trendName}
              </span>
              <button onClick={onClose} style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>×</button>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.25, marginBottom: 14, letterSpacing: "-0.02em" }}>
              {signal.title}
            </h3>

            {/* Source + date row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
              padding: "10px 14px", background: "#f8f7f5", borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ fontSize: 16 }}>{getSourceIcon(signal.source)}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>
                  {signal.sourceName ?? SOURCE_LABELS[signal.source ?? "manual"]}
                  {" · "}
                  <span style={{ fontWeight: 400, color: "#666" }}>{SOURCE_LABELS[signal.source ?? "manual"]}</span>
                </div>
                {fmt(signal.date) && (
                  <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>Published {fmt(signal.date)}</div>
                )}
              </div>
              {signal.sourceUrl && (
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginLeft: "auto", fontSize: 11, fontWeight: 700, color: trendColor,
                    textDecoration: "none", padding: "5px 12px", background: `${trendColor}14`,
                    borderRadius: 20, whiteSpace: "nowrap",
                  }}
                >
                  View source →
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: "0 24px 20px" }}>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{signal.summary}</p>
          </div>

          {/* Related signals */}
          {related.length > 0 && (
            <div style={{ padding: "0 24px 24px" }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase",
                letterSpacing: "0.1em", marginBottom: 10,
              }}>
                Connected signals ({related.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelectSignal?.(r)}
                    style={{
                      textAlign: "left", background: "#faf9f6", border: "1px solid #eee",
                      borderRadius: 10, padding: "10px 14px", cursor: "pointer", width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12 }}>{getSourceIcon(r.source)}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#222", flex: 1 }}>{r.title}</span>
                      <span style={{ fontSize: 10, color: "#bbb" }}>→</span>
                    </div>
                    {r.summary && (
                      <p style={{
                        fontSize: 11, color: "#999", margin: "5px 0 0 22px",
                        lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {r.summary}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
