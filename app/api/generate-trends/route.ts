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
          content: `You are a sharp cultural strategist who has spent 15 years at the intersection of technology and consumer culture. You write the way a smart analyst texts a colleague: direct, specific, no padding. You skip the preamble. You name the mechanism, the company, the tension. You know which details actually matter and which are noise. Your tone is casual but precise, like you are explaining something obvious to someone smart enough to get it fast.

Generate exactly 2 trend entries for the topic: "${topic}"

Each trend must pin a specific moment where EMERGING TECHNOLOGY is structurally changing this space. Think: AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, materials science, platform dynamics.

Return ONLY valid JSON (no markdown, no explanation):
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short punchy name (3-5 words, no fluff)",
      "description": "3-4 sentences. What is actually happening, what tech is driving it, what it means for how people in ${topic} behave. Skip adjectives. Name the companies, the platforms, the specific shift.",
      "historical_context": "4-5 sentences. Where did this come from? Trace it back: the analogue precedent, the first digital attempt that failed, what changed to make this version work. Make it feel like a lineage, not a list.",
      "economic_context": "4-5 sentences. Who is making money and how. What shifted in the cost structure or unit economics. Name the VC thesis, the margin dynamic, who is getting disintermediated. Specific companies or categories, not abstract forces.",
      "macro_context": "3-4 sentences. Which macro forces created the opening: post-pandemic reset, labour inflation, platform consolidation, supply chain shift, generational wealth transfer. Name the actual pressure, not the vibe.",
      "cultural_context": "4-5 sentences. What does this trend reveal about what people actually want that they are not getting right now? Which subcultures or communities are leading? What is the anxiety or aspiration underneath the behaviour? Read the cultural signal, not just the surface action.",
      "political_context": "3-4 sentences. Name the specific legislation, regulator, and jurisdiction. Where is this being accelerated by policy and where is it being actively blocked. Name the politicians or bodies and what their actual incentive is.",
      "geographical_context": "3-4 sentences. Where is this two years ahead and why: infrastructure, capital, consumer sophistication, or regulatory tailwind? Where is it lagging and what exactly is the blocker? Name cities or markets, not just regions.",
      "why_relevant": "5-6 sentences. Direct brief to a CMO. What is the specific risk of sitting this out for 18 more months? What does the brand that cracks this look like, concretely? What is the first-mover window? Name who is already moving and who is being left behind. End with the one irreversible thing this trend changes.",
      "trajectory": "3-4 sentences. What does the next 18-36 months look like. What is the signal that this accelerates. What friction is real versus just noise. What would have to be true for this to stall.",
      "next_steps": [
        "Now (0-3 months): one specific thing to brief a team on today. Name the mechanism, the owner, the output.",
        "Soon (3-12 months): a product, partnership, or capability. What gap does it close and who owns it internally.",
        "Bet (12-36 months): the move that looks obvious in retrospect. What optionality does it create."
      ],
      "relevanceScore": 67,
      "signals": [
        { "id": "signal-id-1", "title": "Specific real headline, dateable and sourced", "summary": "2-3 sentences. What does this actually signal beyond the headline. Why does it matter now. What direction of travel does it confirm.", "source": "news", "sourceName": "Publication Name" },
        { "id": "signal-id-2", "title": "Reddit thread: specific subreddit, specific topic being debated", "summary": "2-3 sentences. What is this community revealing about real adoption, real friction, or real anxiety that brand research would miss.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-3", "title": "Specific headline 3", "summary": "2-3 sentences of sharp context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-4", "title": "Specific headline 4", "summary": "2-3 sentences of sharp context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-5", "title": "Reddit thread 5", "summary": "2-3 sentences of sharp context.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-6", "title": "Specific headline 6", "summary": "2-3 sentences of sharp context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-7", "title": "Specific headline 7", "summary": "2-3 sentences of sharp context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-8", "title": "Reddit thread 8", "summary": "2-3 sentences of sharp context.", "source": "reddit", "sourceName": "r/subreddit" }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT reuse these IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals: exactly 8 items, mix of news and reddit, specific and real-sounding
- No sentence generic enough to appear in any other trend report
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
