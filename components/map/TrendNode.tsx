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
  const fontSize = data.radius > 90 ? 13 : data.radius > 70 ? 12 : 11;

  return (
    <div
      onClick={() => data.onClick(data)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: data.color + "18",
        border: `2.5px solid ${data.color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: `0 0 0 6px ${data.color}10`,
        padding: 12,
        textAlign: "center",
        userSelect: "none",
      }}
      className="hover:brightness-105 active:scale-95"
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: "none" }} />

      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: data.color,
          lineHeight: 1.2,
          marginBottom: 4,
        }}
      >
        {data.name}
      </div>
      <div
        style={{
          fontSize: 10,
          color: data.color + "aa",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {data.relevanceScore}% relevance
      </div>
    </div>
  );
});
