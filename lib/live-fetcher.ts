import { Signal } from "@/types";

const TREND_KEYWORDS: Record<string, string[]> = {
  "ai-creativity":          ["AI fashion", "generative", "midjourney", "stable diffusion", "gpt fashion", "machine learning design", "creative AI", "DALL-E", "Sora fashion", "AI designer", "AI model campaign", "fashion AI"],
  "digital-identity":       ["avatar fashion", "digital fashion", "virtual wardrobe", "digital clothing", "NFT fashion", "digital self", "Ready Player Me", "DressX", "roblox fashion", "fortnite fashion", "virtual item fashion"],
  "ar-commerce":            ["AR try-on", "augmented reality shopping", "virtual try-on", "Vision Pro shopping", "spatial commerce", "AR fitting", "virtual fitting room", "AR beauty", "mixed reality retail"],
  "biotech-beauty":         ["microbiome skincare", "probiotic skincare", "fermented beauty", "exosome serum", "lab-grown collagen", "bioprinted skin", "peptide skincare", "biotech beauty", "skin microbiome", "postbiotic"],
  "sustainable-materials":  ["mycelium leather", "sustainable fashion material", "algae fabric", "bio-based material", "recycled fashion", "circular fashion", "digital product passport", "piñatex", "econyl", "carbon fabric"],
  "3d-printing":            ["3D printing fashion", "3D printed shoe", "additive manufacturing fashion", "Zellerfeld", "printed garment", "3D wearable"],
  "wearables":              ["smart ring", "Oura ring", "health wearable", "Whoop band", "fitness wearable", "smart fabric health", "glucose monitor fashion", "wearable health tech", "CGM wearable"],
  "neurotech":              ["neurotech beauty", "brain-computer interface consumer", "EEG wellness", "adaptogen skincare", "nootropic skin", "neurocosmetic", "stress skincare", "Neuralink consumer"],
  "spatial-computing":      ["Vision Pro fashion", "visionOS brand", "spatial computing retail", "Apple Vision fashion", "Galaxy XR fashion", "spatial commerce", "Decentraland fashion", "immersive retail"],
  "longevity":              ["longevity supplement", "anti-aging biohack", "NAD+ longevity", "rapamycin lifestyle", "biological age test", "Bryan Johnson protocol", "longevity clinic", "VO2 max trend", "centenarian lifestyle"],
};

function scoreTrend(text: string): string | null {
  const lower = text.toLowerCase();
  let best = { id: "", score: 0 };
  for (const [trendId, keywords] of Object.entries(TREND_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score++;
    }
    if (score > best.score) best = { id: trendId, score };
  }
  return best.score >= 1 ? best.id : null;
}

function makeId(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return `live-${h.toString(36)}`;
}

async function fetchReddit(queries: string[]): Promise<Signal[]> {
  const signals: Signal[] = [];
  for (const query of queries) {
    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=hot&limit=10&t=week`;
      const res = await fetch(url, {
        headers: { "User-Agent": "TrendRadar/1.0 research-tool" },
        next: { revalidate: 7200 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const posts: Array<{ data: { title: string; permalink: string; subreddit: string; selftext: string; created_utc: number; score: number } }> = data?.data?.children ?? [];
      for (const { data: p } of posts) {
        if (!p.title || !p.permalink) continue;
        const trendId = scoreTrend(`${p.title} ${p.selftext ?? ""}`);
        if (!trendId) continue;
        const id = makeId(`https://reddit.com${p.permalink}`);
        if (signals.find((s) => s.id === id)) continue;
        signals.push({
          id,
          trendId,
          title: p.title.trim().slice(0, 120),
          summary: p.selftext?.trim().slice(0, 300) || p.title,
          source: "reddit",
          sourceName: `r/${p.subreddit}`,
          sourceUrl: `https://reddit.com${p.permalink}`,
          date: new Date(p.created_utc * 1000).toISOString().split("T")[0],
          isLive: true,
        });
      }
    } catch { /* skip on error */ }
  }
  return signals;
}

async function fetchRSS(feeds: { url: string; name: string }[]): Promise<Signal[]> {
  const signals: Signal[] = [];
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 7200 } });
      if (!res.ok) continue;
      const text = await res.text();
      const items = text.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
      for (const item of items.slice(0, 20)) {
        const title = (
          item.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/) ??
          item.match(/<title>([^<]+)<\/title>/)
        )?.[1]?.trim() ?? "";
        const link = item.match(/<link>([^<\s]+)<\/link>/)?.[1]?.trim() ?? "";
        const desc = (
          item.match(/<description><!\[CDATA\[([\s\S]+?)\]\]><\/description>/) ??
          item.match(/<description>([\s\S]+?)<\/description>/)
        )?.[1]?.replace(/<[^>]+>/g, "").trim().slice(0, 300) ?? "";
        const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? "";
        if (!title || !link) continue;
        const trendId = scoreTrend(`${title} ${desc}`);
        if (!trendId) continue;
        const id = makeId(link);
        if (signals.find((s) => s.id === id)) continue;
        signals.push({
          id,
          trendId,
          title: title.slice(0, 120),
          summary: desc || title,
          source: "news",
          sourceName: feed.name,
          sourceUrl: link,
          date: pubDate ? (() => { try { return new Date(pubDate).toISOString().split("T")[0]; } catch { return undefined; } })() : undefined,
          isLive: true,
        });
      }
    } catch { /* skip on error */ }
  }
  return signals;
}

export async function fetchLiveSignals(): Promise<Signal[]> {
  const [redditResult, rssResult] = await Promise.allSettled([
    fetchReddit([
      "AI fashion design generative creative campaign",
      "longevity anti-aging biohacking NAD supplement protocol",
      "skincare microbiome biotech beauty ingredient science",
      "sustainable fashion materials mycelium algae recycled circular",
      "smart wearables health ring Oura Whoop fitness tracker",
      "avatar digital fashion NFT virtual wardrobe metaverse",
      "AR try-on augmented reality shopping Vision Pro spatial",
      "3D printing fashion footwear shoe manufacturing",
      "neurotech nootropics brain wellness adaptogen stress skincare",
    ]),
    fetchRSS([
      { url: "https://www.wired.com/feed/rss", name: "Wired" },
      { url: "https://techcrunch.com/rss", name: "TechCrunch" },
      { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Tech" },
    ]),
  ]);

  const all: Signal[] = [
    ...(redditResult.status === "fulfilled" ? redditResult.value : []),
    ...(rssResult.status === "fulfilled" ? rssResult.value : []),
  ];

  const seen = new Set<string>();
  return all.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
