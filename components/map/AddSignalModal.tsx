"use client";

import { useState } from "react";
import { Signal } from "@/types";
import { TRENDS } from "@/lib/trends";

interface Props {
  onAdd: (signal: Signal) => void;
  onClose: () => void;
  defaultTrendId?: string;
}

const label = (text: string) => (
  <div style={{ fontSize: 9, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
    {text}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13,
  color: "#e8e4df",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};

export function AddSignalModal({ onAdd, onClose, defaultTrendId }: Props) {
  const [trendId, setTrendId] = useState(defaultTrendId ?? TRENDS[0].id);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [source, setSource] = useState<Signal["source"]>("manual");

  const trend = TRENDS.find((t) => t.id === trendId)!;

  const submit = () => {
    if (!title.trim() || !summary.trim()) return;
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

  return (
    <div
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#0e0e0e",
          border: "1px solid #222",
          borderTop: `3px solid ${trend.color}`,
          borderRadius: 18,
          width: "100%",
          maxWidth: 500,
          boxShadow: `0 0 80px ${trend.color}20, 0 40px 80px rgba(0,0,0,0.8)`,
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "#f0ede8", margin: 0 }}>Add signal</h2>
          <button onClick={onClose} style={{ color: "#333", fontSize: 22, background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            {label("Trend")}
            <select value={trendId} onChange={(e) => setTrendId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {TRENDS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              {label("Source type")}
              <select value={source} onChange={(e) => setSource(e.target.value as Signal["source"])} style={{ ...inputStyle, cursor: "pointer" }}>
                {["manual", "reddit", "news", "youtube", "arxiv", "hackernews"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              {label("Source name")}
              <input style={inputStyle} placeholder="e.g. r/fashion, Wired…" value={sourceName} onChange={(e) => setSourceName(e.target.value)} />
            </div>
          </div>

          <div>
            {label("Signal title")}
            <input style={inputStyle} placeholder="What is this signal about?" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>

          <div>
            {label("Summary")}
            <textarea
              style={{ ...inputStyle, resize: "none" }}
              rows={3}
              placeholder="What does this signal tell us? Why does it matter?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            {label("Source URL (optional)")}
            <input style={inputStyle} placeholder="https://…" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", border: "1px solid #2a2a2a", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#555", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim() || !summary.trim()}
            style={{
              flex: 1, padding: "12px 0", border: "none", borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: "#000",
              backgroundColor: trend.color,
              cursor: title.trim() && summary.trim() ? "pointer" : "not-allowed",
              opacity: title.trim() && summary.trim() ? 1 : 0.3,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 0 20px ${trend.color}44`,
            }}
          >
            Add to canvas
          </button>
        </div>
      </div>
    </div>
  );
}
