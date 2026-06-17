"use client";

import { memo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Trend } from "@/types";

interface TrendNodeData extends Trend {
  radius: number;
  onClick: (trend: Trend & { radius: number }) => void;
}

export const TrendNode = memo(function TrendNode({ data }: NodeProps<TrendNodeData>) {
  const size = data.radius * 2;
  // Break long title into two lines at the midpoint for display
  const words = data.name.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  const fontSize = data.radius > 95 ? 13 : data.radius > 75 ? 12 : 10.5;

  return (
    <div
      onClick={() => data.onClick(data)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: data.color,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 16,
        textAlign: "center",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 40px ${data.color}55, 0 0 80px ${data.color}22`,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      className="hover:scale-105 active:scale-95"
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
      }} />

      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize,
        fontWeight: 400,
        color: "#000",
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        position: "relative",
        zIndex: 1,
      }}>
        <div>{line1}</div>
        <div style={{ fontStyle: "italic" }}>{line2}</div>
      </div>

      <div style={{
        marginTop: 8,
        fontSize: 9,
        fontWeight: 700,
        color: "rgba(0,0,0,0.55)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        position: "relative",
        zIndex: 1,
      }}>
        {data.relevanceScore}%
      </div>
    </div>
  );
});
