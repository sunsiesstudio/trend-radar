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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#111",
          border: `1px solid #2a2a2a`,
          borderTop: `3px solid ${trendColor}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 480,
          boxShadow: `0 0 60px ${trendColor}25, 0 32px 64px rgba(0,0,0,0.8)`,
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Color bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${trendColor}, ${trendColor}44)` }} />

        <div style={{ padding: "24px 28px" }}>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 16 }}>{getSourceIcon(signal.source)}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: trendColor,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: `${trendColor}18`,
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              {trendName}
            </span>
            <span style={{ fontSize: 10, color: "#555", fontWeight: 500 }}>{signal.sourceName}</span>
            <button
              onClick={onClose}
              style={{ marginLeft: "auto", color: "#444", fontSize: 20, lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              ×
            </button>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            fontWeight: 400,
            color: "#f0ede8",
            lineHeight: 1.25,
            marginBottom: 14,
            letterSpacing: "-0.02em",
          }}>
            {signal.title}
          </h3>

          {/* Summary */}
          <p style={{
            fontSize: 14,
            color: "#888",
            lineHeight: 1.7,
            marginBottom: 20,
          }}>
            {signal.summary}
          </p>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #222", paddingTop: 16 }}>
            <span style={{ fontSize: 11, color: "#444" }}>
              {signal.date ? new Date(signal.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {(signal.crossLinks ?? []).length > 0 && (
                <span style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>
                  ↔ {(signal.crossLinks ?? []).length} cross-links
                </span>
              )}
              {signal.sourceUrl && (
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 11, color: trendColor, fontWeight: 600, textDecoration: "none" }}
                >
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
