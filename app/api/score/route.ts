import { NextRequest, NextResponse } from "next/server";
import { TRENDS } from "@/lib/trends";

// Fetch Reddit post count for a query to estimate cultural momentum
async function getRedditMentions(query: string): Promise<number> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=25&t=month`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TrendRadar/1.0" },
      next: { revalidate: 7200 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const posts = data?.data?.children ?? [];
    // Sum of upvotes as proxy for engagement
    return posts.reduce((sum: number, p: { data: { score: number } }) => sum + (p.data.score ?? 0), 0);
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const trendId = req.nextUrl.searchParams.get("trendId");
  const trend = TRENDS.find((t) => t.id === trendId);
  if (!trend) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const mentions = await getRedditMentions(trend.redditQuery);
  // Normalise: cap at 50k upvotes → 100 score. Blend 70% static + 30% live.
  const liveScore = Math.min(100, Math.round((mentions / 50000) * 100));
  const blendedScore = Math.round(trend.relevanceScore * 0.7 + liveScore * 0.3);

  return NextResponse.json({
    trendId,
    staticScore: trend.relevanceScore,
    liveScore,
    blendedScore,
    redditMentions: mentions,
  });
}
