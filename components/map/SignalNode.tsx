"use client";

import { memo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Signal } from "@/types";
import { getSourceIcon } from "@/lib/trends";

interface SignalNodeData extends Signal {
  trendColor: string;
  onClick: (signal: Signal) => void;
}

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  news: "News",
  youtube: "YouTube",
  arxiv: "arXiv",
  hackernews: "HN",
  manual: "Manual",
};

export const SignalNodeMap = memo(function SignalNodeMap({ data, selected }: NodeProps<SignalNodeData>) {
  return (
    <div
      onClick={() => data.onClick(data)}
      style={{
        width: 188,
        backgroundColor: "#141414",
        borderRadius: 10,
        border: `1px solid ${selected ? data.trendColor : "#2a2a2a"}`,
        borderLeft: `3px solid ${data.trendColor}`,
        cursor: "pointer",
        userSelect: "none",
        boxShadow: selected
          ? `0 0 0 1px ${data.trendColor}40, 0 8px 24px rgba(0,0,0,0.5)`
          : "0 2px 8px rgba(0,0,0,0.4)",
        transition: "all 0.12s ease",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />

      <div style={{ padding: "9px 11px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
          <span style={{ fontSize: 10 }}>{getSourceIcon(data.source)}</span>
          <span style={{
            fontSize: 8.5,
            color: data.trendColor,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {SOURCE_LABELS[data.source ?? "manual"] ?? data.sourceName}
          </span>
          {(data.crossLinks?.length ?? 0) > 0 && (
            <span style={{
              marginLeft: "auto",
              fontSize: 8,
              color: "#555",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ↔ {data.crossLinks?.length}
            </span>
          )}
        </div>
        <div style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#e8e4df",
          lineHeight: 1.4,
          fontFamily: "'DM Sans', sans-serif",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {data.title}
        </div>
      </div>
    </div>
  );
});
