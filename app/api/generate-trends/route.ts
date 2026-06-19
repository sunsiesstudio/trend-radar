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
          content: `You are a senior creative strategist and trend researcher at a top cultural intelligence consultancy. You write for brand directors, CMOs, and innovation leads who need to understand where emerging technology is genuinely reshaping consumer culture — not hype, not buzzwords, but real structural shifts with strategic consequence.

Generate exactly 2 trend intelligence entries for the topic: "${topic}"

Each trend must identify a specific, concrete intersection where EMERGING TECHNOLOGY is reshaping that topic area. Think: AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, blockchain, materials science, new energy systems, etc.

Write with the authority of someone who has spent 15 years watching technology change culture. Be specific. Be analytical. Avoid adjective soup. Name the mechanism, not just the outcome.

Return ONLY valid JSON (no markdown, no explanation), in this exact shape:
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short Trend Name (3-5 words)",
      "description": "3-4 sentences. What is happening, what technology is driving it, and what it means for consumer behaviour in ${topic}. Concrete and specific — name companies, technologies, behaviours.",
      "macro_context": "2-3 sentences on the macroeconomic forces (inflation, post-pandemic restructuring, labour markets, platform consolidation, geopolitical trade shifts) creating the conditions for this trend. Substantive — not generic.",
      "cultural_context": "2-3 sentences on the cultural and generational dynamics at play. How is consumer identity, aspiration, or anxiety intersecting with this technology shift in ${topic}? Reference specific subcultures, movements, or behavioural shifts.",
      "political_context": "1-2 sentences on relevant regulatory, geopolitical, or policy dynamics shaping or constraining this trend. Be specific about jurisdictions and legislative context where relevant.",
      "geographical_context": "1-2 sentences on where this trend is moving fastest and why — which markets, cities, or regions are leading, and what structural conditions explain that geography.",
      "why_relevant": "3-4 sentences of strategic rationale. Why does this matter for brands operating in ${topic}? What is the competitive or cultural risk of ignoring it? What is the opportunity for those who move early? Write this like a senior strategist briefing a CMO.",
      "trajectory": "2-3 sentences on where this is going in the next 12-36 months. What signals suggest acceleration? What friction or resistance exists? What would need to be true for this to become mainstream or stall?",
      "next_steps": [
        "Specific, actionable recommendation for a brand in ${topic} — concrete enough to brief a team on",
        "Second recommendation — different strategic register (e.g. product, comms, partnership, R&D)",
        "Third recommendation — longer-horizon or more experimental"
      ],
      "relevanceScore": 67,
      "signals": [
        { "id": "signal-id-1", "title": "Real-sounding headline from a credible publication — specific, dateable, not generic", "summary": "2-3 sentences of analytical context. What does this signal mean? Why is it significant beyond the headline? What does it tell us about the direction of travel?", "source": "news", "sourceName": "Publication Name" },
        { "id": "signal-id-2", "title": "Reddit thread or community discussion title — specific subreddit, specific topic", "summary": "2-3 sentences on what the community conversation reveals about consumer perception, anxiety, or adoption of this tech in ${topic}.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-3", "title": "Headline 3", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-4", "title": "Headline 4", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-5", "title": "Headline 5", "summary": "2-3 sentences analytical context.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-6", "title": "Headline 6", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-7", "title": "Headline 7", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-8", "title": "Headline 8", "summary": "2-3 sentences analytical context.", "source": "reddit", "sourceName": "r/subreddit" }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT use these existing IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals array must have exactly 8 items — mix of news and reddit, specific real-sounding headlines, 2-3 sentence analytical summaries
- Every text field should read like it was written by a senior human analyst, not a content generator — no filler phrases, no generic statements, no adjective inflation
- Cultural and geopolitical context must be substantive and specific, not boilerplate`,
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
