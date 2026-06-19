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
        content: `You are a sharp cultural strategist with 20 years tracking where technology, capital, and consumer culture collide. Write like you are explaining something to a smart colleague: direct, specific, no padding. Name the company, the regulator, the tension. Casual but precise. No MBA frameworks, no filler.

Generate a full contextual analysis for this trend:

TREND: "${trendName}"
DESCRIPTION: "${trendDescription}"
INDUSTRY: "${industryLabel}"

Return ONLY a valid JSON object. All values are strings. No arrays, no nested objects.

{
  "historical_context": "4-5 sentences tracing the lineage. The analogue precedent, the failed first attempt, the specific inflection point that made this version viable. Name years, companies, moments.",
  "cultural_context": "4-5 sentences on what consumers actually want that they are not getting. Which subcultures or communities are leading and why. Name the online spaces, the behavioural signals, the cultural tension underneath.",
  "economic_context": "4-5 sentences on who is making money and how. What changed in the unit economics or cost structure. Name the VC thesis, the margin dynamic, who is getting disintermediated.",
  "macro_context": "3-4 sentences on which macro forces opened the door. Post-pandemic reset, labour inflation, platform consolidation, supply chain shift. Name the specific pressure and the market it is hitting hardest.",
  "political_context": "3-4 sentences. Name the legislation, the regulatory body, the jurisdiction. Where policy is accelerating this and where it is blocking it. Name the actors and their actual incentive.",
  "geographical_context": "3-4 sentences. Name the markets two years ahead and the exact reason. Name the laggard markets and the exact blocker. Where the next breakout market is and what would need to shift.",
  "why_it_matters": "5-6 sentences direct to a CMO. Specific risk of ignoring this for 18 months. What the brand that gets it right does differently in product, distribution, communication. How long the first-mover window is. Who is already moving and who is getting left behind.",
  "action_now": "One specific thing to brief a team on today (0-3 months). Name the mechanism, the owner, the deliverable.",
  "action_soon": "One product, partnership, or capability build for 3-12 months. What gap it closes and who owns it internally.",
  "action_bet": "The 12-36 month move that looks obvious in retrospect. What optionality it creates."
}

Rules: specific to THIS trend in ${industryLabel} only. Name companies, regulators, cities throughout. No sentence opens with "This trend", "In today's", "As we". No em dashes. Commas, colons, or full stops only.`,
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
