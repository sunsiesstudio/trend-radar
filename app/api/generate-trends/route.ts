import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic();

const PALETTE = ["#FF8BB4", "#FD8326", "#8C93C7", "#B6D693", "#FFD65C", "#53A373", "#78C9A8", "#C4A0CE", "#FFB04A", "#A7D47C"];
const GRID_COLS = 3;
const GRID_SPACING = 520;
const GRID_ORIGIN = 80;

function gridPosition(idx: number): { x: number; y: number } {
  return {
    x: GRID_ORIGIN + (idx % GRID_COLS) * GRID_SPACING,
    y: GRID_ORIGIN + Math.floor(idx / GRID_COLS) * GRID_SPACING,
  };
}

function pickColor(topic: string, idx: number): string {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return PALETTE[(h + idx) % PALETTE.length];
}

export async function POST(req: NextRequest) {
  const { topic, existingTrendIds = [], positionOffset = 0 } = await req.json();
  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "topic required" }, { status: 400 });
  }

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a sharp cultural strategist who has spent 15 years at the intersection of technology and consumer culture. You write how a smart analyst texts a colleague: direct, specific, no padding. Skip the preamble. Name the mechanism, the company, the tension. Know which details matter and which are noise. Casual but precise, like explaining something obvious to someone smart enough to get it fast.

A good trend report does three things: (1) explains what is happening and WHY, naming the cultural, economic, or tech driver behind it, not just the surface behaviour; (2) shows real evidence, concrete examples, specific brands, actual behaviours, products people are buying or ditching; (3) tells you what to do with it, clear implications for a brand that wants to act now. If it does not help someone make a decision it is not a trend report, it is curated inspiration. Always take a sharp point of view. Never be neutral. Call timing explicitly: is this emerging, accelerating, or near-saturated?

Generate exactly 2 trend entries for the topic: "${topic}"

Each trend must pin a specific moment where EMERGING TECHNOLOGY is structurally changing this space. Think: AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, materials science, platform dynamics.

Return ONLY valid JSON (no markdown, no explanation):
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short punchy name (3-5 words, no fluff)",
      "description": "3-4 sentences. What is actually happening, what tech is driving it, what it means for how people in ${topic} behave. Skip adjectives. Name the companies, the platforms, the specific shift. State your point of view: this is emerging, accelerating, or near peak.",
      "historical_context": "4-5 sentences. Trace the lineage: the analogue precedent, the first digital attempt that failed and why, what specifically changed to make this version viable. Name years and companies. Make it feel like a lineage, not a list.",
      "economic_context": "4-5 sentences. Name who is making money and exactly how. What shifted in cost structure or unit economics. Name the VC thesis, the margin dynamic, the company getting disintermediated. Concrete companies or categories, not abstract forces.",
      "macro_context": "3-4 sentences. Which macro forces created the opening: post-pandemic reset, labour inflation, platform consolidation, supply chain shift, generational wealth transfer. Name the actual pressure and the market it is hitting hardest.",
      "cultural_context": "4-5 sentences. What does this reveal about what people want that they are not getting? Which subcultures or communities are leading and why? Name the online spaces, the behavioural signals, the anxiety or aspiration underneath. Read the signal, not just the surface action.",
      "political_context": "3-4 sentences. Name the specific legislation, regulator, jurisdiction. Where is policy accelerating this and where is it blocking it. Name the actual bodies and their real incentive.",
      "geographical_context": "3-4 sentences. Name the markets two years ahead and the exact reason: infrastructure, capital, regulatory tailwind, consumer sophistication. Name the laggard markets and the exact blocker. Where is the next breakout market?",
      "why_relevant": "5-6 sentences DIRECT to a CMO. State the specific risk of sitting this out for 18 months. What does the brand that cracks this look like concretely, in product, distribution, and communication? How long is the first-mover window? Name who is already moving and who is getting left behind. End with the one irreversible thing this trend changes.",
      "trajectory": "3-4 sentences. Call it: emerging, accelerating, or near-saturated, and give the reason. What does the next 18-36 months look like. What signal would confirm acceleration. What friction is real versus noise. What would have to be true for this to stall.",
      "next_steps": [
        "Now (0-3 months): one specific thing to brief a team on today. Name the mechanism, the owner, the concrete output.",
        "Soon (3-12 months): a product, partnership, or capability build. What exact gap does it close and who owns it internally.",
        "Bet (12-36 months): the move that looks obvious in retrospect. What optionality does it create and why is the window open now."
      ],
      "relevanceScore": 67,
      "signals": [
        { "id": "signal-id-1", "title": "Specific real headline, dateable and sourced", "summary": "2-3 sentences. What does this actually signal beyond the headline. Why does it matter now. What direction of travel does it confirm.", "source": "news", "sourceName": "Publication Name" },
        { "id": "signal-id-2", "title": "Reddit thread: specific subreddit, specific topic being debated", "summary": "2-3 sentences. What is this community revealing about real adoption, real friction, or real anxiety that brand research would miss.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-3", "title": "Specific headline 3", "summary": "2-3 sentences. Name the brand or product and what its behaviour signals about adoption or saturation.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-4", "title": "Specific headline 4", "summary": "2-3 sentences. What concrete consumer behaviour or business decision does this confirm.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-5", "title": "Reddit thread 5", "summary": "2-3 sentences. What does grassroots chatter reveal that surveys would not catch.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-6", "title": "Specific headline 6", "summary": "2-3 sentences of sharp context with a named company or product.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-7", "title": "Specific headline 7", "summary": "2-3 sentences. Why does timing matter here specifically.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-8", "title": "Reddit thread 8", "summary": "2-3 sentences. What friction or excitement in this community tells you something a brand should know.", "source": "reddit", "sourceName": "r/subreddit" }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT reuse these IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals: exactly 8 items, mix of news and reddit, specific and real-sounding
- Every section must include at least one named brand, company, product, or person
- No sentence generic enough to appear in any other trend report
- Take a clear point of view: never hedge with "could" or "might" unless genuinely uncertain
- Write like you are texting a smart strategist friend who hates filler
- Never use em dashes (the character). Commas, colons, or full stops only`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const jsonStr = raw.startsWith("```") ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "") : raw;
    const parsed = JSON.parse(jsonStr);
    const date = new Date().toISOString().split("T")[0];

    // Hydrate with positions, colors, topics
    const trends = (parsed.trends as Array<{
      id: string; name: string; description: string;
      historical_context?: string; economic_context?: string;
      macro_context?: string; cultural_context?: string; political_context?: string; geographical_context?: string;
      why_relevant: string; trajectory: string; next_steps: string[];
      relevanceScore: number;
      signals: Array<{ id: string; title: string; summary: string; source: string; sourceName: string }>;
    }>).map((t, i) => ({
      trend: {
        id: t.id,
        name: t.name,
        description: t.description,
        color: pickColor(topic, i),
        topics: [topic.toLowerCase().replace(/\s+/g, "-")],
        relevanceScore: t.relevanceScore,
        redditQuery: `${topic} technology`,
        newsQuery: `${topic} emerging tech`,
        position: gridPosition(positionOffset + i),
        historicalContext: t.historical_context,
        economicContext: t.economic_context,
        macroContext: t.macro_context,
        culturalContext: t.cultural_context,
        politicalContext: t.political_context,
        geographicalContext: t.geographical_context,
        whyRelevant: t.why_relevant,
        trajectory: t.trajectory,
        nextSteps: t.next_steps ?? [],
      },
      signals: t.signals.map((s) => ({
        id: s.id,
        trendId: t.id,
        title: s.title,
        summary: s.summary,
        source: s.source,
        sourceName: s.sourceName,
        date,
        crossLinks: [],
      })),
    }));

    return NextResponse.json({ trends });
  } catch (err) {
    console.error("generate-trends error:", err);
    const msg = String(err);
    const friendly = msg.includes("401") || msg.includes("Authentication") || msg.includes("API key")
      ? "API key not configured. Set ANTHROPIC_API_KEY in Vercel environment variables."
      : msg.includes("timeout") || msg.includes("504") || msg.includes("ETIMEDOUT")
      ? "Request timed out. Try again."
      : "Generation failed. Try again.";
    return NextResponse.json({ error: friendly, detail: msg }, { status: 500 });
  }
}
