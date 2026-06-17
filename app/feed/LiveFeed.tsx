"use client";

import { useEffect, useState } from "react";

interface LiveItem {
  title: string;
  url: string;
  source: string;
  summary?: string;
}

interface LiveData {
  hacker_news: LiveItem[];
  arxiv: LiveItem[];
  fetched_at: string;
}

export function LiveFeed() {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/signals/live")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-16 text-center text-sm text-gray-400">Fetching live signals…</div>
  );
  if (error) return (
    <div className="py-16 text-center text-sm text-gray-400">Could not load live signals.</div>
  );

  const all = [...(data?.hacker_news ?? []), ...(data?.arxiv ?? [])];

  return (
    <div className="space-y-3">
      {data?.fetched_at && (
        <p className="text-xs text-gray-300 mb-4">
          Updated {new Date(data.fetched_at).toLocaleTimeString()}
        </p>
      )}
      {all.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all p-5"
        >
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {item.source}
            </span>
            <span className="text-gray-300 text-xs">↗</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">{item.title}</h3>
          {item.summary && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
          )}
        </a>
      ))}
      {all.length === 0 && (
        <div className="text-center py-10 text-sm text-gray-400">No live signals found.</div>
      )}
    </div>
  );
}
