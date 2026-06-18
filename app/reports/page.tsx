"use client";

import { useState } from "react";
import { MOCK_SIGNALS, getSignalColor, getStrengthLabel } from "@/lib/signals";
import { Signal } from "@/types";

function buildReport(signals: Signal[], brief: string, clientName: string): string {
  const categories = [...new Set(signals.map((s) => s.category))];
  const strong = signals.filter((s) => s.strength === "strong");
  const emerging = signals.filter((s) => s.strength === "emerging");
  const weak = signals.filter((s) => s.strength === "weak");
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `# Emerging Signal Intelligence Report
${clientName ? `### Prepared for: ${clientName}` : ""}
*${date}*

---

## Executive Summary

${brief || "This report maps the current landscape of emerging technology signals with strategic implications for brands operating in fashion, beauty, lifestyle, and culture."}

We identified **${strong.length} confirmed strong trends**, **${emerging.length} emerging signals**, and **${weak.length} early weak signals** across ${categories.length} technology and culture categories. Together these signals define a landscape in transition — where brands that move early will build durable advantages.

---

## Signal Landscape Overview

| Strength | Count | What it means |
|---|---|---|
| 🟢 Strong | ${strong.length} | Consumer awareness is building. Activate now. |
| 🟡 Emerging | ${emerging.length} | Early signals with real momentum. Pilot now. |
| 🔵 Weak | ${weak.length} | Future-facing. Monitor and position early. |

**Categories covered:** ${categories.map((c) => (c ?? "other").replace(/-/g, " ")).join(", ")}

---

## Signal Deep Dives

${signals.map((s, i) => `### ${i + 1}. ${s.title}

**Category:** ${(s.category ?? "other").replace(/-/g, " ")} · **Signal strength:** ${getStrengthLabel(s.strength as "weak" | "emerging" | "strong" ?? "weak")}

${s.summary}

**Why it's emerging now**
${s.why_emerging}

**Strategic relevance for brands**
${s.brand_relevance}

${(s.tags ?? []).length > 0 ? `*Tags: ${(s.tags ?? []).map(t => `#${t}`).join(" ")}*` : ""}
${(s.sources ?? []).length > 0 ? `*Sources: ${(s.sources ?? []).join(", ")}*` : ""}
`).join("\n---\n\n")}

---

## Strategic Recommendations

### Act Now (Strong signals)
${strong.length > 0
  ? strong.map(s => `- **${s.title}** — Consumer awareness is building. This window for differentiation is closing.`).join("\n")
  : "No strong signals in this selection."}

### Pilot & Experiment (Emerging signals)
${emerging.length > 0
  ? emerging.map(s => `- **${s.title}** — Invest in small-scale experiments. The market is forming.`).join("\n")
  : "No emerging signals in this selection."}

### Monitor & Position (Weak signals)
${weak.length > 0
  ? weak.map(s => `- **${s.title}** — 2–4 year horizon. Build internal knowledge now.`).join("\n")
  : "No weak signals in this selection."}

---

## Methodology

Signals are sourced from academic preprints (arXiv, bioRxiv), patent filings, niche community platforms (Reddit, Hacker News), trade press, and product launch platforms. Signal strength is assessed on momentum, novelty, and proximity to mainstream adoption — not volume.

---

*Rarity Radar — Where tech meets fashion, beauty & lifestyle · ${date}*
`.trim();
}

export default function ReportsPage() {
  const [clientName, setClientName] = useState("");
  const [brief, setBrief] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(MOCK_SIGNALS.map((s) => s.id));
  const [report, setReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const toggleSignal = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === MOCK_SIGNALS.length ? [] : MOCK_SIGNALS.map((s) => s.id));

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const selected = MOCK_SIGNALS.filter((s) => selectedIds.includes(s.id));
      setReport(buildReport(selected, brief, clientName));
      setGenerating(false);
    }, 600);
  };

  const download = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `trend-report-${clientName ? clientName.toLowerCase().replace(/\s+/g, "-") + "-" : ""}${Date.now()}.md`;
    a.click();
  };

  const groupedSignals = MOCK_SIGNALS.reduce<Record<string, Signal[]>>((acc, s) => {
    const cat = s.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Left panel — builder */}
      <div className="w-80 shrink-0 border-r border-gray-100 bg-white overflow-y-auto flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-base font-bold text-gray-900 mb-1">Report Builder</h1>
          <p className="text-xs text-gray-400">Configure and generate a strategic brief.</p>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1.5">
              Client / brand
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
              placeholder="e.g. Chanel, Nike, Glossier…"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1.5">
              Brief / focus
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-300"
              placeholder="e.g. 'Strategic brief for a luxury beauty brand entering the biotech space in 2027…'"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Signals ({selectedIds.length})
              </label>
              <button
                onClick={toggleAll}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {selectedIds.length === MOCK_SIGNALS.length ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedSignals).map(([cat, signals]) => (
                <div key={cat}>
                  <div
                    className="text-xs font-semibold mb-2 uppercase tracking-widest"
                    style={{ color: getSignalColor(cat as Signal["category"]) }}
                  >
                    {cat.replace(/-/g, " ")}
                  </div>
                  <div className="space-y-1.5">
                    {signals.map((s) => (
                      <label key={s.id} className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSignal(s.id)}
                          className="mt-0.5 accent-gray-900 shrink-0"
                        />
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 leading-relaxed">
                          {s.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 space-y-2">
          <button
            onClick={generate}
            disabled={generating || selectedIds.length === 0}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating…" : "Generate report"}
          </button>
          {report && (
            <button
              onClick={download}
              className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Export as .md
            </button>
          )}
        </div>
      </div>

      {/* Right panel — report output */}
      <div className="flex-1 overflow-y-auto bg-[#f7f7f5]">
        {report ? (
          <div className="max-w-2xl mx-auto px-10 py-10">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-10 py-10">
              <ReportRenderer content={report} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <div className="text-4xl mb-4">▤</div>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Configure your brief on the left and hit <strong className="text-gray-600">Generate report</strong> to create a structured strategic document.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-0">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{line.slice(2)}</h1>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold text-gray-500 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3 pt-6 border-t border-gray-100">{line.slice(3)}</h2>;
        if (line.startsWith("---")) return <div key={i} className="my-6 border-t border-gray-100" />;
        if (line.startsWith("| ")) return <TableRow key={i} line={line} />;
        if (line.startsWith("- **")) {
          const match = line.match(/^- \*\*(.+?)\*\*(.*)/);
          if (match) return <p key={i} className="text-sm text-gray-700 my-1.5 ml-2">• <strong>{match[1]}</strong>{match[2]}</p>;
        }
        if (line.startsWith("- ")) return <p key={i} className="text-sm text-gray-700 my-1.5 ml-2">• {line.slice(2)}</p>;
        if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
          return <p key={i} className="text-xs text-gray-400 italic my-1">{line.slice(1, -1)}</p>;
        }
        if (!line.trim()) return <div key={i} className="h-2" />;
        const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        return <p key={i} className="text-sm text-gray-700 leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: bold }} />;
      })}
    </div>
  );
}

function TableRow({ line }: { line: string }) {
  if (line.match(/^[\|\s\-]+$/)) return null;
  const cells = line.split("|").filter((c) => c.trim());
  return (
    <div className="grid gap-2 my-1 text-sm" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
      {cells.map((cell, i) => (
        <span key={i} className={`${i === 0 ? "font-medium text-gray-800" : "text-gray-600"} text-xs`}>
          {cell.trim()}
        </span>
      ))}
    </div>
  );
}
