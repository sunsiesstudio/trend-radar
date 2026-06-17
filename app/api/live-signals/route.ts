import { NextResponse } from "next/server";
import { fetchLiveSignals } from "@/lib/live-fetcher";

export async function GET() {
  const signals = await fetchLiveSignals();
  return NextResponse.json({ signals, fetchedAt: new Date().toISOString() });
}
