"use client";

import { useState } from "react";
import { Signal } from "@/types";
import { MOCK_SIGNALS, getSignalColor, getStrengthLabel, getStrengthBadgeStyle } from "@/lib/signals";
import { LiveFeed } from "./LiveFeed";

const CATEGORIES = [
  "all", "ai", "vr-ar", "wearables", "biotech", "3d-printing",
  "robotics", "materials", "spatial-computing", "neurotech", "other"
];
const STRENGTHS = ["all", "weak", "emerging", "strong"];

export default function FeedPage() {
  const [tab, setTab] = useState<"curated" | "live">("curated");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [strength, setStrength] = useState("all");

  const filtered = MOCK_SIGNALS.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCat = category === "all" || s.category === category;
    const matchesStrength = strength === "all" || s.strength === strength;
    return matchesQuery && matchesCat && matchesStrength;
  });

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Signal Feed</h1>
        <p className="text-sm text-gray-400">
          {MOCK_SIGNALS.length} curated signals + live sources across emerging tech, culture, and industry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(["curated", "live"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "curated" ? "Curated signals" : "🔴 Live feed"}
          </button>
        ))}
      </div>

      {tab === "live" && <LiveFeed />}
      {tab === "curated" && <>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-8">
        <input
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400"
          placeholder="Search signals, tags, topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {STRENGTHS.map((s) => (
              <button
                key={s}
                onClick={() => setStrength(s)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                  strength === s
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s === "all" ? "All strengths" : s}
              </button>
            ))}
          </div>
          <select
            className="ml-auto bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-600"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-4 font-medium">
        {filtered.length} signal{filtered.length !== 1 ? "s" : ""}
      </div>

      <div className="space-y-3">
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            No signals match your filters.
          </div>
        )}
      </div>
      </>}
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const color = getSignalColor(signal.category);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {signal.category.replace(/-/g, " ")}
            </span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStrengthBadgeStyle(signal.strength)}`}>
              {getStrengthLabel(signal.strength)}
            </span>
          </div>
          <span className="text-xs text-gray-300 shrink-0 mt-0.5">
            {new Date(signal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <h2 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{signal.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{signal.summary}</p>

        {expanded && (
          <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Why it&apos;s emerging
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{signal.why_emerging}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Brand relevance
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{signal.brand_relevance}</p>
            </div>
            {signal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {signal.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-50 text-gray-400 px-2.5 py-0.5 rounded-full border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {signal.sources.length > 0 && (
              <p className="text-xs text-gray-300">
                Sources: {signal.sources.join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
