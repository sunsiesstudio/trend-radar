import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { trendName, trendDescription, topic } = await req.json();
  if (!trendName || !trendDescription) {
    return NextResponse.json({ error: "trendName and trendDescription required" }, { status: 400 });
  }

  const industryLabel = topic ?? trendName;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a senior partner at a top cultural intelligence consultancy. You write with analytical authority — concrete, specific, no filler. You name mechanisms, not just outcomes.

Generate a deep contextual analysis for this trend:

TREND: "${trendName}"
DESCRIPTION: "${trendDescription}"
INDUSTRY: "${industryLabel}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "historical_context": "3-4 sentences. What is the historical arc that led here? What earlier technological or cultural moments set the conditions for this shift? Trace the lineage — from analogue precedents to digital inflection points to where we are now.",
  "economic_context": "3-4 sentences. What specific economic forces make this viable or disruptive right now? Unit economics, cost curves, market consolidation, labour arbitrage, VC thesis shifts — whatever genuinely drives the money here. Name who is winning and losing economically.",
  "macro_context": "3-4 sentences on the macroeconomic forces (inflation, post-pandemic restructuring, labour markets, platform consolidation, geopolitical trade shifts, supply chain reorientation) creating the conditions for this trend. Name the specific pressures.",
  "cultural_context": "3-4 sentences on the cultural and generational dynamics at play. How is consumer identity, aspiration, or anxiety intersecting with this shift? Name specific subcultures, movements, behavioural shifts.",
  "political_context": "2-3 sentences on regulatory, geopolitical, or policy dynamics shaping or constraining this trend. Name specific legislation, regulatory bodies, or geopolitical tensions. Be specific about jurisdictions.",
  "geographical_context": "2-3 sentences on where this is moving fastest and why. Which markets, cities, or regions are leading? What structural conditions explain that geography? Where is it lagging and why?"
}

Rules:
- Every claim must be specific to THIS trend in ${industryLabel} — nothing generic enough to appear in any other report
- Name companies, platforms, regulators, specific technologies, specific geographies
- Write as if this costs €5,000 and the client will notice if it reads like a language model`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const jsonStr = raw.startsWith("```") ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "") : raw;
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      historicalContext: parsed.historical_context,
      economicContext: parsed.economic_context,
      macroContext: parsed.macro_context,
      culturalContext: parsed.cultural_context,
      politicalContext: parsed.political_context,
      geographicalContext: parsed.geographical_context,
    });
  } catch (err) {
    console.error("generate-trend-report error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
