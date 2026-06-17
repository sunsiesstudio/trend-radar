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
    const sig: Signal = {
      id: crypto.randomUUID(),
      trendId,
      title: title.trim(),
      summary: summary.trim(),
      source,
      sourceName: sourceName.trim() || "Manual",
      sourceUrl: sourceUrl.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
      crossLinks: [],
    };
    onAdd(sig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100" style={{ borderTop: `4px solid ${trend.color}` }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Add signal</h2>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-xl">×</button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Trend</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={trendId}
              onChange={(e) => setTrendId(e.target.value)}
            >
              {TRENDS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Source type</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={source}
                onChange={(e) => setSource(e.target.value as Signal["source"])}
              >
                {["manual", "reddit", "news", "youtube", "arxiv", "hackernews"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Source name</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
                placeholder="e.g. r/fashion, TechCrunch"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Signal title</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
              placeholder="What is this signal about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Summary</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-300"
              placeholder="What does this signal tell us? Why does it matter?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Source URL (optional)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
              placeholder="https://…"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!title.trim() || !summary.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-colors"
            style={{ backgroundColor: trend.color }}
          >
            Add to canvas
          </button>
        </div>
      </div>
    </div>
  );
}
