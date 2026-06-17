"use client";

import { useState } from "react";
import { Trend, Signal } from "@/types";
import { SIGNALS, getSourceIcon } from "@/lib/trends";

interface Props {
  trend: Trend;
  extraSignals?: Signal[];
  onClose: () => void;
  onSelectSignal: (s: Signal) => void;
}

function buildReport(trend: Trend, signals: Signal[]): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `# ${trend.name}
*Trend Intelligence Report · ${date}*

**Cultural Relevance: ${trend.relevanceScore}/100**

---

## Overview

${trend.description}

---

## Signal Evidence (${signals.length} signals)

${signals.map((s) => `### ${s.title}
Source: ${s.sourceName ?? "—"} · ${s.date ?? ""}

${s.summary}
`).join("\n---\n\n")}

---

*Trend Radar — Emerging Signal Intelligence*`.trim();
}

export function TrendDetailModal({ trend, extraSignals = [], onClose, onSelectSignal }: Props) {
  const [showReport, setShowReport] = useState(false);
  const signals = [...SIGNALS.filter((s) => s.trendId === trend.id), ...extraSignals.filter(s => s.trendId === trend.id)];

  const download = () => {
    const blob = new Blob([buildReport(trend, signals)], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${trend.id}-report.md`;
    a.click();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 680,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -8px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Color stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}66)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#1a1a1a", flex: 1 }}>
              {trend.name}
            </h2>
            <button onClick={onClose} style={{ fontSize: 24, color: "#bbb", background: "none", border: "none", cursor: "pointer", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>×</button>
          </div>

          {/* Relevance bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 3, backgroundColor: "#f0ede8", borderRadius: 2 }}>
              <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: "#999", fontWeight: 600, whiteSpace: "nowrap" }}>
              {trend.relevanceScore}% relevance
            </span>
          </div>

          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{trend.description}</p>

          {/* Tab toggle */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={() => setShowReport(false)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                backgroundColor: !showReport ? trend.color : "#f5f3ee",
                color: !showReport ? "#fff" : "#888",
              }}
            >
              Signals ({signals.length})
            </button>
            <button
              onClick={() => setShowReport(true)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                backgroundColor: showReport ? trend.color : "#f5f3ee",
                color: showReport ? "#fff" : "#888",
              }}
            >
              Full report
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {!showReport ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {signals.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onSelectSignal(s); }}
                  style={{
                    textAlign: "left", background: "#faf9f6",
                    border: "1px solid #eee", borderLeft: `3px solid ${trend.color}`,
                    borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {s.sourceName}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>
                      {s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#999", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.summary}
                  </div>
                  {(s.crossLinks ?? []).length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>
                      ↔ {(s.crossLinks ?? []).length} cross-trend connections
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
              {buildReport(trend, signals).split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h2 key={i} className="serif" style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a", marginBottom: 8, marginTop: 0 }}>{line.slice(2)}</h2>;
                if (line.startsWith("## ")) return <h3 key={i} style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 24, marginBottom: 8, paddingTop: 16, borderTop: "1px solid #f0ede8" }}>{line.slice(3)}</h3>;
                if (line.startsWith("### ")) return <h4 key={i} style={{ fontSize: 13, fontWeight: 600, color: "#333", marginTop: 16, marginBottom: 4 }}>{line.slice(4)}</h4>;
                if (line.startsWith("---")) return <div key={i} style={{ borderTop: "1px solid #f0ede8", margin: "16px 0" }} />;
                if (!line.trim()) return <div key={i} style={{ height: 4 }} />;
                return <p key={i} style={{ margin: "2px 0" }}>{line}</p>;
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px 24px", borderTop: "1px solid #f0ede8", flexShrink: 0 }}>
          <button
            onClick={download}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
              backgroundColor: trend.color, color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em",
            }}
          >
            Export report as .md
          </button>
        </div>
      </div>
    </div>
  );
}
