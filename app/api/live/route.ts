import { NextRequest, NextResponse } from "next/server";

async function fetchReddit(query: string) {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=hot&limit=5&t=week`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TrendRadar/1.0 (research tool)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.children ?? []).map((c: { data: { title: string; permalink: string; score: number; selftext: string } }) => ({
      title: c.data.title,
      url: `https://reddit.com${c.data.permalink}`,
      source: "reddit",
      summary: c.data.selftext?.slice(0, 200) || c.data.title,
      score: c.data.score,
    }));
  } catch {
    return [];
  }
}

async function fetchHackerNews(query: string) {
  try {
    const weekAgo = Math.floor(Date.now() / 1000 - 7 * 24 * 3600);
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>=${weekAgo}&hitsPerPage=5`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits ?? []).map((h: { title: string; url?: string; objectID: string; points: number }) => ({
      title: h.title,
      url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
      source: "hackernews",
      score: h.points,
    }));
  } catch {
    return [];
  }
}

async function fetchNewsRSS(query: string) {
  // Use GNews free RSS-like search (no key needed for basic)
  try {
    const feeds = [
      `https://feeds.bbci.co.uk/news/technology/rss.xml`,
      `https://www.wired.com/feed/rss`,
    ];
    const results: { title: string; url: string; source: string; date: string }[] = [];
    for (const feed of feeds.slice(0, 1)) {
      const res = await fetch(feed, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const text = await res.text();
      const items = text.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
      const q = query.toLowerCase();
      for (const item of items.slice(0, 20)) {
        const title = (item.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/) ?? item.match(/<title>(.+?)<\/title>/) ?? [])[1] ?? "";
        const link = (item.match(/<link>(.+?)<\/link>/) ?? [])[1] ?? "";
        const pubDate = (item.match(/<pubDate>(.+?)<\/pubDate>/) ?? [])[1] ?? "";
        if (title.toLowerCase().includes(q.split(" ")[0]) || title.toLowerCase().includes(q.split(" ")[1] ?? "")) {
          results.push({ title: title.trim(), url: link.trim(), source: "news", date: pubDate });
        }
      }
    }
    return results.slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchArxiv(query: string) {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://export.arxiv.org/api/query?search_query=all:${encoded}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const text = await res.text();
    const entries = text.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
    return entries.map((e) => {
      const title = (e.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1]?.replace(/\s+/g, " ").trim() ?? "Untitled";
      const id = (e.match(/<id>([\s\S]*?)<\/id>/) ?? [])[1]?.trim() ?? "";
      const summary = (e.match(/<summary>([\s\S]*?)<\/summary>/) ?? [])[1]?.replace(/\s+/g, " ").trim().slice(0, 200) ?? "";
      return { title, url: id, source: "arxiv", summary: summary + "…" };
    });
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const trendId = req.nextUrl.searchParams.get("trendId");
  const query = req.nextUrl.searchParams.get("query") ?? "fashion technology";

  const [reddit, hn, news, arxiv] = await Promise.allSettled([
    fetchReddit(query),
    fetchHackerNews(query),
    fetchNewsRSS(query),
    fetchArxiv(query),
  ]);

  return NextResponse.json({
    trendId,
    query,
    reddit: reddit.status === "fulfilled" ? reddit.value : [],
    hackernews: hn.status === "fulfilled" ? hn.value : [],
    news: news.status === "fulfilled" ? news.value : [],
    arxiv: arxiv.status === "fulfilled" ? arxiv.value : [],
    fetched_at: new Date().toISOString(),
  });
}
