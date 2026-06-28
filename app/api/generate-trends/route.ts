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
          content: `You're the person in the group chat everyone wants to hear from. You've done the research but you share it like you're genuinely excited to tell your friends what you found. You're specific, you name names, you have opinions. You write the way someone smart types in a WhatsApp group: no fluff, no corporate speak, warm but direct. Short sentences. Real examples. If you had to preface it with "basically" that's the energy.

You always say whether something is just getting started, already moving fast, or nearly played out. You give people something to actually do with the information, not just vibe with it.

Generate exactly 2 trend entries for the topic: "${topic}"

Each one should capture a specific moment where new technology is changing how things work in this space. Think AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, materials science.

Return ONLY valid JSON (no markdown, no explanation):
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short punchy name (3-5 words, no fluff)",
      "description": "3-4 sentences. What's actually happening right now, what's driving it, what it means for people in ${topic}. Say which stage this is at: just starting, picking up speed, or nearly saturated. Name actual companies and platforms.",
      "historical_context": "4-5 sentences. Where did this come from? Walk it back: what's the older version that didn't quite work, what changed, why now. Make it feel like a story, not a timeline.",
      "economic_context": "4-5 sentences. Who's making money and how exactly. What shifted in the cost structure. Name the VC angle, who's getting squeezed, which companies are winning and why.",
      "macro_context": "3-4 sentences. What bigger forces made room for this: post-pandemic shift, labour costs going up, platforms consolidating, supply chains rerouting. Name the pressure and where it's landing hardest.",
      "cultural_context": "4-5 sentences. What do people actually want that they weren't getting before this. Which communities picked this up first and why. What's the real anxiety or desire underneath the behaviour, not just the surface thing.",
      "political_context": "3-4 sentences. Name the specific law, regulator, and country. Where is policy helping this happen and where is it getting in the way. Name the actual people or bodies involved and what they're really after.",
      "geographical_context": "3-4 sentences. Name the places that are two years ahead and say exactly why: infrastructure, money, regulations, or consumer readiness. Name where it's lagging and what's actually blocking it.",
      "why_relevant": "5-6 sentences, written directly to whoever needs to make a decision about this. What's the real risk of doing nothing for the next 18 months. What does a brand look like when they get this right, specifically. How long before the window closes. Name who's already moving and who's being left behind. End with the one thing this permanently changes.",
      "trajectory": "3-4 sentences. Call it: just getting started, accelerating, or nearly peaked. What do the next 18-36 months look like. What would confirm it's speeding up. What could slow it down or kill it.",
      "brand_moves": [
        { "label": "Brand name: what they did and why it worked (1 sentence)", "url": "https://www.theverge.com/example-article-about-this-brand-move" },
        { "label": "Another brand name: specific product, collab, or campaign (1 sentence)", "url": "https://techcrunch.com/example-article" },
        { "label": "Third brand: what they launched or partnered on (1 sentence)", "url": "https://wired.com/example-article" }
      ],
      "relevanceScore": 67,
      "signals": [
        { "id": "signal-id-1", "title": "Specific real headline, dateable and sourced", "summary": "2-3 sentences. What does this actually mean beyond the headline. Why does it matter right now. What does it confirm about where things are heading.", "source": "news", "sourceName": "Publication Name" },
        { "id": "signal-id-2", "title": "Reddit thread: specific subreddit, specific thing people are debating", "summary": "2-3 sentences. What is this community revealing about real adoption, real friction, or real anxiety that no brand survey would catch.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-3", "title": "Specific headline 3", "summary": "2-3 sentences. Name the brand or product and what their behaviour signals about adoption or saturation.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-4", "title": "Specific headline 4", "summary": "2-3 sentences. What consumer behaviour or business decision does this confirm.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-5", "title": "Reddit thread 5", "summary": "2-3 sentences. What does the grassroots chatter reveal that you wouldn't catch elsewhere.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-6", "title": "Specific headline 6", "summary": "2-3 sentences. Name the company or product and why this specific move matters.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-7", "title": "Specific headline 7", "summary": "2-3 sentences. Why does the timing of this matter.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-8", "title": "Reddit thread 8", "summary": "2-3 sentences. What friction or buzz in this community tells you something useful.", "source": "reddit", "sourceName": "r/subreddit" }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT reuse these IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals: exactly 8 items, mix of news and reddit, specific and real-sounding
- brand_moves: every entry MUST include a url pointing to a real news article or press release about that specific brand move, not the brand's homepage
- Every section must name at least one real brand, company, product, or person
- No sentence that could belong in a different trend report
- Have a clear opinion, don't hedge unless genuinely unsure
- Never use em dashes. Commas, colons, or full stops only`,
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
      why_relevant: string; trajectory: string;
      brand_moves?: Array<{ label: string; url?: string }>;
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
        nextSteps: [],
        brandMoves: t.brand_moves ?? [],
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
