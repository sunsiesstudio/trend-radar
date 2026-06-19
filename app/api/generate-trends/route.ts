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
          content: `You are a senior partner at a top cultural intelligence consultancy with 15 years tracking technology's collision with consumer culture. Your clients are CMOs, board-level innovation leads, and brand strategists. You write with analytical authority — concrete, specific, no filler, no adjective inflation. You name mechanisms, not just outcomes.

Generate exactly 2 trend intelligence entries for the topic: "${topic}"

Each trend must identify a specific intersection where EMERGING TECHNOLOGY is structurally reshaping this topic area. Think: AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, materials science, new energy systems, platform dynamics.

Return ONLY valid JSON (no markdown, no explanation), in this exact shape:
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short Trend Name (3-5 words)",
      "description": "3-4 sentences. What is happening, what technology is driving it, and what it means for consumer behaviour in ${topic}. Concrete — name companies, platforms, specific technologies.",
      "historical_context": "3-4 sentences. What is the historical arc that led here? What earlier technological or cultural moments set the conditions for this shift? Trace the lineage — from analogue precedents to digital inflection points to where we are now. Situate this trend in the longer story of how ${topic} has changed.",
      "economic_context": "3-4 sentences. What are the specific economic forces making this viable or disruptive right now? Unit economics, cost curves, market consolidation, labour arbitrage, VC thesis shifts, B2B vs B2C dynamics — whatever is genuinely driving the money in this trend. Be precise about who is winning and losing economically.",
      "macro_context": "3-4 sentences on the macroeconomic forces (inflation, post-pandemic restructuring, labour markets, platform consolidation, geopolitical trade shifts, supply chain reorientation) creating the conditions for this trend. Name the specific pressures — not generic economic headwinds.",
      "cultural_context": "3-4 sentences on the cultural and generational dynamics at play. How is consumer identity, aspiration, or anxiety intersecting with this technology shift in ${topic}? Name specific subcultures, movements, behavioural shifts. What does this trend reveal about what people actually want right now?",
      "political_context": "2-3 sentences on regulatory, geopolitical, or policy dynamics shaping or constraining this trend. Name specific legislation, regulatory bodies, or geopolitical tensions. Be specific about jurisdictions — EU AI Act, US executive orders, China's tech sovereignty push, whatever is genuinely relevant.",
      "geographical_context": "2-3 sentences on where this is moving fastest and why. Which markets, cities, or regions are leading? What structural conditions — infrastructure, regulation, consumer behaviour, capital — explain that geography? Where is it lagging and why?",
      "why_relevant": "4-5 sentences of strategic rationale. Why does this matter for brands in ${topic}? What is the competitive risk of ignoring it? What is the opportunity for early movers? What does the brand that gets this right look like? Write this as a senior strategist briefing a CMO who has 10 minutes.",
      "trajectory": "3-4 sentences on the next 12-36 months. What signals suggest acceleration? What friction or resistance exists — regulatory, consumer, infrastructure? What would need to be true for this to hit mainstream, and what would stall it?",
      "next_steps": [
        "Actionable recommendation #1 — specific enough to brief a team on, with a named mechanism and a timeframe",
        "Recommendation #2 — different strategic register (e.g. product, comms, partnership, R&D, acquisition)",
        "Recommendation #3 — longer-horizon or more experimental, the kind of bet that looks obvious in retrospect"
      ],
      "relevanceScore": 67,
      "signals": [
        { "id": "signal-id-1", "title": "Specific headline from a credible publication — dateable, not generic", "summary": "2-3 sentences of analytical context. What does this signal mean beyond the headline? Why now? What direction of travel does it confirm?", "source": "news", "sourceName": "Publication Name" },
        { "id": "signal-id-2", "title": "Reddit thread title — specific subreddit, specific topic", "summary": "2-3 sentences on what this community conversation reveals about consumer perception, anxiety, or real-world adoption.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-3", "title": "Specific headline 3", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-4", "title": "Specific headline 4", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-5", "title": "Reddit thread 5", "summary": "2-3 sentences analytical context.", "source": "reddit", "sourceName": "r/subreddit" },
        { "id": "signal-id-6", "title": "Specific headline 6", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-7", "title": "Specific headline 7", "summary": "2-3 sentences analytical context.", "source": "news", "sourceName": "Publication" },
        { "id": "signal-id-8", "title": "Reddit thread 8", "summary": "2-3 sentences analytical context.", "source": "reddit", "sourceName": "r/subreddit" }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT use these existing IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals array must have exactly 8 items — mix of news and reddit, specific real-sounding headlines
- No sentence may be generic enough to appear in any other trend report — every claim must be specific to this trend in ${topic}
- Write as if this report costs €5,000 and the client will notice if it reads like a language model
- Never use em dashes (the — character). Use commas, colons, or full stops instead`,
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
