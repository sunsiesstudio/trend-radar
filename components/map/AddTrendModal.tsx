"use client";

import { useState } from "react";
import { Trend } from "@/types";

const TOPIC_OPTIONS = [
  "fashion", "beauty", "gaming", "health", "fitness", "wellness",
  "technology", "ai", "sustainability", "food", "music", "art",
  "social", "luxury", "travel", "finance", "education", "biotech",
  "mental-health", "sport", "smart-home", "web3", "ar-vr",
];

interface Props {
  onAdd: (trend: Trend) => void;
  onClose: () => void;
  editTrend?: Trend;
  onSave?: (trend: Trend) => void;
}

export function AddTrendModal({ onAdd, onClose, editTrend, onSave }: Props) {
  const [name,        setName]        = useState(editTrend?.name ?? "");
  const [description, setDescription] = useState(editTrend?.description ?? "");
  const [topic,       setTopic]       = useState(editTrend?.topics?.[0] ?? TOPIC_OPTIONS[0]);
  const isEditMode = !!editTrend;

  const canSubmit = name.trim().length > 0 && description.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    if (isEditMode && onSave && editTrend) {
      onSave({ ...editTrend, name: name.trim(), description: description.trim(), topics: [topic] });
    } else {
      onAdd({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        color: "#888",
        relevanceScore: 50,
        redditQuery: name.trim(),
        newsQuery: name.trim(),
        position: { x: 0, y: 0 },
        whyRelevant: description.trim(),
        trajectory: "Emerging",
        nextSteps: [],
        topics: [topic],
      });
    }
    onClose();
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.12em", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
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
    boxSizing: "border-box" as const,
    minHeight: 48,
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "0 16px" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90svh",
          boxShadow: "0 8px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #f0f0f0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000", letterSpacing: "-0.02em", fontFamily: "var(--font-serif), serif", margin: 0 }}>
            {isEditMode ? "Edit trend" : "Add trend"}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 18, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", touchAction: "pan-y", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 } as React.CSSProperties}>

          {field("Trend name *",
            <input
              style={inputBase}
              placeholder="e.g. Quiet Luxury"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoCapitalize="words"
            />
          )}

          {field("Description *",
            <textarea
              style={{ ...inputBase, resize: "none", lineHeight: 1.55 }}
              rows={4}
              placeholder="What is happening? Why does it matter?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoCapitalize="sentences"
            />
          )}

          {field("Domain",
            <div style={{ position: "relative" }}>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ ...inputBase, cursor: "pointer", paddingRight: 40 }}
              >
                {TOPIC_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/-/g, " ")}</option>)}
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none", lineHeight: 1 }}>⌄</span>
            </div>
          )}

          <div style={{ height: 8 }} />
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px",
          paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
          display: "flex",
          gap: 10,
          background: "#fff",
          borderRadius: "0 0 20px 20px",
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
              backgroundColor: "#000", color: "#fff",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {isEditMode ? "Save changes" : "Add trend"}
          </button>
        </div>
      </div>
    </div>
  );
}
