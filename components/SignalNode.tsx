"use client";

import { useMemo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Signal } from "@/types";
import { getSignalColor, getStrengthLabel } from "@/lib/signals";

interface SignalNodeData extends Signal {
  onEdit: (signal: Signal) => void;
}

function nodeRotation(id: string): number {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((n % 9) - 4) * 0.55;
}

export function SignalNode({ data, selected }: NodeProps<SignalNodeData>) {
  const color = getSignalColor(data.category);
  const rotation = useMemo(() => nodeRotation(data.id), [data.id]);

  return (
    <div
      onClick={() => data.onEdit(data)}
      style={{
        width: 216,
        background: "#ffffff",
        borderRadius: 2,
        cursor: "pointer",
        transform: `rotate(${rotation}deg)`,
        boxShadow: selected
          ? `2px 5px 22px rgba(0,0,0,0.24), 0 0 0 2px ${color}`
          : "2px 4px 14px rgba(0,0,0,0.14), 1px 1px 3px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.15s ease",
        position: "relative",
      }}
    >
      {/* Masking tape */}
      <div
        style={{
          position: "absolute",
          top: -12,
          left: "50%",
          transform: "translateX(-50%) rotate(-1.5deg)",
          width: 52,
          height: 22,
          background: "rgba(255, 248, 155, 0.58)",
          border: "0.5px solid rgba(200, 185, 95, 0.35)",
          borderRadius: 1,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Category color bar */}
      <div style={{ height: 3, background: color, borderRadius: "2px 2px 0 0" }} />

      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />

      <div style={{ padding: "12px 13px 13px" }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.11em",
            color,
            marginBottom: 7,
          }}
        >
          {(data.category ?? "other").replace(/-/g, " ")}
        </div>

        <h3
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 13,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.32,
          }}
        >
          {data.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: 10.5,
            color: "#5a5a5a",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data.summary}
        </p>

        <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 9, color: "#9a9a9a", fontWeight: 600 }}>
            {getStrengthLabel(data.strength)}
          </span>
          {data.manual && (
            <span style={{ marginLeft: "auto", fontSize: 9, color: "#c27a20", fontWeight: 500 }}>
              manual
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  );
}
