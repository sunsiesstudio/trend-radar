"use client";

import { useState } from "react";
import { Signal } from "@/types";
import { MOCK_SIGNALS, getSignalColor, getStrengthLabel } from "@/lib/signals";
import { Search, Filter } from "lucide-react";

const CATEGORIES = ["all", "ai", "vr-ar", "wearables", "biotech", "3d-printing", "robotics", "materials", "spatial-computing", "neurotech", "other"];

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = MOCK_SIGNALS.filter((s) => {
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.summary.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchesCat = category === "all" || s.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Signal Feed</h1>
        <p className="text-sm text-gray-500 mb-8">
          Emerging signals across technology, culture, and industry — updated continuously.
        </p>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border bg-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search signals…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="border bg-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All categories" : c.replace("-", " ")}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Signal cards */}
        <div className="space-y-4">
          {filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">No signals match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const color = getSignalColor(signal.category);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {signal.category.replace("-", " ")}
            </span>
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
              style={{ color, borderColor: color }}
            >
              {getStrengthLabel(signal.strength)}
            </span>
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {new Date(signal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <h2 className="font-bold text-gray-900 mb-2">{signal.title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{signal.summary}</p>

        {expanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Why it&apos;s emerging</span>
              <p className="text-sm text-gray-700 mt-1">{signal.why_emerging}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Brand relevance</span>
              <p className="text-sm text-gray-700 mt-1">{signal.brand_relevance}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {signal.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            {signal.sources.length > 0 && (
              <p className="text-xs text-gray-400">Sources: {signal.sources.join(", ")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
