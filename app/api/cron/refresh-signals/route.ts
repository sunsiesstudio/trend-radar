import { NextResponse } from "next/server";
import { fetchLiveSignals } from "@/lib/live-fetcher";
import { EXTENDED_TRENDS } from "@/lib/extended-trends";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const homeTrends = EXTENDED_TRENDS.slice(-4).reverse();
  const topics = [...new Set(homeTrends.flatMap(t => t.topics ?? []))];
  const trendData = homeTrends.map(t => ({ id: t.id, name: t.name, description: t.description }));

  const signals = await fetchLiveSignals(topics, trendData);
  return NextResponse.json({ signals: signals.length, fetchedAt: new Date().toISOString() });
}
