import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "topic required" }, { status: 400 });
  }

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a senior partner at a leading cultural intelligence consultancy — the kind who gets flown in to brief CMOs and board-level innovation leads. You don't deal in obvious takes or MBA frameworks. You write with authority, specificity, and analytical edge. No filler. No boilerplate.

Write an industry intelligence briefing for: "${topic}"

Focus specifically on how EMERGING TECHNOLOGY is structurally reshaping this industry — not surface-level hype, but actual mechanisms of change. Think across AI, biotech, spatial computing, materials science, robotics, synthetic biology, wearables, new energy systems, platform dynamics.

Return ONLY valid JSON in this exact shape:
{
  "overview": "2-3 sentences on the current state of play. Where does this industry sit right now in terms of tech-driven transformation? Be concrete — name the specific forces in motion.",
  "tech_curve": "2-3 sentences. What technologies are right now causing the most structural disruption in ${topic}? Not what might happen — what is actually happening. Name companies, platforms, capabilities.",
  "forces": "2-3 sentences on the macro, cultural, and geopolitical forces creating the conditions for change. Inflation, generational shift, post-platform reckoning, climate pressure, sovereignty dynamics — whatever is genuinely relevant here.",
  "tensions": [
    { "label": "Tension name (3-4 words)", "body": "2 sentences explaining this structural tension — the pull between two forces that brands and operators must navigate." },
    { "label": "Tension name (3-4 words)", "body": "2 sentences." },
    { "label": "Tension name (3-4 words)", "body": "2 sentences." }
  ],
  "outlook": "2-3 sentences. What does the next 18 months look like? Where is the momentum going? What would need to be true for this transformation to accelerate or stall?",
  "watch": [
    "Non-obvious thing to watch #1 — specific, named, concrete",
    "Non-obvious thing to watch #2 — a company, behaviour, regulation, or technology that most people in this industry are underweighting",
    "Non-obvious thing to watch #3 — a signal that would indicate the whole conversation is about to shift"
  ]
}

Rules:
- Every sentence must contain a specific, concrete observation — no generalities
- No phrase that could appear in a McKinsey deck introduction
- No "in today's rapidly evolving landscape" or similar throat-clearing
- Write like someone with genuine domain expertise who has been in the room when these decisions get made`,
        },
      ],
    });

    const raw = (msg.content[0] as { type: string; text: string }).text.trim();
    const jsonStr = raw.startsWith("```") ? raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "") : raw;
    const parsed = JSON.parse(jsonStr);
    return NextResponse.json({ report: parsed });
  } catch (err) {
    console.error("generate-industry-report error:", err);
    const msg = String(err);
    const friendly = msg.includes("401") || msg.includes("Authentication") || msg.includes("API key")
      ? "API key not configured."
      : "Generation failed. Try again.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
