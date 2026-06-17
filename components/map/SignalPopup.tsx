"use client";

import { Signal } from "@/types";
import { getSourceIcon } from "@/lib/trends";

interface Props {
  signal: Signal;
  trendColor: string;
  trendName: string;
  onClose: () => void;
}

export function SignalPopup({ signal, trendColor, trendName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ borderTop: `4px solid ${trendColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">{getSourceIcon(signal.source)}</span>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: trendColor }}
              >
                {trendName}
              </span>
              <span className="text-xs text-gray-400">{signal.sourceName}</span>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-lg leading-none">×</button>
          </div>

          <h3 className="font-bold text-gray-900 text-base leading-snug mb-3">{signal.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{signal.summary}</p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {signal.date ? new Date(signal.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
            </span>
            {signal.sourceUrl && (
              <a
                href={signal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View source →
              </a>
            )}
          </div>

          {(signal.crossLinks ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">
                Connects to {(signal.crossLinks ?? []).length} signal{(signal.crossLinks ?? []).length > 1 ? "s" : ""} across other trends
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
