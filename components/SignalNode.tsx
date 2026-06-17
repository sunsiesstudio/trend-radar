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
  const hasImage = Boolean(data.image);

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
        overflow: "hidden",
      }}
    >
      {/* Masking tape — overlaps the top edge */}
      <div
        style={{
          position: "absolute",
          top: -11,
          left: "50%",
          transform: "translateX(-50%) rotate(-1.5deg)",
          width: 52,
          height: 22,
          background: "rgba(255, 248, 155, 0.60)",
          border: "0.5px solid rgba(200, 185, 95, 0.35)",
          borderRadius: 1,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />

      {/* Image */}
      {hasImage && (
        <div style={{ height: 128, overflow: "hidden", flexShrink: 0 }}>
          <img
            src={data.image}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              userSelect: "none",
            }}
          />
        </div>
      )}

      {/* Category color strip */}
      <div style={{ height: 3, background: color, flexShrink: 0 }} />

      <div style={{ padding: "11px 13px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.11em",
              color,
            }}
          >
            {(data.category ?? "other").replace(/-/g, " ")}
          </div>
          {data.updated_at && (
            <span style={{ fontSize: 8, color: "#b0b0b0", fontWeight: 500, letterSpacing: "0.03em" }}>
              {new Date(data.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
            </span>
          )}
        </div>

        <h3
          style={{
            margin: 0,
            marginBottom: 7,
            fontSize: 13,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.3,
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
            WebkitLineClamp: hasImage ? 2 : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data.summary}
        </p>

        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
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
