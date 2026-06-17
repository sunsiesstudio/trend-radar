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

export function TrendDetailModal({ trend, extraSignals = [], onClose, onSelectSignal }: Props) {
  const [tab, setTab] = useState<"signals" | "analysis">("signals");
  const signals = [...SIGNALS.filter((s) => s.trendId === trend.id), ...extraSignals.filter((s) => s.trendId === trend.id)];

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(5px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 680,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -12px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* Color stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}44)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Trend Intelligence
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.025em", color: "#111", margin: 0 }}>
                {trend.name}
              </h2>
            </div>
            <button onClick={onClose} style={{ fontSize: 24, color: "#bbb", background: "none", border: "none", cursor: "pointer", lineHeight: 1, flexShrink: 0, marginTop: 2, padding: 0 }}>×</button>
          </div>

          {/* Score bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 3, backgroundColor: "#f0ede8", borderRadius: 2 }}>
              <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: "#999", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "monospace" }}>
              {trend.relevanceScore}% relevance
            </span>
          </div>

          <p style={{ fontSize: 13, color: "#777", lineHeight: 1.65, margin: "0 0 14px" }}>{trend.description}</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {(["signals", "analysis"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", border: "none",
                  backgroundColor: tab === t ? trend.color : "#f5f3ee",
                  color: tab === t ? "#fff" : "#888",
                }}
              >
                {t === "signals" ? `Signals (${signals.length})` : "Why it matters"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "signals" ? (
            <div style={{ padding: "14px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              {signals.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSignal(s)}
                  style={{
                    textAlign: "left", background: "#faf9f6",
                    border: "1px solid #eee", borderLeft: `3px solid ${trend.color}`,
                    borderRadius: 12, padding: "12px 14px", cursor: "pointer", width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {s.sourceName}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{fmt(s.date)}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                  <div style={{
                    fontSize: 12, color: "#999", lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {s.summary}
                  </div>
                  {(s.crossLinks ?? []).length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>
                      ↔ {(s.crossLinks ?? []).length} connected signal{(s.crossLinks ?? []).length > 1 ? "s" : ""}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: "20px 24px 32px" }}>
              {/* Why relevant */}
              <div style={{
                background: `${trend.color}0d`, border: `1px solid ${trend.color}30`,
                borderRadius: 14, padding: "16px 18px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Why this matters now
                </div>
                <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7, margin: 0 }}>{trend.whyRelevant}</p>
              </div>

              {/* Next steps */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  Strategic next steps
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {trend.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: trend.color, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, marginTop: 1,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signal summary */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f0ede8" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  Evidence ({signals.length} signals)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {signals.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setTab("signals"); onSelectSignal(s); }}
                      style={{
                        fontSize: 11, color: "#555", background: "#f5f3ee",
                        border: "none", borderRadius: 20, padding: "4px 12px",
                        cursor: "pointer", fontWeight: 500,
                      }}
                    >
                      {s.sourceName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
