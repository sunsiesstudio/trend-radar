"use client";

import { useState, useEffect } from "react";
import { Trend, Signal } from "@/types";
import { SIGNALS, TRENDS, getSourceIcon } from "@/lib/trends";
import { EXTENDED_SIGNALS, TOPIC_LIBRARY } from "@/lib/extended-trends";

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
  mode?: "modal" | "sidebar";
}


function quarterLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
}

function exportPDF(trend: Trend, signals: Signal[]) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const c = trend.color;

  // ── Data preparation ─────────────────────────────────────────────
  const sorted = [...signals].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const pullSignal = sorted.length > 0 ? sorted.reduce((best, s) => (s.summary.length > best.summary.length ? s : best), sorted[0]) : null;

  // Who's talking
  const newsSignals = sorted.filter(s => s.source === "news");
  const redditSignals = sorted.filter(s => s.source === "reddit");
  const otherSignals = sorted.filter(s => s.source !== "news" && s.source !== "reddit");
  const mediaNames = [...new Set(newsSignals.map(s => s.sourceName).filter(Boolean))];
  const communityNames = [...new Set(redditSignals.map(s => s.sourceName).filter(Boolean))];

  // Source diversity counts
  const total = signals.length || 1;

  // Signal clustering (corroboration)
  const STOP = new Set(["the","a","an","is","are","of","in","to","for","with","and","or","that","this","it","as","by","on","at","from","its","their","has","have","been","will","new","says","more","most","how","what","which","when","who","all","can","into","over","after","now","first","per","cent","year","just","but","not","our","was","were","one","two","three","s"]);
  const tok = (t: string) => new Set(t.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !STOP.has(w)));
  const claimed = new Set<number>();
  const clusters: Signal[][] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (claimed.has(i)) continue;
    const cluster: Signal[] = [sorted[i]];
    const pool = tok(sorted[i].title);
    for (let j = i + 1; j < sorted.length; j++) {
      if (claimed.has(j)) continue;
      const toks = tok(sorted[j].title);
      if ([...toks].filter(t => pool.has(t)).length >= 2) { cluster.push(sorted[j]); claimed.add(j); toks.forEach(t => pool.add(t)); }
    }
    claimed.add(i); clusters.push(cluster);
  }

  // Group clusters by quarter
  const byQuarter: Record<string, Signal[][]> = {};
  clusters.forEach(cl => {
    const s = cl[0];
    if (!s.date) return;
    const q = quarterLabel(s.date);
    (byQuarter[q] = byQuarter[q] || []).push(cl);
  });
  const quarters = Object.keys(byQuarter).sort().reverse();

  // Related trends — same topic, different trend
  const allExtended = Object.values(TOPIC_LIBRARY).flat();
  const allTrends = [...TRENDS, ...allExtended];
  const trendTopics = trend.topics ?? [];
  const related = allTrends
    .filter(t => t.id !== trend.id && (t.topics ?? []).some(tp => trendTopics.includes(tp)))
    .slice(0, 6);

  // ── Section builders ─────────────────────────────────────────────
  let sectionNum = 1;
  const sn = () => String(sectionNum++).padStart(2, "0");

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const signalCard = (s: Signal, num: number) => {
    const signalUrl = s.sourceUrl ?? "";
    return `<div class="signal">
      <div class="signal-header">
        <span class="signal-num">${String(num).padStart(2, "0")}</span>
        <div class="signal-meta">
          <div class="signal-title">${s.title}${s.isLive ? ' <span class="live-badge">LIVE</span>' : ""}</div>
          <div class="signal-source">${getSourceIcon(s.source)} ${s.sourceName ?? ""}${s.date ? ` · ${fmtDate(s.date)}` : ""}${signalUrl ? ` · <a href="${signalUrl}" style="color:${c}">source ↗</a>` : ""}</div>
        </div>
      </div>
      <p class="signal-summary">${s.summary}</p>
    </div>`;
  };

  const signalTimelineHTML = quarters.map(q => {
    const qClusters = byQuarter[q];
    return `<div class="quarter-block">
      <div class="quarter-label">${q}</div>
      <div class="quarter-signals">
        ${qClusters.map(cl => {
          const primary = cl[0];
          const num = sorted.indexOf(primary) + 1;
          const corroborated = cl.length > 1;
          return `${corroborated ? `<div class="corroboration-badge">✓ ${cl.length} sources reporting this</div>` : ""}
          ${signalCard(primary, num)}
          ${corroborated ? `<div class="also-reported">
            <span class="also-label">Also reported by</span>
            ${cl.slice(1).map(cs => `<span class="also-pill">${getSourceIcon(cs.source)} ${cs.sourceName ?? ""}${cs.date ? ` · ${fmtDate(cs.date)}` : ""}</span>`).join("")}
          </div>` : ""}`;
        }).join("")}
      </div>
    </div>`;
  }).join("");

  // ── HTML ─────────────────────────────────────────────────────────
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

/* Cover */
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

/* Sections */
.section{margin:48px 0}
.sh{display:flex;align-items:baseline;gap:14px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e8e8e8}
.sn{font-family:monospace;font-size:9px;font-weight:700;color:${c};letter-spacing:.1em}
.st{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:#999}
p{font-size:15px;color:#2a2a2a;line-height:1.85;margin-bottom:10px}

/* Callouts */
.callout{background:${c}0d;border-left:4px solid ${c};padding:20px 24px;border-radius:0 10px 10px 0;margin:4px 0}
.callout p{color:#111;margin-bottom:0;font-size:15.5px;font-weight:500}
.context-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}
.context-block{padding:18px 20px;border:1px solid #efefef;border-radius:10px;break-inside:avoid}
.context-block-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${c};margin-bottom:8px}
.context-block p{font-size:13px;color:#444;line-height:1.78;margin:0}
.context-block.political{border-color:${c}44;background:${c}06}
.context-block.economic{border-color:${c}44;background:${c}06}

/* Steps */
.steps{display:flex;flex-direction:column;gap:14px}
.step{display:flex;gap:16px;align-items:flex-start}
.snum{width:26px;height:26px;border-radius:6px;background:${c}15;border:1.5px solid ${c}35;color:${c};font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.stext{font-size:14.5px;color:#333;line-height:1.78;padding-top:3px}

/* Brand moves */
.brand-moves{display:flex;flex-direction:column;gap:10px}
.brand-move{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border:1px solid #efefef;border-radius:10px;font-size:14px;color:#333;line-height:1.6}
.brand-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px;background:${c}}
.brand-label{flex:1}

/* Who's talking */
.talking-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.talking-block{padding:18px 20px;border:1px solid #efefef;border-radius:10px}
.talking-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${c};margin-bottom:12px}
.source-tag{display:inline-block;font-size:11px;font-weight:600;color:#555;background:#f5f4f1;border:1px solid #e8e8e8;border-radius:20px;padding:3px 10px;margin:3px 3px 3px 0;line-height:1.4}

/* Related trends */
.related-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.related-card{padding:14px 16px;border:1px solid #efefef;border-radius:10px;break-inside:avoid}
.related-name{font-size:13px;font-weight:700;color:#111;margin-bottom:4px}
.related-desc{font-size:11.5px;color:#888;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.related-topics{margin-top:8px;display:flex;gap:5px;flex-wrap:wrap}
.topic-pill{font-size:9px;font-weight:700;color:${c};background:${c}12;border-radius:20px;padding:2px 8px;text-transform:uppercase;letter-spacing:.06em}

/* Source diversity */
.diversity-bar-wrap{margin-bottom:20px}
.diversity-bar{display:flex;height:5px;border-radius:3px;overflow:hidden;background:#f0f0f0;margin-bottom:8px;gap:2px}
.diversity-seg{height:100%;border-radius:2px}
.diversity-legend{display:flex;gap:16px;font-size:10px;color:#888}
.diversity-legend span{display:flex;align-items:center;gap:5px}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}

/* Signal timeline */
.quarter-block{margin-bottom:32px}
.quarter-label{font-size:9px;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:.16em;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid ${c}22}
.quarter-signals{display:flex;flex-direction:column;gap:8px}
.corroboration-badge{font-size:9px;font-weight:800;color:#00a85f;background:#00a85f12;border-radius:20px;padding:3px 10px;display:inline-block;margin-bottom:4px;letter-spacing:.04em}
.signal{border:1px solid #ececec;border-left:3px solid ${c};border-radius:0 12px 12px 0;padding:16px 18px;break-inside:avoid}
.signal-header{display:flex;gap:14px;margin-bottom:8px}
.signal-num{font-family:monospace;font-size:9px;color:#ccc;font-weight:900;padding-top:3px;flex-shrink:0}
.signal-meta{flex:1}
.signal-title{font-size:13.5px;font-weight:600;color:#111;line-height:1.4;margin-bottom:3px}
.signal-source{font-size:10px;color:#bbb;letter-spacing:.02em}
.signal-summary{font-size:12.5px;color:#555;line-height:1.75;margin:0}
.live-badge{display:inline-block;font-size:8px;font-weight:800;color:#00c47a;background:#00c47a12;border-radius:4px;padding:1px 5px;vertical-align:middle;margin-left:6px;letter-spacing:.06em}
.also-reported{display:flex;align-items:center;flex-wrap:wrap;gap:6px;background:#fafafa;border:1px solid #ececec;border-left:3px solid ${c}55;border-top:none;border-radius:0 0 10px 10px;padding:8px 14px;margin-top:-2px}
.also-label{font-size:9px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:.08em;margin-right:4px}
.also-pill{font-size:10px;color:#666;font-weight:600;background:#fff;border:1px solid #e8e8e8;border-radius:20px;padding:2px 9px}

/* Footer */
.footer{margin-top:60px;padding-top:20px;border-top:2px solid ${c}22;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#bbb;letter-spacing:.03em}
.footer strong{color:${c};font-weight:700}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="report-label">Trend Intelligence Report &nbsp;·&nbsp; ${date}</div>
  <h1>${trend.name}</h1>
  <div class="trend-color-bar"></div>
  <p class="desc">${trend.description}</p>
  ${pullSignal ? `<div class="pull-quote">
    <div class="pull-quote-text">"${pullSignal.summary}"</div>
    <div class="pull-quote-attr">${pullSignal.sourceName ?? ""}${pullSignal.date ? " · " + new Date(pullSignal.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}</div>
  </div>` : ""}
  <div class="score-row">
    <div class="score-bar"><div class="score-fill"></div></div>
    <div class="score-label">Cultural Relevance Index &nbsp;${trend.relevanceScore} / 100</div>
  </div>
</div>

<!-- 01 WHY IT MATTERS -->
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Why This Trend Matters</span></div>
  <div class="callout"><p>${trend.whyRelevant}</p></div>
  ${trend.culturalContext ? `<p style="margin-top:16px;font-size:14px;color:#555;font-style:italic;line-height:1.8">${trend.culturalContext}</p>` : ""}
</div>

<!-- 02 MACRO / ECONOMY / POLITICS -->
${(trend.macroContext || trend.economicContext || trend.politicalContext || trend.socialContext || trend.geographicalContext) ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Macro Forces: Economy, Politics &amp; Society</span></div>
  ${trend.macroContext ? `<p>${trend.macroContext}</p>` : ""}
  <div class="context-row" style="margin-top:${trend.macroContext ? "16px" : "0"}">
    ${trend.economicContext ? `<div class="context-block economic"><div class="context-block-label">Economic</div><p>${trend.economicContext}</p></div>` : ""}
    ${trend.politicalContext ? `<div class="context-block political"><div class="context-block-label">Political</div><p>${trend.politicalContext}</p></div>` : ""}
    ${trend.socialContext ? `<div class="context-block"><div class="context-block-label">Social</div><p>${trend.socialContext}</p></div>` : ""}
    ${trend.geographicalContext ? `<div class="context-block"><div class="context-block-label">Geographical</div><p>${trend.geographicalContext}</p></div>` : ""}
  </div>
</div>` : ""}

<!-- 03 TRAJECTORY -->
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Trajectory &amp; Outlook</span></div>
  <p style="font-style:italic;color:#555;font-size:15px">${trend.trajectory}</p>
</div>

<!-- 04 WHO'S TALKING -->
${(mediaNames.length > 0 || communityNames.length > 0) ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Who's Talking About This</span></div>
  <div style="margin-bottom:14px">
    <div class="diversity-bar-wrap">
      <div class="diversity-bar">
        ${newsSignals.length > 0 ? `<div class="diversity-seg" style="width:${(newsSignals.length/total*100).toFixed(0)}%;background:${c}"></div>` : ""}
        ${redditSignals.length > 0 ? `<div class="diversity-seg" style="width:${(redditSignals.length/total*100).toFixed(0)}%;background:${c}88"></div>` : ""}
        ${otherSignals.length > 0 ? `<div class="diversity-seg" style="width:${(otherSignals.length/total*100).toFixed(0)}%;background:${c}44"></div>` : ""}
      </div>
      <div class="diversity-legend">
        ${newsSignals.length > 0 ? `<span><span class="dot" style="background:${c}"></span>${newsSignals.length} media</span>` : ""}
        ${redditSignals.length > 0 ? `<span><span class="dot" style="background:${c}88"></span>${redditSignals.length} community</span>` : ""}
        ${otherSignals.length > 0 ? `<span><span class="dot" style="background:${c}44"></span>${otherSignals.length} other</span>` : ""}
      </div>
    </div>
  </div>
  <div class="talking-grid">
    ${mediaNames.length > 0 ? `<div class="talking-block">
      <div class="talking-label">Media Coverage</div>
      <div>${mediaNames.map(n => `<span class="source-tag">${n}</span>`).join("")}</div>
    </div>` : ""}
    ${communityNames.length > 0 ? `<div class="talking-block">
      <div class="talking-label">Community Conversation</div>
      <div>${communityNames.map(n => `<span class="source-tag">${n}</span>`).join("")}</div>
    </div>` : ""}
  </div>
</div>` : ""}

<!-- 05 BRAND MOVES -->
${(trend.brandMoves ?? []).length > 0 ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">What Brands Are Doing</span></div>
  <p style="font-size:13px;color:#888;margin-bottom:18px;font-style:italic">Real-world examples of brands, products, and campaigns already acting on this trend.</p>
  <div class="brand-moves">
    ${(trend.brandMoves ?? []).map(m => `<div class="brand-move">
      <span class="brand-dot"></span>
      <span class="brand-label">${(() => { try { const u = new URL(m.url ?? ""); return u.pathname.length > 1 && u.pathname !== "/"; } catch { return false; } })() ? `<a href="${m.url}" style="color:inherit;text-decoration:underline;text-underline-offset:2px">${m.label}</a>` : m.label}</span>
    </div>`).join("")}
  </div>
</div>` : ""}

<!-- 06 RELATED TRENDS -->
${related.length > 0 ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">How This Connects to Other Trends</span></div>
  <p style="font-size:13px;color:#888;margin-bottom:18px;font-style:italic">Trends sharing overlapping territory — reading them together reveals a larger cultural shift.</p>
  <div class="related-grid">
    ${related.map(t => {
      const sharedTopics = (t.topics ?? []).filter(tp => trendTopics.includes(tp));
      return `<div class="related-card">
        <div class="related-name">${t.name}</div>
        <div class="related-desc">${t.description}</div>
        <div class="related-topics">${sharedTopics.map(tp => `<span class="topic-pill">${tp}</span>`).join("")}</div>
      </div>`;
    }).join("")}
  </div>
</div>` : ""}

<!-- 07 SIGNAL INTELLIGENCE -->
${signals.length > 0 ? `
<div class="section">
  <div class="sh"><span class="sn">${sn()}</span><span class="st">Signal Intelligence: ${signals.length} Signals Tracked</span></div>
  <p style="font-size:13px;color:#888;margin-bottom:24px;font-style:italic;line-height:1.7">Signals ordered by quarter to show momentum building over time. Where multiple sources report the same event, they are grouped and marked as corroborated.</p>
  ${signalTimelineHTML}
</div>` : ""}

<div class="footer">
  <span><strong>Augmented Culture</strong> maps emerging tech against culture.<br>By Martina from <a href="https://open.substack.com/pub/augmentedrarity" style="color:${c}">Augmented Rarity</a></span>
  <span>${date}</span>
</div>

<script>window.onload=()=>{setTimeout(()=>window.print(),400)}</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

export function TrendDetailModal({ trend, extraSignals = [], onClose, onSelectSignal, mode = "modal" }: Props) {
  const [showRelevanceInfo, setShowRelevanceInfo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  useEffect(() => {
    if (!showRelevanceInfo) return;
    const handler = () => setShowRelevanceInfo(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showRelevanceInfo]);
  const textCol = accessibleTextColor(trend.color);

  const signals = [
    ...SIGNALS.filter((s) => s.trendId === trend.id),
    ...EXTENDED_SIGNALS.filter((s) => s.trendId === trend.id),
    ...extraSignals.filter(s => s.trendId === trend.id),
  ];

  const panel = (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "#f8f7f3",
        borderRadius: mode === "sidebar" ? 0 : (isDesktop ? "24px" : "24px 24px 0 0"),
        width: "100%",
        maxWidth: mode === "sidebar" ? undefined : (isDesktop ? 640 : 680),
        maxHeight: mode === "sidebar" ? undefined : (isDesktop ? "85vh" : "80svh"),
        flex: mode === "sidebar" ? 1 : undefined,
        minHeight: mode === "sidebar" ? 0 : undefined,
        display: "flex",
        flexDirection: "column",
        boxShadow: mode === "sidebar" ? "none" : (isDesktop ? "0 24px 80px rgba(0,0,0,0.2)" : "0 -12px 80px rgba(0,0,0,0.15)"),
        overflow: "hidden",
      }}
    >
        {/* Color bar — modal only */}
        {mode !== "sidebar" && (
          <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}44)`, flexShrink: 0 }} />
        )}

        {mode === "sidebar" ? (
          /* Sidebar header — white background */
          <div style={{ padding: "12px 20px 10px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: textCol, textTransform: "uppercase", letterSpacing: "0.1em", background: `${trend.color}18`, padding: "3px 10px", borderRadius: 20 }}>Trend</span>
              <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 17, color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: trend.color, flexShrink: 0 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.2, margin: 0, fontFamily: "'EB Garamond', Georgia, serif" }}>
                {trend.name}
              </h3>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f7f5", borderRadius: 10 }}>
                <div style={{ flex: 1, height: 3, backgroundColor: "#e8e4de", borderRadius: 2 }}>
                  <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: "#999", fontWeight: 700, whiteSpace: "nowrap" }}>{trend.relevanceScore}% relevance</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowRelevanceInfo(v => !v); }}
                  style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid #d0ccc6", background: "#f8f7f3", color: "#aaa", fontSize: 10, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, fontFamily: "serif" } as React.CSSProperties}
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
        ) : (
          /* Modal header */
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
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f7f5", borderRadius: 10 }}>
                <div style={{ flex: 1, height: 3, backgroundColor: "#e8e4de", borderRadius: 2 }}>
                  <div style={{ width: `${trend.relevanceScore}%`, height: "100%", backgroundColor: trend.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: "#999", fontWeight: 700, whiteSpace: "nowrap" }}>{trend.relevanceScore}% relevance</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowRelevanceInfo(v => !v); }}
                  style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid #d0ccc6", background: "#f8f7f3", color: "#aaa", fontSize: 10, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent", fontFamily: "serif" } as React.CSSProperties}
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
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: mode === "sidebar" ? "0 20px" : "0 24px" } as React.CSSProperties}>
          <div style={{ paddingTop: mode === "sidebar" ? 14 : 4, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 0 }}>

            {/* What's happening */}
            <p style={{ fontSize: mode === "sidebar" ? 14 : 15, color: "#555", lineHeight: 1.7, margin: "0 0 16px", fontFamily: "'EB Garamond', Georgia, serif" }}>
              {trend.description}
            </p>

            {/* Tech tags */}
            {(trend.techTags ?? []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                {(trend.techTags ?? []).map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontWeight: 700, color: textCol,
                    background: `${trend.color}14`, border: `1px solid ${trend.color}30`,
                    borderRadius: 20, padding: "3px 9px", letterSpacing: "0.04em",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Why it matters */}
            <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14, marginBottom: 16 }}>
              <div style={{
                background: `${trend.color}18`,
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: textCol, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>why it matters</div>
                <p style={{ fontSize: 13, color: "#333", lineHeight: 1.75, margin: 0 }}>{trend.whyRelevant}</p>
              </div>
            </div>

            {/* Cultural context — always shown */}
            <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>why now</div>
              {trend.culturalContext ? (
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.75, margin: 0, fontFamily: "'EB Garamond', Georgia, serif" }}>{trend.culturalContext}</p>
              ) : (
                <p style={{ fontSize: 12, color: "#ccc", margin: 0, fontStyle: "italic" }}>Cultural context not yet tracked.</p>
              )}
            </div>

            {/* What brands are doing */}
            <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14, marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>what brands are doing</div>
              {(trend.brandMoves ?? []).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(trend.brandMoves ?? []).map((move, i) => {
                    const isArticle = (() => { try { const u = new URL(move.url ?? ""); return u.pathname.length > 1 && u.pathname !== "/"; } catch { return false; } })();
                    return (
                      <div key={i} style={{ padding: "10px 14px", background: "#faf9f6", borderRadius: 10, border: "1px solid #efefef" }}>
                        {isArticle ? (
                          <a href={move.url!} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 12.5, color: "#333", lineHeight: 1.65, margin: 0, textDecoration: "none", display: "block" }}>
                            {move.label} <span style={{ color: textCol, fontSize: 11, fontWeight: 700 }}>→</span>
                          </a>
                        ) : (
                          <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.65, margin: 0 }}>{move.label}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "#ccc", margin: 0, fontStyle: "italic" }}>No brand activity tracked yet.</p>
              )}
            </div>


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
                  <div style={{ borderTop: "1px solid #f0ede8", paddingTop: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>signals ({sorted.length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {clusters.map((cluster, ci) => {
                      const s = cluster[0];
                      const sigYear = s.date ? new Date(s.date).getFullYear() : null;
                      const dateFmt = s.date ? new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", ...(sigYear !== now ? { year: "2-digit" } : {}) }) : "";
                      const corroborated = cluster.length > 1;
                      return (
                        <div key={ci}>
                          {corroborated && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, paddingLeft: 2 }}>
                              <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 20, padding: "2px 8px", letterSpacing: "0.06em" }}>
                                ✓ {cluster.length} sources reporting this
                              </span>
                            </div>
                          )}
                          <div style={{ background: "#faf9f6", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
                            <button
                              onClick={() => onSelectSignal(s)}
                              style={{ textAlign: "left", background: "transparent", border: "none", padding: "12px 14px", cursor: "pointer", width: "100%", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                <span style={{ fontSize: 12 }}>{getSourceIcon(s.source)}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.sourceName}</span>
                                {s.isLive && <span style={{ fontSize: 9, fontWeight: 800, color: "#00c47a", background: "#00c47a15", borderRadius: 4, padding: "1px 5px", letterSpacing: "0.06em" }}>LIVE</span>}
                                <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb" }}>{dateFmt}</span>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{s.title}</div>
                              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{s.summary}</div>
                              {(s.crossLinks ?? []).length > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 600 }}>↔ {(s.crossLinks ?? []).length} cross-trend connections</div>}
                            </button>
                            {corroborated && (
                              <div style={{ borderTop: "1px solid #eee", padding: "8px 14px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 2 }}>Also reported by</span>
                                {cluster.slice(1).map((cs, k) => {
                                  const csYear = cs.date ? new Date(cs.date).getFullYear() : null;
                                  const csFmt = cs.date ? new Date(cs.date).toLocaleDateString("en-US", { month: "short", ...(csYear !== now ? { year: "2-digit" } : {}) }) : "";
                                  return (
                                    <button key={k} onClick={() => onSelectSignal(cs)} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f8f7f3", border: "1px solid #eee", borderRadius: 20, padding: "3px 10px", cursor: "pointer", fontSize: 10, color: "#555", fontWeight: 600, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>
                                      <span>{getSourceIcon(cs.source)}</span>
                                      <span>{cs.sourceName}</span>
                                      {csFmt && <span style={{ color: "#bbb", fontWeight: 400 }}>· {csFmt}</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </>
              );
            })()}

            <div style={{ height: 8 }} />
          </div>
        </div>

        {/* Footer — modal only */}
        {mode !== "sidebar" && (
          <div style={{ padding: "12px 20px", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))", borderTop: "1px solid #f0ede8", flexShrink: 0, background: "#f8f7f3" }}>
            <button
              onClick={() => exportPDF(trend, signals)}
              style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", backgroundColor: textCol, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            >
              Export as PDF
            </button>
            <p style={{ fontSize: 10, color: "#ccc", margin: "10px 0 0", textAlign: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              Augmented Culture maps emerging tech against culture.<br />By Martina from{" "}
              <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#bbb", textDecoration: "underline", textUnderlineOffset: 2 }}>
                Augmented Rarity
              </a>
            </p>
          </div>
        )}
    </div>
  );

  if (mode === "sidebar") return panel;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {panel}
    </div>
  );
}
