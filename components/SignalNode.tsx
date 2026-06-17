"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Signal } from "@/types";
import { getSignalColor, getStrengthLabel } from "@/lib/signals";

interface SignalNodeData extends Signal {
  onEdit: (signal: Signal) => void;
}

export function SignalNode({ data, selected }: NodeProps<SignalNodeData>) {
  const color = getSignalColor(data.category);

  return (
    <div
      className={`relative w-72 rounded-2xl border-2 bg-white shadow-lg transition-all cursor-pointer ${
        selected ? "shadow-2xl scale-105" : "hover:shadow-xl"
      }`}
      style={{ borderColor: color }}
      onClick={() => data.onEdit(data)}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-300" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {(data.category ?? "other").replace("-", " ")}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium border`}
            style={{ color, borderColor: color }}
          >
            {getStrengthLabel(data.strength)}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">
          {data.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
          {data.summary}
        </p>

        {data.manual && (
          <span className="mt-2 inline-block text-xs text-amber-600 font-medium">
            ✦ Manual signal
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-300" />
    </div>
  );
}
