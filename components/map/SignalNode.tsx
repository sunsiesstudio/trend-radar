"use client";

import { memo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Signal } from "@/types";
import { getSourceIcon } from "@/lib/trends";

interface SignalNodeData extends Signal {
  trendColor: string;
  onClick: (signal: Signal) => void;
}

export const SignalNodeMap = memo(function SignalNodeMap({ data, selected }: NodeProps<SignalNodeData>) {
  return (
    <div
      onClick={() => data.onClick(data)}
      style={{
        borderLeft: `3px solid ${data.trendColor}`,
        borderTop: "1px solid #f3f4f6",
        borderRight: "1px solid #f3f4f6",
        borderBottom: "1px solid #f3f4f6",
        borderRadius: 12,
        backgroundColor: "white",
        width: 190,
        cursor: "pointer",
        boxShadow: selected
          ? `0 0 0 2px ${data.trendColor}60, 0 4px 12px rgba(0,0,0,0.08)`
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "all 0.12s ease",
        userSelect: "none",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />

      <div style={{ padding: "8px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
          <span style={{ fontSize: 11 }}>{getSourceIcon(data.source)}</span>
          <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {data.sourceName}
          </span>
          {(data.crossLinks?.length ?? 0) > 0 && (
            <span style={{ marginLeft: "auto", fontSize: 9, color: "#c4b5fd", fontWeight: 600 }}>
              ↔{data.crossLinks?.length}
            </span>
          )}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#111827", lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {data.title}
        </div>
      </div>
    </div>
  );
});
