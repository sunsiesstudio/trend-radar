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

function SectionHeader({ color, num, label }: { color: string; num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f0ede8" }}>
      <span style={{ fontSize: 9, fontWeight: 800, color, fontFamily: "monospace", letterSpacing: "0.06em" }}>{num}</span>
      <span style={{ fontSize: 8.5, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.14em" }} dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
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
      ${crossTrends.length > 0 ? `<div class="cross-links">↔ Cross-trend: ${crossTrends.join(", ")}</div>` : ""}
    </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${trend.name} — Trend Intelligence Report</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',system-ui,sans-serif;color:#1a1a1a;background:#fff;padding:64px 72px;max-width:900px;margin:0 auto;font-size:14px;line-height:1.75}
@media print{body{padding:40px 48px}@page{margin:1.5cm 2cm}}
.cover{padding-bottom:40px;margin-bottom:52px;border-bottom:3px solid #1a1a1a}
.report-label{font-size:8px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#aaa;margin-bottom:20px}
h1{font-family:'EB Garamond',Georgia,serif;font-size:52px;font-weight:600;letter-spacing:-.02em;line-height:1.05;color:#1a1a1a;margin-bottom:14px}
.trend-color-bar{height:5px;width:80px;background:${c};border-radius:2px;margin-bottom:20px}
.desc{font-size:16px;color:#444;line-height:1.8;max-width:680px;font-family:'EB Garamond',Georgia,serif;font-style:italic}
.score-row{display:flex;align-items:center;gap:12px;margin:18px 0 0}
.score-bar{flex:1;height:3px;background:#f0f0f0;border-radius:2px;max-width:200px}
.score-fill{height:100%;width:${trend.relevanceScore}%;background:${c};border-radius:2px}
.score-label{font-size:10px;font-weight:700;color:#888;white-space:nowrap;letter-spacing:.06em}
.section{margin:48px 0}
.sh{display:flex;align-items:baseline;gap:14px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e8e8e8}
.sn{font-family:'DM Sans',monospace;font-size:9px;font-weight:700;color:${c};letter-spacing:.1em}
.st{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#999}
p{font-size:15px;color:#2a2a2a;line-height:1.85;margin-bottom:10px}
.callout{background:${c}0d;border-left:4px solid ${c};padding:20px 24px;border-radius:0 10px 10px 0;margin:4px 0}
.callout p{color:#111;margin-bottom:0;font-size:15.5px;font-weight:500}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:4px}
.context-block{padding:18px 20px;border:1px solid #efefef;border-radius:10px;break-inside:avoid}
.context-block-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${c};margin-bottom:8px}
.context-block p{font-size:13px;color:#444;line-height:1.78;margin:0}
.steps{display:flex;flex-direction:column;gap:14px}
.step{display:flex;gap:16px;align-items:flex-start}
.snum{width:26px;height:26px;border-radius:6px;background:${c}15;border:1.5px solid ${c}35;color:${c};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.stext{font-size:14.5px;color:#333;line-height:1.78;padding-top:3px}
.signals-intro{font-size:13.5px;color:#888;margin-bottom:22px;line-height:1.7;font-style:italic}
.signal{border:1px solid #ececec;border-left:3px solid ${c};border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:16px;break-inside:avoid}
.signal-header{display:flex;gap:14px;margin-bottom:10px}
.signal-num{font-family:monospace;font-size:9px;color:#ccc;font-weight:900;padding-top:3px;flex-shrink:0}
.signal-title{font-size:14px;font-weight:600;color:#111;line-height:1.4;margin-bottom:4px}
.signal-source{font-size:10px;color:#bbb;letter-spacing:.02em}
.signal-summary{font-size:13px;color:#555;line-height:1.78}
.live-badge{display:inline-block;font-size:8px;font-weight:800;color:#00c47a;background:#00c47a12;border-radius:4px;padding:1px 5px;vertical-align:middle;margin-left:6px;letter-spacing:.06em}
.cross-links{margin-top:9px;font-size:10px;color:#bbb;font-style:italic}
.footer{margin-top:60px;padding-top:20px;border-top:2px solid ${c}22;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#bbb;letter-spacing:.03em}
.footer strong{color:${c};font-weight:700}
</style>
</head>
<body>

<div class="cover">
  <div class="report-label">Trend Intelligence Report &nbsp;·&nbsp; ${date}</div>
  <h1>${trend.name}</h1>
  <div class="trend-color-bar"></div>
  <p class="desc">${trend.description}</p>
  <div class="score-row">
    <div class="score-bar"><div class="score-fill"></div></div>
    <div class="score-label">Cultural Relevance Index &nbsp;${trend.relevanceScore} / 100</div>
  </div>
</div>

${trend.macroContext ? `
<div class="section">
  <div class="sh"><span class="sn">01</span><span class="st">Macroeconomic Context</span></div>
  <p>${trend.macroContext}</p>
</div>` : ""}

<div class="section">
  <div class="sh"><span class="sn">02</span><span class="st">Social, Political, Geographical &amp; Cultural Landscape</span></div>
  <div class="two-col">
    ${trend.socialContext ? `<div class="context-block"><div class="context-block-label">Social</div><p>${trend.socialContext}</p></div>` : ""}
    ${trend.politicalContext ? `<div class="context-block"><div class="context-block-label">Political</div><p>${trend.politicalContext}</p></div>` : ""}
    ${trend.geographicalContext ? `<div class="context-block"><div class="context-block-label">Geographical</div><p>${trend.geographicalContext}</p></div>` : ""}
    ${trend.culturalContext ? `<div class="context-block"><div class="context-block-label">Cultural</div><p>${trend.culturalContext}</p></div>` : ""}
  </div>
</div>

<div class="section">
  <div class="sh"><span class="sn">03</span><span class="st">Strategic Rationale</span></div>
  <div class="callout"><p>${trend.whyRelevant}</p></div>
</div>

<div class="section">
  <div class="sh"><span class="sn">04</span><span class="st">Trajectory &amp; Outlook</span></div>
  <p style="font-style:italic;color:#555">${trend.trajectory}</p>
</div>

<div class="section">
  <div class="sh"><span class="sn">05</span><span class="st">Recommended Actions</span></div>
  <div class="steps">
    ${trend.nextSteps.map((s, i) => `
    <div class="step">
      <div class="snum">${String(i + 1).padStart(2, "0")}</div>
      <div class="stext">${s}</div>
    </div>`).join("")}
  </div>
</div>

<div class="section">
  <div class="sh"><span class="sn">06</span><span class="st">Signal Intelligence — ${signals.length} Active Signals</span></div>
  <p class="signals-intro">The following signals were identified across media, research, and cultural sources. Each represents a real-world data point confirming or advancing this trend's trajectory.</p>
  ${signalsHTML}
</div>

<div class="footer">
  <span><strong>Augmented Radar</strong> &nbsp;—&nbsp; Where tech meets fashion, beauty &amp; lifestyle</span>
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
          /* svh = small viewport height, excludes iOS browser chrome */
          maxHeight: "92svh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -8px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Color stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}66)`, flexShrink: 0 }} />

        {/* Header — kept intentionally compact so body has room */}
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em", color: "#1a1a1a", flex: 1, margin: 0 }}>
              {trend.name}
            </h2>
            {/* 44×44 tap target */}
            <button
              onClick={onClose}
              style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            >×</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 3, backgroundColor: "#f0ede8", borderRadius: 2 }}>
              <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: "#999", fontWeight: 600, whiteSpace: "nowrap" }}>
              {trend.relevanceScore}% relevance
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowReport(false)}
              style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", backgroundColor: !showReport ? trend.color : "#f5f3ee", color: !showReport ? "#fff" : "#888", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            >
              Signals ({signals.length})
            </button>
            <button
              onClick={() => setShowReport(true)}
              style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", backgroundColor: showReport ? trend.color : "#f5f3ee", color: showReport ? "#fff" : "#888", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            >
              Full report
            </button>
          </div>
        </div>

        {/* Body — scrolls; touch-action pan-y overrides the body-level none */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: "0 20px" } as React.CSSProperties}>
          {!showReport ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 0" }}>
              {/* Description shown at top of body in signals view */}
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 4px" }}>{trend.description}</p>
              {signals.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSignal(s)}
                  style={{ textAlign: "left", background: "#faf9f6", border: "1px solid #eee", borderLeft: `3px solid ${trend.color}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", width: "100%", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: trend.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sourceName}</span>
                    {s.isLive && <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.06em" }}>LIVE</span>}
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#999", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{s.summary}</div>
                  {(s.crossLinks ?? []).length > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>↔ {(s.crossLinks ?? []).length} cross-trend connections</div>}
                </button>
              ))}
              <div style={{ height: 8 }} />
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8, padding: "14px 0" }}>
              {/* Report meta */}
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid #1a1a1a" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Trend Intelligence Report</div>
                <div style={{ fontSize: 9, color: "#bbb", letterSpacing: "0.06em" }}>
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {" · "}Cultural Relevance Index: <strong style={{ color: "#555" }}>{trend.relevanceScore}/100</strong>
                </div>
              </div>

              {/* 01 — Macro */}
              {trend.macroContext && (
                <div style={{ marginBottom: 28 }}>
                  <SectionHeader color={trend.color} num="01" label="Macroeconomic Context" />
                  <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.82, margin: 0 }}>{trend.macroContext}</p>
                </div>
              )}

              {/* 02 — SPGC context */}
              {(trend.socialContext || trend.politicalContext || trend.geographicalContext || trend.culturalContext) && (
                <div style={{ marginBottom: 28 }}>
                  <SectionHeader color={trend.color} num="02" label="Social · Political · Geographical · Cultural" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {([
                      ["Social", trend.socialContext],
                      ["Political", trend.politicalContext],
                      ["Geographical", trend.geographicalContext],
                      ["Cultural", trend.culturalContext],
                    ] as [string, string | undefined][]).filter(([, v]) => v).map(([label, body]) => (
                      <div key={label} style={{ borderLeft: `3px solid ${trend.color}44`, paddingLeft: 14 }}>
                        <div style={{ fontSize: 8, fontWeight: 800, color: trend.color, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 5 }}>{label}</div>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.8, margin: 0 }}>{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 03 — Strategic rationale */}
              <div style={{ background: `${trend.color}09`, border: `1px solid ${trend.color}20`, borderRadius: 12, padding: "16px 18px", marginBottom: 28 }}>
                <SectionHeader color={trend.color} num="03" label="Strategic Rationale" />
                <p style={{ fontSize: 13.5, color: "#222", lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{trend.whyRelevant}</p>
              </div>

              {/* 04 — Trajectory */}
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color={trend.color} num="04" label="Trajectory &amp; Outlook" />
                <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{trend.trajectory}</p>
              </div>

              {/* 05 — Actions */}
              <div style={{ marginBottom: 28 }}>
                <SectionHeader color={trend.color} num="05" label="Recommended Actions" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {trend.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, background: trend.color + "18", color: trend.color, border: `1.5px solid ${trend.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, fontFamily: "monospace", marginTop: 1 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.75, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 06 — Signals */}
              <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 22 }}>
                <SectionHeader color={trend.color} num="06" label={`Signal Intelligence · ${signals.length} active signals`} />
                <p style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, margin: "0 0 18px", fontStyle: "italic" }}>
                  Real-world data points confirming and advancing this trend&apos;s trajectory, drawn from live and curated sources.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {signals.map((s, i) => (
                    <div key={s.id} style={{ borderLeft: `2px solid ${trend.color}55`, paddingLeft: 14 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: "#ccc", fontFamily: "monospace", marginTop: 3, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 3 }}>
                            {s.title}
                            {s.isLive && <span style={{ marginLeft: 6, fontSize: 8, fontWeight: 800, color: "#00c47a", background: "#00c47a12", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle" }}>LIVE</span>}
                          </div>
                          <div style={{ fontSize: 10, color: "#bbb", marginBottom: 6 }}>
                            {getSourceIcon(s.source)} {s.sourceName ?? ""}{s.date ? ` · ${new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                          </div>
                          <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.75 }}>{s.summary}</div>
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

              <div style={{ height: 8 }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px",
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
          borderTop: "1px solid #f0ede8",
          flexShrink: 0,
          background: "#fff",
        }}>
          <button
            onClick={() => exportPDF(trend, signals)}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", backgroundColor: trend.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
