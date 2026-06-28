"use client";

import { useState, useEffect } from "react";
import { Trend, Signal } from "@/types";
import { SIGNALS, TRENDS, getSourceIcon } from "@/lib/trends";
// TRENDS used in exportPDF cross-link lookup
import { EXTENDED_SIGNALS } from "@/lib/extended-trends";

function darkenHex(hex: string, f: number): string {
  return "#" + ["1,3","3,5","5,7"].map(r => Math.round(parseInt(hex.slice(...r.split(",").map(Number)),16)*f).toString(16).padStart(2,"0")).join("");
}
function accessibleTextColor(hex: string): string {
  const lin = (c: number) => { const v=c/255; return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4; };
  const lum = (h: string) => 0.2126*lin(parseInt(h.slice(1,3),16))+0.7152*lin(parseInt(h.slice(3,5),16))+0.0722*lin(parseInt(h.slice(5,7),16));
  let f=1.0; while(1.05/(lum(darkenHex(hex,f))+0.05)<4.5&&f>0.05)f-=0.02; return darkenHex(hex,f);
}

interface Props {
  trend: Trend;
  extraSignals?: Signal[];
  onClose: () => void;
  onSelectSignal: (s: Signal) => void;
}


function quarterLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
}

function exportPDF(trend: Trend, signals: Signal[]) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const c = trend.color;

  // Sort newest-first
  const sorted = [...signals].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  // Pull quote: pick the signal with the longest summary (most editorial weight)
  const pullSignal = sorted.reduce((best, s) => (s.summary.length > best.summary.length ? s : best), sorted[0]);

  // Source diversity
  const newsCount = signals.filter(s => s.source === "news").length;
  const redditCount = signals.filter(s => s.source === "reddit").length;
  const otherCount = signals.length - newsCount - redditCount;
  const total = signals.length || 1;

  // Group signals by quarter for timeline
  const byQuarter: Record<string, Signal[]> = {};
  sorted.forEach(s => {
    if (!s.date) return;
    const q = quarterLabel(s.date);
    (byQuarter[q] = byQuarter[q] || []).push(s);
  });
  const quarters = Object.keys(byQuarter).sort().reverse();

  const sourceDiversityBar = signals.length > 0 ? `
  <div class="diversity-row">
    <div class="diversity-bar">
      ${newsCount > 0 ? `<div class="diversity-seg" style="width:${(newsCount/total*100).toFixed(1)}%;background:${c}"></div>` : ""}
      ${redditCount > 0 ? `<div class="diversity-seg" style="width:${(redditCount/total*100).toFixed(1)}%;background:${c}88"></div>` : ""}
      ${otherCount > 0 ? `<div class="diversity-seg" style="width:${(otherCount/total*100).toFixed(1)}%;background:${c}44"></div>` : ""}
    </div>
    <div class="diversity-legend">
      ${newsCount > 0 ? `<span><span class="dot" style="background:${c}"></span>${newsCount} news</span>` : ""}
      ${redditCount > 0 ? `<span><span class="dot" style="background:${c}88"></span>${redditCount} community</span>` : ""}
      ${otherCount > 0 ? `<span><span class="dot" style="background:${c}44"></span>${otherCount} other</span>` : ""}
    </div>
  </div>` : "";

  const signalTimelineHTML = quarters.map(q => {
    const qSignals = byQuarter[q];
    return `
    <div class="quarter-block">
      <div class="quarter-label">${q}</div>
      <div class="quarter-signals">
        ${qSignals.map((s, i) => {
          const crossTrends = (s.crossLinks ?? []).map((id) => {
            const t = TRENDS.find((x) => x.id === id.split("-").slice(0, -1).join("-") || SIGNALS.find(sig => sig.id === id)?.trendId === x.id);
            return t?.name ?? id;
          }).filter(Boolean);
          const sigNum = sorted.indexOf(s) + 1;
          const signalUrl = s.sourceUrl || "";
          return `
          <div class="signal">
            <div class="signal-header">
              <span class="signal-num">${String(sigNum).padStart(2, "0")}</span>
              <div class="signal-meta">
                <div class="signal-title">${s.title}${s.isLive ? ' <span class="live-badge">LIVE</span>' : ""}</div>
                <div class="signal-source">${getSourceIcon(s.source)} ${s.sourceName ?? ""}${s.date ? ` · ${new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}${signalUrl ? ` · <a href="${signalUrl}" style="color:${c}">source ↗</a>` : ""}</div>
              </div>
            </div>
            <p class="signal-summary">${s.summary}</p>
            ${crossTrends.length > 0 ? `<div class="cross-links">↔ Cross-trend: ${crossTrends.join(", ")}</div>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }).join("");

  const brandMovesHTML = (trend.brandMoves ?? []).length > 0 ? `
<div class="section">
  <div class="sh"><span class="sn">06</span><span class="st">Brand Moves &amp; Market Activity</span></div>
  <p style="font-size:13px;color:#888;margin-bottom:18px;font-style:italic">Real-world examples of brands, products, and campaigns already acting on this trend.</p>
  <div class="brand-moves">
    ${(trend.brandMoves ?? []).map(m => `
    <div class="brand-move">
      <span class="brand-dot" style="background:${c}"></span>
      <span class="brand-label">${m.url ? `<a href="${m.url}" style="color:inherit;text-decoration:underline;text-underline-offset:2px">${m.label}</a>` : m.label}</span>
    </div>`).join("")}
  </div>
</div>` : "";

  let sectionNum = 1;
  const sn = () => String(sectionNum++).padStart(2, "0");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${trend.name}: Trend Intelligence Report</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',system-ui,sans-serif;color:#1a1a1a;background:#fff;padding:64px 72px;max-width:900px;margin:0 auto;font-size:14px;line-height:1.75}
@media print{body{padding:40px 48px}@page{margin:1.5cm 2cm}}
.cover{padding-bottom:40px;margin-bottom:52px;border-bottom:3px solid #1a1a1a}
.report-label{font-size:8px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#aaa;margin-bottom:20px}
h1{font-family:'EB Garamond',Georgia,serif;font-size:52px;font-weight:600;letter-spacing:-.02em;line-height:1.05;color:#1a1a1a;margin-bottom:14px}
.trend-color-bar{height:5px;width:80px;background:${c};border-radius:2px;margin-bottom:20px}
.desc{font-size:16px;color:#444;line-height:1.8;max-width:680px;font-family:'EB Garamond',Georgia,serif;font-style:italic;margin-bottom:24px}
.pull-quote{margin:28px 0 0;padding:24px 28px;border-left:4px solid ${c};background:${c}08;border-radius:0 12px 12px 0}
.pull-quote-text{font-family:'EB Garamond',Georgia,serif;font-size:19px;font-style:italic;color:#111;line-height:1.65;margin-bottom:8px}
.pull-quote-attr{font-size:9px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:.12em}
.score-row{display:flex;align-items:center;gap:12px;margin:22px 0 0}
.score-bar{flex:1;height:3px;background:#f0f0f0;border-radius:2px;max-width:200px}
.score-fill{height:100%;width:${trend.relevanceScore}%;background:${c};border-radius:2px}
.score-label{font-size:10px;font-weight:700;color:#888;white-space:nowrap;letter-spacing:.06em}
.section{margin:48px 0}
.sh{display:flex;align-items:baseline;gap:14px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e8e8e8}
.sn{font-family:monospace;font-size:9px;font-weight:700;color:${c};letter-spacing:.1em}
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
.brand-moves{display:flex;flex-direction:column;gap:10px}
.brand-move{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border:1px solid #efefef;border-radius:10px;font-size:14px;color:#333;line-height:1.6}
.brand-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px}
.brand-label{flex:1}
.diversity-row{margin-bottom:20px}
.diversity-bar{display:flex;height:6px;border-radius:3px;overflow:hidden;background:#f0f0f0;margin-bottom:8px}
.diversity-seg{height:100%}
.diversity-legend{display:flex;gap:16px;font-size:10px;color:#888}
.diversity-legend span{display:flex;align-items:center;gap:4px}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex-shrink:0}
.quarter-block{margin-bottom:32px}
.quarter-label{font-size:9px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:.16em;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid ${c}22}
.quarter-signals{display:flex;flex-direction:column;gap:12px}
.signal{border:1px solid #ececec;border-left:3px solid ${c};border-radius:0 12px 12px 0;padding:18px 20px;break-inside:avoid}
.signal-header{display:flex;gap:14px;margin-bottom:10px}
.signal-num{font-family:monospace;font-size:9px;color:#ccc;font-weight:900;padding-top:3px;flex-shrink:0}
.signal-meta{flex:1}
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
  ${pullSignal ? `
  <div class="pull-quote">
    <div class="pull-quote-text">"${pullSignal.summary}"</div>
    <div class="pull-quote-attr">${pullSignal.sourceName ?? ""}${pullSignal.date ? " · " + new Date(pullSignal.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}</div>
  </div>` : ""}
  <div class="score-row">
    <div class="score-bar"><div class="score-fill"></div></div>
    <div class="score-label">Cultural Relevance Index &nbsp;${trend.relevanceScore} / 100</div>
  </div>
</div>

${trend.macroContext ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Macroeconomic Context</span></div>
  <p>${trend.macroContext}</p>
</div>` : ""}

${(trend.socialContext || trend.politicalContext || trend.geographicalContext || trend.culturalContext) ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Social, Political, Geographical &amp; Cultural Landscape</span></div>
  <div class="two-col">
    ${trend.socialContext ? `<div class="context-block"><div class="context-block-label">Social</div><p>${trend.socialContext}</p></div>` : ""}
    ${trend.politicalContext ? `<div class="context-block"><div class="context-block-label">Political</div><p>${trend.politicalContext}</p></div>` : ""}
    ${trend.geographicalContext ? `<div class="context-block"><div class="context-block-label">Geographical</div><p>${trend.geographicalContext}</p></div>` : ""}
    ${trend.culturalContext ? `<div class="context-block"><div class="context-block-label">Cultural</div><p>${trend.culturalContext}</p></div>` : ""}
  </div>
</div>` : ""}

<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Strategic Rationale</span></div>
  <div class="callout"><p>${trend.whyRelevant}</p></div>
</div>

<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Trajectory &amp; Outlook</span></div>
  <p style="font-style:italic;color:#555">${trend.trajectory}</p>
</div>

<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Recommended Actions</span></div>
  <div class="steps">
    ${trend.nextSteps.map((s, i) => `
    <div class="step">
      <div class="snum">${String(i + 1).padStart(2, "0")}</div>
      <div class="stext">${s}</div>
    </div>`).join("")}
  </div>
</div>

${brandMovesHTML}

${signals.length > 0 ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Signal Intelligence: ${signals.length} Signals</span></div>
  ${sourceDiversityBar}
  <p style="font-size:13px;color:#888;margin-bottom:24px;font-style:italic;line-height:1.7">Signals identified across media, research, and cultural sources — ordered by quarter to show momentum building over time.</p>
  ${signalTimelineHTML}
</div>` : ""}

<div class="footer">
  <span><strong>Augmented Radar</strong> maps emerging tech against culture.<br>By Martina from <a href="https://open.substack.com/pub/augmentedrarity" style="color:${c}">Augmented Rarity</a></span>
  <span>${date}</span>
</div>

<script>window.onload=()=>{setTimeout(()=>window.print(),400)}</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

export function TrendDetailModal({ trend, extraSignals = [], onClose, onSelectSignal }: Props) {
  const [showRelevanceInfo, setShowRelevanceInfo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const textCol = accessibleTextColor(trend.color);

  const signals = [
    ...SIGNALS.filter((s) => s.trendId === trend.id),
    ...EXTENDED_SIGNALS.filter((s) => s.trendId === trend.id),
    ...extraSignals.filter(s => s.trendId === trend.id),
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: isDesktop ? "24px" : "24px 24px 0 0",
          width: "100%",
          maxWidth: isDesktop ? 640 : 680,
          maxHeight: isDesktop ? "85vh" : "80svh",
          display: "flex",
          flexDirection: "column",
          boxShadow: isDesktop ? "0 24px 80px rgba(0,0,0,0.2)" : "0 -12px 80px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Color bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}44)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: textCol, textTransform: "uppercase", letterSpacing: "0.07em", background: `${trend.color}14`, padding: "3px 10px", borderRadius: 20 }}>
              Trend
            </span>
            <button onClick={onClose} style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>×</button>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111", lineHeight: 1.25, marginBottom: 10, letterSpacing: "-0.02em" }}>
            {trend.name}
          </h3>

          {/* Relevance bar */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f7f5", borderRadius: 10 }}>
              <div style={{ flex: 1, height: 3, backgroundColor: "#e8e4de", borderRadius: 2 }}>
                <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 11, color: "#999", fontWeight: 700, whiteSpace: "nowrap" }}>{trend.relevanceScore}% relevance</span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowRelevanceInfo(v => !v); }}
                style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid #d0ccc6", background: "#fff", color: "#aaa", fontSize: 10, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent", fontFamily: "serif" } as React.CSSProperties}
              >i</button>
            </div>
            {showRelevanceInfo && (
              <div onClick={() => setShowRelevanceInfo(false)} style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 10, background: "#1a1a1a", color: "#e8e4de", borderRadius: 12, padding: "12px 14px", fontSize: 12, lineHeight: 1.65, maxWidth: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>what's this score?</div>
                how much momentum this trend has right now: signal volume, recency, cross-category spread, and where it sits on the adoption curve. higher = more urgent.
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: "0 24px" } as React.CSSProperties}>
          <div style={{ paddingTop: 4, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 0 }}>

            {/* What's happening */}
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 20px", fontFamily: "'EB Garamond', Georgia, serif" }}>
              {trend.description}
            </p>

            {/* Why it matters */}
            <div style={{ background: `${trend.color}0c`, border: `1.5px solid ${trend.color}28`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: textCol, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>why it matters</div>
              <p style={{ fontSize: 13.5, color: "#111", lineHeight: 1.8, margin: 0 }}>{trend.whyRelevant}</p>
            </div>

            {/* Cultural context */}
            {trend.culturalContext && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>why now</div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.75, margin: 0, fontFamily: "'EB Garamond', Georgia, serif" }}>{trend.culturalContext}</p>
              </div>
            )}

            {/* What brands are doing */}
            {(trend.brandMoves ?? []).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>what brands are doing</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(trend.brandMoves ?? []).map((move, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: "#faf9f6", borderRadius: 10, border: "1px solid #efefef" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: trend.color, flexShrink: 0, marginTop: 5 }} />
                      {move.url ? (
                        <a href={move.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 12.5, color: "#333", lineHeight: 1.65, margin: 0, textDecoration: "none", display: "block" }}>
                          {move.label} <span style={{ color: textCol, fontSize: 11, fontWeight: 700 }}>→</span>
                        </a>
                      ) : (
                        <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.65, margin: 0 }}>{move.label}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What to do */}
            {trend.nextSteps.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>what to do</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {trend.nextSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "#faf9f6", borderRadius: 12, border: "1px solid #efefef" }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: trend.color + "18", color: textCol, border: `1.5px solid ${trend.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, fontFamily: "monospace", marginTop: 1 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: 13, color: "#222", lineHeight: 1.7, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signals */}
            {signals.length > 0 && (() => {
              const sorted = [...signals].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
              const now = new Date().getFullYear();

              // Cluster signals by keyword overlap
              const STOP = new Set(["the","a","an","is","are","of","in","to","for","with","and","or","that","this","it","as","by","on","at","from","its","their","has","have","been","will","new","says","more","most","how","what","which","when","who","all","can","into","over","after","now","first","per","cent","year","just","but","not","its","our","was","were","one","two","three","s"]);
              const tokenize = (t: string) => new Set(t.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !STOP.has(w)));
              const claimed = new Set<number>();
              const clusters: Signal[][] = [];
              for (let i = 0; i < sorted.length; i++) {
                if (claimed.has(i)) continue;
                const cluster: Signal[] = [sorted[i]];
                const pool = tokenize(sorted[i].title);
                for (let j = i + 1; j < sorted.length; j++) {
                  if (claimed.has(j)) continue;
                  const toks = tokenize(sorted[j].title);
                  const shared = [...toks].filter(t => pool.has(t)).length;
                  if (shared >= 2) { cluster.push(sorted[j]); claimed.add(j); toks.forEach(t => pool.add(t)); }
                }
                claimed.add(i);
                clusters.push(cluster);
              }

              return (
                <>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>signals ({sorted.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {clusters.map((cluster, ci) => {
                      const s = cluster[0];
                      const globalIdx = sorted.indexOf(s);
                      const ageFactor = sorted.length > 1 ? globalIdx / (sorted.length - 1) : 0;
                      const opacity = 1 - ageFactor * 0.55;
                      const sigYear = s.date ? new Date(s.date).getFullYear() : null;
                      const dateFmt = s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", ...(sigYear !== now ? { year: "2-digit" } : {}) }) : "";
                      const corroborated = cluster.length > 1;
                      return (
                        <div key={ci} style={{ opacity }}>
                          {corroborated && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, paddingLeft: 2 }}>
                              <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 20, padding: "2px 8px", letterSpacing: "0.06em" }}>
                                ✓ {cluster.length} sources reporting this
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => onSelectSignal(s)}
                            style={{ textAlign: "left", background: "#faf9f6", border: corroborated ? `1.5px solid ${trend.color}44` : "1px solid #eee", borderLeft: `3px solid ${trend.color}`, borderRadius: corroborated ? "12px 12px 0 0" : 12, padding: "12px 14px", cursor: "pointer", width: "100%", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: textCol, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sourceName}</span>
                              {s.isLive && <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.06em" }}>LIVE</span>}
                              <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{dateFmt}</span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: "#999", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{s.summary}</div>
                            {(s.crossLinks ?? []).length > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>↔ {(s.crossLinks ?? []).length} cross-trend connections</div>}
                          </button>
                          {corroborated && (
                            <div style={{ background: `${trend.color}08`, border: `1.5px solid ${trend.color}44`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "8px 14px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 2 }}>Also reported by</span>
                              {cluster.slice(1).map((cs, k) => {
                                const csYear = cs.date ? new Date(cs.date).getFullYear() : null;
                                const csFmt = cs.date ? new Date(cs.date).toLocaleDateString("en-US", { month: "short", ...(csYear !== now ? { year: "2-digit" } : {}) }) : "";
                                return (
                                  <button key={k} onClick={() => onSelectSignal(cs)} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff", border: "1px solid #eee", borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: "#555", fontWeight: 600, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
                                    <span>{getSourceIcon(cs.source)}</span>
                                    <span>{cs.sourceName}</span>
                                    {csFmt && <span style={{ color: "#bbb", fontWeight: 400 }}>· {csFmt}</span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}

            <div style={{ height: 8 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))", borderTop: "1px solid #f0ede8", flexShrink: 0, background: "#fff" }}>
          <button
            onClick={() => exportPDF(trend, signals)}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", backgroundColor: textCol, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
          >
            Export as PDF
          </button>
          <p style={{ fontSize: 10, color: "#ccc", margin: "10px 0 0", textAlign: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Augmented Radar maps emerging tech against culture.<br />By Martina from{" "}
            <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#bbb", textDecoration: "underline", textUnderlineOffset: 2 }}>
              Augmented Rarity
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
