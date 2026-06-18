import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PALETTE = ["#FF8BB4", "#FD8326", "#8C93C7", "#B6D693", "#FFD65C", "#53A373", "#78C9A8", "#C4A0CE", "#FFB04A", "#A7D47C"];
const POSITIONS: { x: number; y: number }[] = [
  { x: 368, y: 1968 }, { x: 948, y: 1968 }, { x: 1528, y: 1968 },
  { x: -32, y: 2568 }, { x: 548, y: 2568 }, { x: 1128, y: 2568 },
  { x: 1708, y: 2568 }, { x: 168, y: 3168 }, { x: 748, y: 3168 },
  { x: 1328, y: 3168 },
];

function pickColor(topic: string, idx: number): string {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return PALETTE[(h + idx) % PALETTE.length];
}

export async function POST(req: NextRequest) {
  const { topic, existingTrendIds = [] } = await req.json();
  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "topic required" }, { status: 400 });
  }

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a trend intelligence analyst for Augmented Radar, a tool that tracks emerging technology signals at the intersection of culture and consumer markets.

Generate exactly 2 emerging-tech trend entries for the topic: "${topic}"

Each trend must be a specific place where NEW or EMERGING TECHNOLOGY is reshaping that topic area. Think: AI, biotech, spatial computing, wearables, synthetic biology, robotics, AR/VR, blockchain, materials science, etc.

Return ONLY valid JSON (no markdown, no explanation), in this exact shape:
{
  "trends": [
    {
      "id": "snake-case-unique-id",
      "name": "Short Trend Name (3-5 words)",
      "description": "2-3 sentence description of where emerging tech meets ${topic}. Concrete, specific, forward-looking.",
      "why_now": "1-2 sentences on why this signal is emerging right now.",
      "brand_relevance": "1-2 sentences on strategic relevance for brands.",
      "relevanceScore": 55,
      "signals": [
        {
          "id": "signal-id-1",
          "title": "Specific signal title (real-sounding news/research headline)",
          "summary": "2-3 sentence summary of what this signal means and why it matters.",
          "source": "news",
          "sourceName": "Publication name"
        },
        {
          "id": "signal-id-2",
          "title": "Another signal headline",
          "summary": "Summary.",
          "source": "reddit",
          "sourceName": "r/subreddit"
        },
        {
          "id": "signal-id-3",
          "title": "Third signal headline",
          "summary": "Summary.",
          "source": "news",
          "sourceName": "Publication name"
        }
      ]
    }
  ]
}

Rules:
- IDs must be unique slugs starting with "${topic.toLowerCase().replace(/\s+/g, "-")}-"
- Do NOT use these existing IDs: ${existingTrendIds.join(", ") || "none"}
- relevanceScore between 52 and 81
- signals array must have exactly 3 items per trend
- Keep descriptions tight and analytically sharp, like a strategic brief
- Focus on intersections between emerging technology and the cultural/consumer dimension of "${topic}"`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const parsed = JSON.parse(raw);
    const date = new Date().toISOString().split("T")[0];

    // Hydrate with positions, colors, topics
    const trends = (parsed.trends as Array<{
      id: string; name: string; description: string; why_now: string;
      brand_relevance: string; relevanceScore: number;
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
        position: POSITIONS[i % POSITIONS.length],
        whyRelevant: t.why_now,
        trajectory: t.brand_relevance,
        nextSteps: [],
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
    return NextResponse.json({ error: "generation failed", detail: String(err) }, { status: 500 });
  }
}
