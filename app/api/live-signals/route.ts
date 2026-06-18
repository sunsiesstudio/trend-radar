import { NextResponse } from "next/server";

// Trend keyword map for assigning fetched items to trend nodes
const TREND_KEYWORDS: Record<string, string[]> = {
  "ai-creativity":         ["generative AI", "Midjourney", "fashion AI", "AI design", "Sora", "AI model", "AI campaign", "AI creative"],
  "digital-identity":      ["avatar", "digital fashion", "virtual outfit", "NFT fashion", "Roblox fashion", "metaverse fashion", "digital identity"],
  "ar-commerce":           ["AR try-on", "augmented reality shop", "virtual fitting", "AR fashion", "virtual try"],
  "biotech-beauty":        ["microbiome skincare", "biotech beauty", "bioprinted skin", "fermentation skincare", "exosome serum", "postbiotic"],
  "sustainable-materials": ["mycelium leather", "sustainable material", "bio-material", "algae fibre", "carbon fashion", "circular fashion"],
  "3d-printing":           ["3D printing fashion", "3D printed shoe", "Zellerfeld", "printed garment", "additive manufacturing fashion"],
  "wearables":             ["Oura ring", "smart ring", "health wearable", "smart fabric", "femtech wearable", "wearable health"],
  "neurotech":             ["neurocosmetic", "nootropic skincare", "brain computer", "Neuralink consumer", "adaptogen serum"],
  "spatial-computing":     ["Vision Pro fashion", "spatial commerce", "visionOS brand", "mixed reality shop", "XR fashion"],
  "longevity":             ["longevity brand", "anti-ageing tech", "NAD+", "biological age", "rapamycin", "epigenetic", "longevity supplement"],
};

function assignTrendId(title: string, summary: string): string | null {
  const text = (title + " " + summary).toLowerCase();
  for (const [trendId, keywords] of Object.entries(TREND_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) return trendId;
  }
  return null;
}

async function fetchHN(): Promise<{ title: string; url: string; summary: string; date: string }[]> {
  const query = "AI fashion beauty wearables biotech longevity spatial computing 3D printing";
  const weekAgo = Math.floor(Date.now() / 1000 - 7 * 24 * 3600);
  const res = await fetch(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>=${weekAgo}&hitsPerPage=25`,
    { next: { revalidate: 1800 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits ?? []).map((h: { title: string; url?: string; objectID: string; created_at: string; story_text?: string }) => ({
    title: h.title,
    url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
    summary: h.story_text?.slice(0, 200) ?? h.title,
    date: h.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  }));
}

async function fetchReddit(): Promise<{ title: string; url: string; summary: string; date: string; subreddit: string }[]> {
  const subreddits = ["SkincareAddiction", "fashiondesign", "wearables", "longevity", "biohacking", "MachineLearning", "SustainableFashion"];
  const results: { title: string; url: string; summary: string; date: string; subreddit: string }[] = [];
  for (const sub of subreddits.slice(0, 4)) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=8`, {
        headers: { "User-Agent": "AugmentedRadar/1.0 (research aggregator)" },
        next: { revalidate: 1800 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const child of (data?.data?.children ?? [])) {
        const p = child.data;
        results.push({
          title: p.title,
          url: `https://reddit.com${p.permalink}`,
          summary: p.selftext?.slice(0, 200) ?? p.title,
          date: new Date(p.created_utc * 1000).toISOString().slice(0, 10),
          subreddit: sub,
        });
      }
    } catch { /* skip failed subreddits */ }
  }
  return results;
}

export async function GET() {
  const [hnResult, redditResult] = await Promise.allSettled([fetchHN(), fetchReddit()]);
  const hnItems  = hnResult.status  === "fulfilled" ? hnResult.value  : [];
  const redItems = redditResult.status === "fulfilled" ? redditResult.value : [];

  const date = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const signals: {
    id: string; trendId: string; title: string; summary: string;
    source: string; sourceName: string; date: string; isLive: boolean; crossLinks: string[];
  }[] = [];

  for (const item of hnItems) {
    const trendId = assignTrendId(item.title, item.summary);
    if (!trendId) continue;
    const id = `live-hn-${Buffer.from(item.title).toString("base64").slice(0, 16)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    signals.push({ id, trendId, title: item.title, summary: item.summary || item.title, source: "hackernews", sourceName: "Hacker News", date: item.date || date, isLive: true, crossLinks: [] });
  }

  for (const item of redItems) {
    const trendId = assignTrendId(item.title, item.summary);
    if (!trendId) continue;
    const id = `live-r-${Buffer.from(item.title).toString("base64").slice(0, 16)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    signals.push({ id, trendId, title: item.title, summary: item.summary || item.title, source: "reddit", sourceName: `r/${item.subreddit}`, date: item.date || date, isLive: true, crossLinks: [] });
  }

  return NextResponse.json({ signals, fetched_at: new Date().toISOString() });
}
