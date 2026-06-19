"use client";

import { useState, useEffect } from "react";
import { Signal } from "@/types";
import { SIGNALS, getSourceIcon } from "@/lib/trends";

function darkenHex(hex: string, f: number): string {
  return "#" + ["1,3","3,5","5,7"].map(r => Math.round(parseInt(hex.slice(...r.split(",").map(Number)),16)*f).toString(16).padStart(2,"0")).join("");
}
function accessibleTextColor(hex: string): string {
  const lin = (c: number) => { const v=c/255; return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4; };
  const lum = (h: string) => 0.2126*lin(parseInt(h.slice(1,3),16))+0.7152*lin(parseInt(h.slice(3,5),16))+0.0722*lin(parseInt(h.slice(5,7),16));
  let f=1.0; while(1.05/(lum(darkenHex(hex,f))+0.05)<4.5&&f>0.05)f-=0.02; return darkenHex(hex,f);
}

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
  const crossLinked = (signal.crossLinks ?? []).map((id) => pool.find((s) => s.id === id)).filter(Boolean) as Signal[];
  const related = crossLinked.length > 0
    ? crossLinked
    : pool.filter((s) => s.trendId === signal.trendId && s.id !== signal.id).slice(0, 1);
  const relatedLabel = crossLinked.length > 0 ? "Connected signals" : "Related signal";
  const textCol = accessibleTextColor(trendColor);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: isDesktop ? "24px" : "24px 24px 0 0",
          width: "100%",
          maxWidth: isDesktop ? 560 : 680,
          maxHeight: isDesktop ? "85vh" : "88svh",
          display: "flex",
          flexDirection: "column",
          boxShadow: isDesktop ? "0 24px 80px rgba(0,0,0,0.2)" : "0 -12px 80px rgba(0,0,0,0.15)",
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
                fontSize: 11, fontWeight: 700, color: textCol, textTransform: "uppercase",
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
                    marginLeft: "auto", fontSize: 11, fontWeight: 700, color: textCol,
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
                {relatedLabel} ({related.length})
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

        {/* Footer */}
        <div style={{ padding: "10px 20px", paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", borderTop: "1px solid #f0ede8", flexShrink: 0, textAlign: "center" } as React.CSSProperties}>
          <p style={{ fontSize: 10, color: "#ccc", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Augmented Radar maps emerging tech against culture. By Martina from{" "}
            <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#bbb", textDecoration: "underline", textUnderlineOffset: 2 }}>
              Augmented Rarity
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
