"use client";

import { useState } from "react";
import { Signal, Trend } from "@/types";
import { TRENDS } from "@/lib/trends";
import { EXTENDED_TRENDS } from "@/lib/extended-trends";

interface Props {
  onAdd: (signal: Signal) => void;
  onClose: () => void;
  defaultTrendId?: string;
  trends?: Trend[];
}

export function AddSignalModal({ onAdd, onClose, defaultTrendId, trends: passedTrends }: Props) {
  const base = passedTrends ?? [];
  const extra = EXTENDED_TRENDS.filter(t => !base.some(b => b.id === t.id));
  const trendList = [...base, ...extra].length > 0 ? [...base, ...extra] : TRENDS;
  const [trendId, setTrendId]       = useState(defaultTrendId ?? trendList[0].id);
  const [title, setTitle]           = useState("");
  const [summary, setSummary]       = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl]   = useState("");
  const [source, setSource]         = useState<Signal["source"]>("manual");

  const trend = trendList.find((t) => t.id === trendId) ?? trendList[0];
  const canSubmit = title.trim().length > 0 && summary.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onAdd({
      id: crypto.randomUUID(),
      trendId,
      title: title.trim(),
      summary: summary.trim(),
      source,
      sourceName: sourceName.trim() || "Manual",
      sourceUrl: sourceUrl.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
      crossLinks: [],
    });
    onClose();
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {label}
      </div>
      {children}
    </div>
  );

  const inputBase: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#f8f8f8",
    border: "1.5px solid #ebebeb",
    borderRadius: 12,
    padding: "13px 15px",
    fontSize: 15,
    color: "#000",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    boxSizing: "border-box",
    minHeight: 48,
    colorScheme: "light",
  } as React.CSSProperties;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "0 16px" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          /* flex column so body scrolls and footer stays fixed above keyboard */
          display: "flex",
          flexDirection: "column",
          maxHeight: "90svh",
          boxShadow: "0 -8px 60px rgba(0,0,0,0.14)",
        }}
      >
        {/* Color stripe */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}44)`, flexShrink: 0, borderRadius: "20px 20px 0 0" }} />

        {/* Header — fixed, never scrolls away */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0f0f0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000", letterSpacing: "-0.02em", fontFamily: "var(--font-serif), serif", margin: 0 }}>
            Add signal
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 18, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
        </div>

        {/* Body — scrolls independently */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 } as React.CSSProperties}>

          {field("Add to trend",
            <div style={{ position: "relative" }}>
              <select
                value={trendId}
                onChange={(e) => setTrendId(e.target.value)}
                style={{ ...inputBase, cursor: "pointer", paddingRight: 40 }}
              >
                {[...trendList].sort((a, b) => a.name.localeCompare(b.name)).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none", lineHeight: 1 }}>⌄</span>
            </div>
          )}

          {field("Title *",
            <input
              style={inputBase}
              placeholder="What is this signal?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoCapitalize="sentences"
            />
          )}

          {field("Summary *",
            <textarea
              style={{ ...inputBase, resize: "none", lineHeight: 1.55 }}
              rows={4}
              placeholder="Why does this matter? What does it signal?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              autoCapitalize="sentences"
            />
          )}

          {field("Source name",
            <input
              style={inputBase}
              placeholder="e.g. Wired, r/fashion, NYT…"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              autoCapitalize="words"
            />
          )}

          {field("Source type",
            <div style={{ position: "relative" }}>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as Signal["source"])}
                style={{ ...inputBase, cursor: "pointer", paddingRight: 40 }}
              >
                {["manual", "reddit", "news", "youtube", "arxiv", "hackernews"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none", lineHeight: 1 }}>⌄</span>
            </div>
          )}

          {field("Source URL (optional)",
            <input
              style={inputBase}
              placeholder="https://…"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
            />
          )}

          {/* Extra bottom breathing room so last field clears the footer */}
          <div style={{ height: 8 }} />
        </div>

        {/* Footer — stays above keyboard */}
        <div style={{
          padding: "12px 20px",
          paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
          display: "flex",
          gap: 10,
          background: "#fff",
        }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "14px 0", border: "1.5px solid #ebebeb", borderRadius: 14, fontSize: 14, fontWeight: 600, color: "#999", background: "#fff", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              flex: 2, padding: "14px 0", border: "none", borderRadius: 14,
              fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "default",
              opacity: canSubmit ? 1 : 0.3,
              backgroundColor: trend.color, color: "#fff",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Add signal
          </button>
        </div>
      </div>
    </div>
  );
}
