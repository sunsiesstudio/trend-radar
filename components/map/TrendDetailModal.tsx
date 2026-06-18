"use client";

import { useState } from "react";
import { Trend, Signal } from "@/types";
import { SIGNALS, TRENDS, getSourceIcon } from "@/lib/trends";

interface Props {
  trend: Trend;
  extraSignals?: Signal[];
  onClose: () => void;
  onSelectSignal: (s: Signal) => void;
}

function exportPDF(trend: Trend, signals: Signal[]) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const c = trend.color;

  const signalsHTML = signals.map((s, i) => {
    const crossTrends = (s.crossLinks ?? []).map((id) => {
      const t = TRENDS.find((x) => x.id === id.split("-").slice(0, -1).join("-") || SIGNALS.find(sig => sig.id === id)?.trendId === x.id);
      return t?.name ?? id;
    }).filter(Boolean);
    return `
    <div class="signal">
      <div class="signal-header">
        <span class="signal-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="signal-meta">
          <div class="signal-title">${s.title}${s.isLive ? ' <span class="live-badge">LIVE</span>' : ""}</div>
          <div class="signal-source">${getSourceIcon(s.source)} ${s.sourceName ?? ""}${s.date ? ` · ${new Date(s.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""}${s.sourceUrl ? ` · <a href="${s.sourceUrl}" style="color:${c}">source</a>` : ""}</div>
        </div>
      </div>
      <p class="signal-summary">${s.summary}</p>
      ${crossTrends.length > 0 ? `<div class="cross-links">Cross-trend connection: ${crossTrends.join(", ")}</div>` : ""}
    </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${trend.name} — Trend Intelligence Report</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;background:#fff;padding:64px 72px;max-width:860px;margin:0 auto;font-size:14px;line-height:1.7}
@media print{body{padding:40px 48px}@page{margin:1.5cm}}
.cover{border-bottom:4px solid ${c};padding-bottom:32px;margin-bottom:48px}
.report-label{font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#bbb;margin-bottom:16px}
h1{font-size:44px;font-weight:900;letter-spacing:-.04em;line-height:1.05;color:${c};margin-bottom:12px}
.desc{font-size:15px;color:#555;line-height:1.75;margin-top:14px;max-width:620px}
.score-row{display:flex;align-items:center;gap:12px;margin:12px 0}
.score-bar{flex:1;height:4px;background:#f0f0f0;border-radius:2px}
.score-fill{height:100%;width:${trend.relevanceScore}%;background:${c};border-radius:2px}
.score-label{font-size:11px;font-weight:700;color:#888;white-space:nowrap}
.section{margin:44px 0}
.sh{display:flex;align-items:baseline;gap:12px;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid #efefef}
.sn{font-family:monospace;font-size:10px;font-weight:900;color:${c};letter-spacing:.04em}
.st{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.15em;color:#bbb}
p{font-size:14px;color:#333;line-height:1.8;margin-bottom:8px}
.highlight{background:${c}0d;border-left:4px solid ${c};padding:18px 22px;border-radius:0 10px 10px 0;margin:4px 0}
.highlight p{color:#222;margin-bottom:0}
.steps{display:flex;flex-direction:column;gap:12px}
.step{display:flex;gap:14px}
.snum{width:24px;height:24px;border-radius:5px;background:${c}18;border:1.5px solid ${c}40;color:${c};font-size:9px;font-weight:900;font-family:monospace;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.stext{font-size:13.5px;color:#444;line-height:1.75}
.signal{border:1px solid #f0f0f0;border-left:3px solid ${c};border-radius:0 12px 12px 0;padding:16px 18px;margin-bottom:14px;break-inside:avoid}
.signal-header{display:flex;gap:12px;margin-bottom:10px}
.signal-num{font-family:monospace;font-size:9px;color:#ccc;font-weight:900;padding-top:2px;flex-shrink:0}
.signal-title{font-size:13.5px;font-weight:700;color:#111;line-height:1.4;margin-bottom:3px}
.signal-source{font-size:10px;color:#aaa}
.signal-summary{font-size:12.5px;color:#555;line-height:1.7}
.live-badge{display:inline-block;font-size:8px;font-weight:800;color:#00c47a;background:#00c47a12;border-radius:4px;padding:1px 5px;vertical-align:middle;margin-left:6px;letter-spacing:.06em}
.cross-links{margin-top:8px;font-size:10px;color:#bbb;font-style:italic}
.signals-intro{font-size:13px;color:#aaa;margin-bottom:20px;line-height:1.6}
.divider{border:none;border-top:1px solid #efefef;margin:32px 0}
.footer{margin-top:56px;padding-top:18px;border-top:2px solid ${c}22;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#bbb}
.footer strong{color:${c}}
</style>
</head>
<body>

<div class="cover">
  <div class="report-label">Trend Intelligence Report · ${date}</div>
  <h1>${trend.name}</h1>
  <div class="score-row">
    <div class="score-bar"><div class="score-fill"></div></div>
    <div class="score-label">Cultural Relevance ${trend.relevanceScore}/100</div>
  </div>
  <p class="desc">${trend.description}</p>
</div>

${trend.macroContext ? `
<div class="section">
  <div class="sh"><span class="sn">01</span><span class="st">Macroeconomic &amp; Cultural Drivers</span></div>
  <p>${trend.macroContext}</p>
</div>` : ""}

<div class="section">
  <div class="sh"><span class="sn">02</span><span class="st">Strategic Rationale</span></div>
  <div class="highlight"><p>${trend.whyRelevant}</p></div>
</div>

<div class="section">
  <div class="sh"><span class="sn">03</span><span class="st">Trajectory &amp; Outlook</span></div>
  <p style="font-style:italic;color:#555">${trend.trajectory}</p>
</div>

<div class="section">
  <div class="sh"><span class="sn">04</span><span class="st">Recommended Actions</span></div>
  <div class="steps">
    ${trend.nextSteps.map((s, i) => `
    <div class="step">
      <div class="snum">${String(i + 1).padStart(2, "0")}</div>
      <div class="stext">${s}</div>
    </div>`).join("")}
  </div>
</div>

<div class="section">
  <div class="sh"><span class="sn">05</span><span class="st">Signal Intelligence — ${signals.length} Signals</span></div>
  <p class="signals-intro">The following signals were identified across media, research, and cultural sources. Each represents a real-world data point confirming or advancing this trend.</p>
  ${signalsHTML}
</div>

<div class="footer">
  <span><strong>Trend Radar</strong> — Emerging Signal Intelligence</span>
  <span>${date}</span>
</div>

<script>window.onload=()=>{setTimeout(()=>window.print(),400)}</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

export function TrendDetailModal({ trend, extraSignals = [], onClose, onSelectSignal }: Props) {
  const [showReport, setShowReport] = useState(false);
  const signals = [...SIGNALS.filter((s) => s.trendId === trend.id), ...extraSignals.filter(s => s.trendId === trend.id)];

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
          maxHeight: "92vh",
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
            <h2 style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#1a1a1a", flex: 1 }}>
              {trend.name}
            </h2>
            <button onClick={onClose} style={{ fontSize: 24, color: "#bbb", background: "none", border: "none", cursor: "pointer", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>×</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 3, backgroundColor: "#f0ede8", borderRadius: 2 }}>
              <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: "#999", fontWeight: 600, whiteSpace: "nowrap" }}>
              {trend.relevanceScore}% relevance
            </span>
          </div>

          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{trend.description}</p>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={() => setShowReport(false)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", backgroundColor: !showReport ? trend.color : "#f5f3ee", color: !showReport ? "#fff" : "#888" }}
            >
              Signals ({signals.length})
            </button>
            <button
              onClick={() => setShowReport(true)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", backgroundColor: showReport ? trend.color : "#f5f3ee", color: showReport ? "#fff" : "#888" }}
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
                  onClick={() => onSelectSignal(s)}
                  style={{ textAlign: "left", background: "#faf9f6", border: "1px solid #eee", borderLeft: `3px solid ${trend.color}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", width: "100%" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sourceName}</span>
                    {s.isLive && <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.06em" }}>LIVE</span>}
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#999", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.summary}</div>
                  {(s.crossLinks ?? []).length > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>↔ {(s.crossLinks ?? []).length} cross-trend connections</div>}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
              {/* Report meta */}
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid #1a1a1a" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Trend Intelligence Report</div>
                <div style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.06em" }}>
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {" · "}Cultural Relevance Index: <strong style={{ color: "#555" }}>{trend.relevanceScore}/100</strong>
                </div>
              </div>

              {/* 01 */}
              {trend.macroContext && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace" }}>01</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Macroeconomic &amp; Cultural Drivers</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#444", lineHeight: 1.78, margin: 0 }}>{trend.macroContext}</p>
                </div>
              )}

              {/* 02 */}
              <div style={{ background: `${trend.color}09`, border: `1px solid ${trend.color}20`, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace" }}>02</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: trend.color, textTransform: "uppercase", letterSpacing: "0.12em" }}>Strategic Rationale</span>
                </div>
                <p style={{ fontSize: 13, color: "#333", lineHeight: 1.75, margin: 0 }}>{trend.whyRelevant}</p>
              </div>

              {/* 03 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace" }}>03</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Trajectory &amp; Outlook</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>{trend.trajectory}</p>
              </div>

              {/* 04 */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace" }}>04</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Recommended Actions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {trend.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, background: trend.color + "18", color: trend.color, border: `1px solid ${trend.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, fontFamily: "monospace", marginTop: 2 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 05 — full signal summaries */}
              <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 22 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: trend.color, fontFamily: "monospace" }}>05</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em" }}>Signal Intelligence ({signals.length} signals)</span>
                </div>
                <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 18, margin: "0 0 18px" }}>
                  Real-world data points confirming and advancing this trend, drawn from live and curated sources.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {signals.map((s, i) => (
                    <div key={s.id} style={{ borderLeft: `2px solid ${trend.color}55`, paddingLeft: 14 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 5 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: "#ccc", fontFamily: "monospace", marginTop: 3, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 3 }}>
                            {s.title}
                            {s.isLive && <span style={{ marginLeft: 6, fontSize: 8, fontWeight: 800, color: "#00c47a", background: "#00c47a12", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle" }}>LIVE</span>}
                          </div>
                          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 6 }}>
                            {getSourceIcon(s.source)} {s.sourceName ?? ""}{s.date ? ` · ${new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                          </div>
                          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.68 }}>{s.summary}</div>
                          {(s.crossLinks ?? []).length > 0 && (
                            <div style={{ marginTop: 5, fontSize: 10, color: "#ccc", fontStyle: "italic" }}>
                              ↔ {(s.crossLinks ?? []).length} cross-trend connection{(s.crossLinks ?? []).length > 1 ? "s" : ""}
                            </div>
                          )}
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
            onClick={() => exportPDF(trend, signals)}
            style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: "none", backgroundColor: trend.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
