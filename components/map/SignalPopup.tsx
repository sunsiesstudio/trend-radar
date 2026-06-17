"use client";

import { Signal } from "@/types";
import { getSourceIcon } from "@/lib/trends";

interface Props {
  signal: Signal;
  trendColor: string;
  trendName: string;
  onClose: () => void;
}

export function SignalPopup({ signal, trendColor, trendName, onClose }: Props) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 680,
          boxShadow: "0 -8px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trendColor}, ${trendColor}44)` }} />

        <div style={{ padding: "24px 24px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>{getSourceIcon(signal.source)}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: trendColor, textTransform: "uppercase", letterSpacing: "0.08em", background: `${trendColor}14`, padding: "3px 10px", borderRadius: 20 }}>
              {trendName}
            </span>
            <span style={{ fontSize: 11, color: "#bbb" }}>{signal.sourceName}</span>
            <button onClick={onClose} style={{ marginLeft: "auto", fontSize: 22, color: "#ccc", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>

          <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.02em" }}>
            {signal.title}
          </h3>

          <p style={{ fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 20 }}>{signal.summary}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #f0ede8" }}>
            <span style={{ fontSize: 11, color: "#ccc" }}>
              {signal.date ? new Date(signal.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
            </span>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {(signal.crossLinks ?? []).length > 0 && (
                <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>↔ {(signal.crossLinks ?? []).length} cross-links</span>
              )}
              {signal.sourceUrl && (
                <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 12, color: trendColor, fontWeight: 700, textDecoration: "none" }}>
                  View source →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
