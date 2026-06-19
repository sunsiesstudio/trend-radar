import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic();

function extractJson(raw: string): string {
  const stripped = raw.startsWith("```")
    ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "")
    : raw;
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");
  return stripped.slice(start, end + 1);
}

async function attempt(trendName: string, trendDescription: string, industryLabel: string) {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 5000,
    messages: [
      {
        role: "user",
        content: `You're the person in the group chat who always has the good intel. You write the way someone smart types in a WhatsApp group: warm, direct, specific, no corporate speak. You've done the research and you're genuinely excited to share it. Short sentences. Real examples. Name the brand, the regulation, the exact thing that changed. No fluff, no hedging, no intro phrases like "In today's landscape" or "This trend".

Write a full contextual breakdown for this trend:

TREND: "${trendName}"
DESCRIPTION: "${trendDescription}"
INDUSTRY: "${industryLabel}"

Return ONLY a valid JSON object. All values are strings. No arrays, no nested objects.

{
  "historical_context": "4-5 sentences. Where did this come from? Walk it back: the older version that didn't quite work, the specific moment that made this version viable. Name years, companies, and the thing that actually changed.",
  "cultural_context": "4-5 sentences. What do people actually want that they weren't getting before. Which communities picked this up first and why. Name the online spaces, the real behaviour signals, the anxiety or desire underneath.",
  "economic_context": "4-5 sentences. Who's making money and exactly how. What shifted in the cost structure or unit economics. Name the VC angle, the margin story, who's getting squeezed.",
  "macro_context": "3-4 sentences. What bigger forces made room for this: post-pandemic shift, labour costs, platform consolidation, supply chain changes. Name the pressure and where it's hitting hardest.",
  "political_context": "3-4 sentences. Name the actual law, regulator, and country. Where is policy helping this happen and where is it getting in the way. Name the real players and what they're actually after.",
  "geographical_context": "3-4 sentences. Name the places that are two years ahead and say exactly why. Name where it's lagging and what's actually blocking it. Where's the next place to watch?",
  "why_it_matters": "5-6 sentences direct to whoever makes decisions. What's the real cost of sitting this out for 18 months. What does a brand look like when they get this right, in product and in communication. How long before the window closes. Who's already moving and who's getting left behind.",
  "action_now": "One specific thing to do in the next 0-3 months. Name what it is, who does it, what they actually produce.",
  "action_soon": "One product, collab, or capability to build in 3-12 months. What gap does it close and who owns it.",
  "action_bet": "The 12-36 month move that'll seem obvious in retrospect. What does it unlock."
}

Rules: everything must be specific to this trend in ${industryLabel}. Name companies, regulators, cities throughout. No em dashes. Commas, colons, or full stops only.`,
      },
    ],
  });

  const raw = (msg.content[0] as { type: string; text: string }).text.trim();
  const parsed = JSON.parse(extractJson(raw));
  return parsed;
}

export async function POST(req: NextRequest) {
  const { trendName, trendDescription, topic } = await req.json();
  if (!trendName || !trendDescription) {
    return NextResponse.json({ error: "trendName and trendDescription required" }, { status: 400 });
  }

  const industryLabel = topic ?? trendName;

  let lastErr: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      const parsed = await attempt(trendName, trendDescription, industryLabel);
      return NextResponse.json({
        historicalContext: parsed.historical_context,
        culturalContext: parsed.cultural_context,
        economicContext: parsed.economic_context,
        macroContext: parsed.macro_context,
        politicalContext: parsed.political_context,
        geographicalContext: parsed.geographical_context,
        whyItMatters: parsed.why_it_matters,
        howToProceed: [parsed.action_now, parsed.action_soon, parsed.action_bet].filter(Boolean),
      });
    } catch (err) {
      lastErr = err;
      console.error(`generate-trend-report attempt ${i + 1} failed:`, err);
    }
  }

  return NextResponse.json({ error: String(lastErr) }, { status: 500 });
}
