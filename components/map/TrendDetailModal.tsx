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
  return `TREND INTELLIGENCE REPORT
${date}
Cultural Relevance Index: ${trend.relevanceScore}/100

════════════════════════════════════════════════════════

${trend.name.toUpperCase()}

${trend.description}

════════════════════════════════════════════════════════

01. MACROECONOMIC & CULTURAL DRIVERS

${trend.macroContext ?? ""}

────────────────────────────────────────────────────────

02. STRATEGIC RATIONALE

${trend.whyRelevant}

────────────────────────────────────────────────────────

03. TRAJECTORY & OUTLOOK

${trend.trajectory}

────────────────────────────────────────────────────────

04. RECOMMENDED ACTIONS

${trend.nextSteps.map((s, i) => `${String(i + 1).padStart(2, "0")}. ${s}`).join("\n\n")}

────────────────────────────────────────────────────────

05. SIGNAL INTELLIGENCE (${signals.length} signals)

${signals.map((s, i) => `[${String(i + 1).padStart(2, "0")}] ${s.title}
    Source: ${s.sourceName ?? "—"}  |  Date: ${s.date ?? "—"}${s.isLive ? "  |  LIVE" : ""}

    ${s.summary}
`).join("\n")}

════════════════════════════════════════════════════════

Trend Radar — Emerging Signal Intelligence
This report is generated from live and curated signal data.
`.trim();
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
                    {s.isLive && (
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.06em" }}>
                        LIVE
                      </span>
                    )}
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
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
              {/* Report meta */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #1a1a1a" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>
                  Trend Intelligence Report
                </div>
                <div style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.06em" }}>
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {" · "}Cultural Relevance Index: <strong style={{ color: "#555" }}>{trend.relevanceScore}/100</strong>
                </div>
              </div>

              {/* 01. Macro drivers */}
              {trend.macroContext && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace", letterSpacing: "0.04em" }}>01</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Macroeconomic &amp; Cultural Drivers</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: 0 }}>{trend.macroContext}</p>
                </div>
              )}

              {/* 02. Strategic rationale */}
              <div style={{ background: `${trend.color}09`, border: `1px solid ${trend.color}20`, borderRadius: 12, padding: "14px 16px", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace", letterSpacing: "0.04em" }}>02</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: trend.color, textTransform: "uppercase", letterSpacing: "0.12em" }}>Strategic Rationale</span>
                </div>
                <p style={{ fontSize: 13, color: "#333", lineHeight: 1.72, margin: 0 }}>{trend.whyRelevant}</p>
              </div>

              {/* 03. Trajectory */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace", letterSpacing: "0.04em" }}>03</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Trajectory &amp; Outlook</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.72, margin: 0, fontStyle: "italic" }}>{trend.trajectory}</p>
              </div>

              {/* 04. Recommended actions */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace", letterSpacing: "0.04em" }}>04</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Recommended Actions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {trend.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                        background: trend.color + "18", color: trend.color,
                        border: `1px solid ${trend.color}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 900, fontFamily: "monospace", marginTop: 2,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 05. Signal intelligence */}
              <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace", letterSpacing: "0.04em" }}>05</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Signal Intelligence ({signals.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {signals.map((s, i) => (
                    <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 8, fontWeight: 900, color: "#ccc", fontFamily: "monospace", marginTop: 3, flexShrink: 0, width: 16 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#222", lineHeight: 1.4, marginBottom: 2 }}>
                          {s.title}
                          {s.isLive && (
                            <span style={{ marginLeft: 6, fontSize: 8, fontWeight: 800, color: "#00c47a", background: "#00c47a12", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle" }}>LIVE</span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: "#bbb" }}>
                          {s.sourceName ?? "—"}{s.date ? ` · ${new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
