import { NextRequest, NextResponse } from "next/server";
import { fetchLiveSignals } from "@/lib/live-fetcher";

export async function GET() {
  const signals = await fetchLiveSignals();
  return NextResponse.json({ signals, fetchedAt: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    topics?: string[];
    trends?: Array<{ id: string; name: string; description: string }>;
  };
  const signals = await fetchLiveSignals(body.topics ?? [], body.trends ?? []);
  return NextResponse.json({ signals, fetchedAt: new Date().toISOString() });
}
