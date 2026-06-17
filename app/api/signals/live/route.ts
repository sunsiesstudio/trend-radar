import { NextResponse } from "next/server";

// Fetches live signals from free public sources
// Currently: Hacker News (Ask HN / Show HN), Reddit via RSS, and arXiv RSS

async function fetchHackerNews(): Promise<{ title: string; url: string; source: string }[]> {
  const res = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=story&query=AI+fashion+biotech+wearables+3D+printing&hitsPerPage=10&numericFilters=created_at_i>%3D" +
      Math.floor(Date.now() / 1000 - 7 * 24 * 3600),
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits ?? []).map((h: { title: string; url?: string }) => ({
    title: h.title,
    url: h.url ?? `https://news.ycombinator.com/item?id=${(h as { objectID?: string }).objectID}`,
    source: "Hacker News",
  }));
}

async function fetchArxiv(): Promise<{ title: string; url: string; source: string; summary: string }[]> {
  const query = encodeURIComponent(
    "fashion+technology OR biotech+cosmetics OR wearable+sensors OR 3D+printing+textile OR AR+fashion"
  );
  const res = await fetch(
    `https://export.arxiv.org/api/query?search_query=all:${query}&start=0&max_results=8&sortBy=submittedDate&sortOrder=descending`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const text = await res.text();
  const entries = text.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
  return entries.map((e) => {
    const title = (e.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1]?.trim() ?? "Untitled";
    const id = (e.match(/<id>([\s\S]*?)<\/id>/) ?? [])[1]?.trim() ?? "";
    const summary = (e.match(/<summary>([\s\S]*?)<\/summary>/) ?? [])[1]?.trim().slice(0, 200) ?? "";
    return { title, url: id, source: "arXiv", summary: summary + "…" };
  });
}

export async function GET() {
  const [hn, arxiv] = await Promise.allSettled([fetchHackerNews(), fetchArxiv()]);

  return NextResponse.json({
    hacker_news: hn.status === "fulfilled" ? hn.value : [],
    arxiv: arxiv.status === "fulfilled" ? arxiv.value : [],
    fetched_at: new Date().toISOString(),
  });
}
