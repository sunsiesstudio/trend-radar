"use client";

import { useState } from "react";
import { Signal } from "@/types";
import { TRENDS } from "@/lib/trends";

interface Props {
  onAdd: (signal: Signal) => void;
  onClose: () => void;
  defaultTrendId?: string;
}

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

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "#faf9f6",
    border: "1px solid #e8e4de", borderRadius: 10,
    padding: "11px 14px", fontSize: 14, color: "#1a1a1a",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
  };

  const label = (text: string) => (
    <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{text}</div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto", boxShadow: "0 -8px 60px rgba(0,0,0,0.12)" }}
      >
        <div style={{ height: 4, background: `linear-gradient(90deg, ${trend.color}, ${trend.color}44)` }} />

        <div style={{ padding: "20px 24px 12px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a" }}>Add signal</h2>
          <button onClick={onClose} style={{ fontSize: 24, color: "#ccc", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            {label("Add to trend")}
            <select value={trendId} onChange={(e) => setTrendId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              {TRENDS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              {label("Source type")}
              <select value={source} onChange={(e) => setSource(e.target.value as Signal["source"])} style={{ ...inputStyle, cursor: "pointer" }}>
                {["manual", "reddit", "news", "youtube", "arxiv", "hackernews"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              {label("Source name")}
              <input style={inputStyle} placeholder="e.g. Wired, r/fashion…" value={sourceName} onChange={(e) => setSourceName(e.target.value)} />
            </div>
          </div>

          <div>
            {label("Title")}
            <input style={inputStyle} placeholder="What is this signal?" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>

          <div>
            {label("Summary")}
            <textarea style={{ ...inputStyle, resize: "none" }} rows={4} placeholder="Why does this matter? What does it signal?" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>

          <div>
            {label("Source URL (optional)")}
            <input style={inputStyle} placeholder="https://…" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
          </div>
        </div>

        <div style={{ padding: "0 24px 32px", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px 0", border: "1px solid #e8e4de", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "#aaa", background: "#fff", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim() || !summary.trim()}
            style={{
              flex: 2, padding: "13px 0", border: "none", borderRadius: 14,
              fontSize: 13, fontWeight: 700, cursor: title.trim() && summary.trim() ? "pointer" : "not-allowed",
              opacity: title.trim() && summary.trim() ? 1 : 0.35,
              backgroundColor: trend.color, color: "#fff",
            }}
          >
            Add signal
          </button>
        </div>
      </div>
    </div>
  );
}
