import { Signal } from "@/types";

const TOPIC_QUERIES: Record<string, string[]> = {
  fashion:         ["fashion technology 2025", "fashion innovation trend", "sustainable fashion brand"],
  beauty:          ["beauty tech trend 2025", "skincare innovation brand", "beauty industry news"],
  gaming:          ["gaming trend 2025", "video game industry news", "esports gaming culture"],
  wellness:        ["wellness trend 2025", "health wellness innovation", "mental wellbeing brand"],
  "food-tech":     ["food technology innovation", "food tech startup trend", "alternative protein news"],
  "mental-health": ["mental health awareness brand", "mental health tech 2025", "therapy wellness platform"],
  music:           ["music technology trend", "music industry innovation", "artist tech platform"],
  travel:          ["travel trend 2025", "hospitality innovation tech", "travel experience brand"],
  luxury:          ["luxury brand innovation 2025", "premium market trend", "luxury consumer insight"],
  sustainability:  ["sustainability brand innovation", "circular economy trend", "green tech consumer"],
  skincare:        ["skincare ingredient trend 2025", "dermatology innovation brand", "skin health tech"],
  art:             ["art technology trend", "creative industry AI", "digital art platform"],
  fitness:         ["fitness tech trend 2025", "sport performance innovation", "health fitness brand"],
  "interior-design":["interior design trend 2025", "home decor innovation", "living space tech"],
  photography:     ["photography technology trend", "camera innovation 2025", "visual media brand"],
  film:            ["film industry technology", "cinema streaming trend", "content creation innovation"],
  branding:        ["brand strategy trend 2025", "marketing innovation", "brand identity design"],
  fragrance:       ["fragrance trend 2025", "perfume industry innovation", "scent technology brand"],
  jewellery:       ["jewellery trend 2025", "accessories innovation brand", "fine jewellery design"],
  retail:          ["retail technology trend", "commerce innovation 2025", "store experience brand"],
  social:          ["social media trend 2025", "creator economy innovation", "platform behaviour brand"],
  education:       ["education technology trend", "edtech innovation 2025", "learning platform brand"],
  creativity:      ["creative technology trend", "design innovation AI", "creative industry brand"],
  food:            ["food trend 2025", "culinary innovation brand", "food culture consumer"],
  dating:          ["dating app trend 2025", "relationship technology", "social connection platform"],
  nightlife:       ["nightlife trend 2025", "entertainment venue innovation", "clubbing experience brand"],
  coffee:          ["coffee trend 2025", "specialty coffee innovation", "coffee brand consumer"],
  sport:           ["sport technology trend", "athletic innovation brand", "performance sport tech"],
  pets:            ["pet industry trend 2025", "pet tech innovation brand", "pet care consumer"],
  parenting:       ["parenting technology trend", "family innovation brand", "child development tech"],
  kids:            ["children technology trend", "kids brand innovation", "educational toy tech"],
  health:          ["health technology trend 2025", "medical innovation consumer", "preventive health brand"],
  lifestyle:       ["lifestyle trend 2025", "consumer behaviour innovation", "culture lifestyle brand"],
};

function makeId(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return `live-${h.toString(36)}`;
}

function matchTrend(text: string, trends: Array<{ id: string; name: string; description: string }>): string | null {
  if (!trends.length) return null;
  const lower = text.toLowerCase();
  let best = { id: "", score: 0 };
  for (const t of trends) {
    const words = `${t.name} ${t.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const score = words.filter(w => lower.includes(w)).length;
    if (score > best.score) best = { id: t.id, score };
  }
  return best.score >= 1 ? best.id : null;
}

async function fetchReddit(queries: string[], trends: Array<{ id: string; name: string; description: string }>): Promise<Signal[]> {
  const signals: Signal[] = [];
  const seen = new Set<string>();
  for (const query of queries) {
    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=hot&limit=8&t=month`;
      const res = await fetch(url, {
        headers: { "User-Agent": "TrendRadar/1.0 research-tool" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const posts: Array<{ data: { title: string; permalink: string; subreddit: string; selftext: string; created_utc: number } }> = data?.data?.children ?? [];
      for (const { data: p } of posts) {
        if (!p.title || !p.permalink) continue;
        const id = makeId(`https://reddit.com${p.permalink}`);
        if (seen.has(id)) continue;
        seen.add(id);
        const trendId = matchTrend(`${p.title} ${p.selftext ?? ""}`, trends);
        if (!trendId) continue;
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
    } catch { /* skip */ }
  }
  return signals;
}

async function fetchRSS(feeds: { url: string; name: string }[], trends: Array<{ id: string; name: string; description: string }>): Promise<Signal[]> {
  const signals: Signal[] = [];
  const seen = new Set<string>();
  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const text = await res.text();
      const items = text.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
      for (const item of items.slice(0, 15)) {
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
        const id = makeId(link);
        if (seen.has(id)) continue;
        seen.add(id);
        const trendId = matchTrend(`${title} ${desc}`, trends);
        if (!trendId) continue;
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
    } catch { /* skip */ }
  }
  return signals;
}

const TOPIC_FEEDS: Record<string, { url: string; name: string }[]> = {
  fashion:    [{ url: "https://www.businessoffashion.com/feed", name: "Business of Fashion" }, { url: "https://www.vogue.com/feed/rss", name: "Vogue" }],
  beauty:     [{ url: "https://www.allure.com/feed/rss", name: "Allure" }, { url: "https://www.glamour.com/feed/rss", name: "Glamour" }],
  gaming:     [{ url: "https://www.polygon.com/rss/index.xml", name: "Polygon" }, { url: "https://kotaku.com/rss", name: "Kotaku" }],
  wellness:   [{ url: "https://www.mindbodygreen.com/rss", name: "MindBodyGreen" }],
  music:      [{ url: "https://pitchfork.com/rss/news/", name: "Pitchfork" }],
  luxury:     [{ url: "https://www.wallpaper.com/rss", name: "Wallpaper*" }],
  design:     [{ url: "https://www.dezeen.com/feed/", name: "Dezeen" }],
  tech:       [{ url: "https://www.theverge.com/rss/index.xml", name: "The Verge" }, { url: "https://techcrunch.com/rss", name: "TechCrunch" }],
};

const DEFAULT_FEEDS = [
  { url: "https://www.wired.com/feed/rss", name: "Wired" },
  { url: "https://techcrunch.com/rss", name: "TechCrunch" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Tech" },
];

export async function fetchLiveSignals(
  topics: string[] = [],
  trends: Array<{ id: string; name: string; description: string }> = []
): Promise<Signal[]> {
  const queries = topics.length > 0
    ? topics.flatMap(t => TOPIC_QUERIES[t] ?? [`${t} trend 2025`, `${t} innovation brand`])
    : ["emerging tech fashion", "AI design innovation", "biotech beauty brand"];

  const feeds = topics.length > 0
    ? [...new Map(
        topics.flatMap(t => (TOPIC_FEEDS[t] ?? []).map(f => [f.url, f] as [string, typeof f]))
      ).values()]
    : DEFAULT_FEEDS;

  const [redditResult, rssResult] = await Promise.allSettled([
    fetchReddit(queries.slice(0, 6), trends),
    fetchRSS(feeds.slice(0, 5), trends),
  ]);

  const all: Signal[] = [
    ...(redditResult.status === "fulfilled" ? redditResult.value : []),
    ...(rssResult.status === "fulfilled" ? rssResult.value : []),
  ];

  const seen = new Set<string>();
  return all.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
}
