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
      max_tokens: 6000,
      messages: [
        {
          role: "user",
          content: `You are a sharp cultural strategist who has spent 20 years tracking where technology, capital, and consumer culture collide. You write like you are explaining something to a smart colleague over coffee: direct, specific, no padding. You skip the preamble. You name the company, the regulator, the tension. Your tone is casual but precise. No MBA frameworks, no hedge words, no throat-clearing openers like "In today's rapidly changing landscape".

Generate a full trend intelligence report for:

TREND: "${trendName}"
DESCRIPTION: "${trendDescription}"
INDUSTRY: "${industryLabel}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "historical_context": "4-5 sentences. Trace the lineage. What was the analogue version of this? What was the first digital attempt and why did it fail or stall? What specific inflection point (a platform launch, a cost curve crossing, a regulatory shift) created the conditions for right now? Name the years, the companies, the moments. Make the lineage feel inevitable in retrospect.",
  "cultural_context": "4-5 sentences. Read what this trend reveals about what consumers actually want but are not getting. Which communities or subcultures are leading and why, in terms of identity, anxiety, or aspiration. Name the specific online spaces, the behavioural signals, the aesthetic or language shifts that show the demand is real. Where is the cultural tension this trend is sitting inside.",
  "economic_context": "4-5 sentences. Break down who is making money and how the unit economics work. What changed in the cost structure that makes this viable now. Name the VC thesis, the B2B enabler layer funding the consumer surface, the margin dynamic for brands entering. Who is getting disintermediated and what does their response look like.",
  "macro_context": "3-4 sentences. Which macro forces opened the door: post-pandemic behaviour reset, labour inflation, platform consolidation, supply chain restructuring, generational wealth transfer. Name the actual pressure and the specific market it is hitting hardest. What would have to reverse for this trend to stall.",
  "political_context": "3-4 sentences. Name the legislation, the regulatory body, the jurisdiction. Where is policy accelerating this and where is it actively blocking it. Name the political actors and their actual incentive, not just their stated position.",
  "geographical_context": "3-4 sentences. Name the markets that are two years ahead and the specific reason: infrastructure, consumer sophistication, regulatory tailwind, or capital density. Name the laggard markets and the exact structural blocker. Where is the next breakout market and what would need to shift.",
  "why_it_matters": "5-6 sentences. Talk directly to the CMO. What is the specific risk of ignoring this for 18 more months. What does the brand that gets it right actually do differently in product, distribution, or communication. How long is the first-mover window. Name who is already moving and who is getting left behind. End with the one thing this trend makes structurally irreversible.",
  "how_to_proceed": [
    "Now (0-3 months): one thing to brief a team on today. Name the mechanism, the owner, the deliverable.",
    "Soon (3-12 months): a product, partnership, or capability build. What gap does it close, who owns it internally.",
    "Bet (12-36 months): the move that looks obvious in retrospect. What optionality does it create and what is the downside if wrong."
  ]
}

Rules:
- Every claim must be specific to THIS trend in ${industryLabel}. Nothing generic enough to work in any other report.
- Name companies, platforms, regulators, technologies, cities throughout.
- No sentence may open with "This trend", "In today's", "As we", "It is clear", or any variant.
- Write like you are texting a smart strategist friend who hates filler.
- Never use em dashes (the character). Commas, colons, or full stops only.`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const jsonStr = raw.startsWith("```") ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "") : raw;
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      historicalContext: parsed.historical_context,
      culturalContext: parsed.cultural_context,
      economicContext: parsed.economic_context,
      macroContext: parsed.macro_context,
      politicalContext: parsed.political_context,
      geographicalContext: parsed.geographical_context,
      whyItMatters: parsed.why_it_matters,
      howToProceed: parsed.how_to_proceed,
    });
  } catch (err) {
    console.error("generate-trend-report error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
