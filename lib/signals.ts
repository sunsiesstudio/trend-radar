import { Signal } from "@/types";

export const MOCK_SIGNALS: Signal[] = [
  {
    id: "1",
    title: "Bioprinted Skin for Cosmetics Testing",
    summary:
      "Labs are printing human skin tissue to replace animal testing in beauty, with L'Oréal and startups like Poietis leading adoption.",
    why_emerging:
      "EU animal testing bans + consumer demand for ethical beauty are accelerating commercial viability.",
    brand_relevance:
      "Beauty and skincare brands can position bioprinting as a cruelty-free innovation story, not just compliance.",
    category: "biotech",
    strength: "emerging",
    sources: ["arXiv", "Vogue Business", "MIT Tech Review"],
    tags: ["beauty", "biotech", "ethics", "skincare"],
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    position: { x: 100, y: 150 },
  },
  {
    id: "2",
    title: "AR Try-On Going Mainstream",
    summary:
      "Snap, Apple Vision Pro and standalone apps are normalising augmented reality for fashion and beauty try-on at scale.",
    why_emerging:
      "Hardware costs falling + consumer comfort rising after COVID-era digital shopping habits.",
    brand_relevance:
      "Reduces return rates, enables digital-first product launches, opens virtual showroom strategies.",
    category: "vr-ar",
    strength: "strong",
    sources: ["Product Hunt", "TechCrunch", "Snap Investor Reports"],
    tags: ["fashion", "ar", "retail", "digital"],
    created_at: "2026-06-02T00:00:00Z",
    updated_at: "2026-06-02T00:00:00Z",
    position: { x: 400, y: 100 },
  },
  {
    id: "3",
    title: "3D-Printed Fashion at Scale",
    summary:
      "Designers like Iris van Herpen and startups like Zellerfeld are pushing 3D printing from couture novelty to scalable footwear and accessories.",
    why_emerging:
      "Material breakthroughs (flexible filaments, recycled inputs) are solving the wearability problem.",
    brand_relevance:
      "On-demand, zero-waste production — a genuine sustainability story with aesthetic differentiation.",
    category: "3d-printing",
    strength: "emerging",
    sources: ["Dezeen", "Wired", "Kickstarter"],
    tags: ["fashion", "sustainability", "manufacturing", "footwear"],
    created_at: "2026-06-03T00:00:00Z",
    updated_at: "2026-06-03T00:00:00Z",
    position: { x: 250, y: 320 },
  },
  {
    id: "4",
    title: "Neurocosmetics: Mood-Responsive Beauty",
    summary:
      "Brands are developing products that interact with the nervous system — adaptogens, stress-responsive formulations, and EEG-informed skincare.",
    why_emerging:
      "Intersection of wellness culture, neuroscience research, and ingredient transparency trend.",
    brand_relevance:
      "Opens a new category: beauty that responds to mental state, not just skin type.",
    category: "neurotech",
    strength: "weak",
    sources: ["bioRxiv", "Vogue Business", "WWD"],
    tags: ["beauty", "wellness", "neuroscience", "innovation"],
    created_at: "2026-06-04T00:00:00Z",
    updated_at: "2026-06-04T00:00:00Z",
    position: { x: 600, y: 280 },
  },
  {
    id: "5",
    title: "AI-Generated Fashion Design",
    summary:
      "Midjourney, Adobe Firefly and specialised tools like Cala are entering the design process — from mood boards to tech packs.",
    why_emerging:
      "Speed and cost pressure on design teams, plus a new generation of digitally-native designers.",
    brand_relevance:
      "Shifts the designer role from maker to curator/director. Raises questions about IP and authenticity.",
    category: "ai",
    strength: "strong",
    sources: ["Hacker News", "TechCrunch", "Business of Fashion"],
    tags: ["fashion", "ai", "design", "creative"],
    created_at: "2026-06-05T00:00:00Z",
    updated_at: "2026-06-05T00:00:00Z",
    position: { x: 500, y: 450 },
  },
];

export function getSignalColor(category: Signal["category"]): string {
  const colors: Record<Signal["category"], string> = {
    ai: "#6366f1",
    "vr-ar": "#8b5cf6",
    wearables: "#ec4899",
    biotech: "#10b981",
    "3d-printing": "#f59e0b",
    robotics: "#3b82f6",
    materials: "#14b8a6",
    "spatial-computing": "#a855f7",
    neurotech: "#f43f5e",
    other: "#6b7280",
  };
  return colors[category];
}

export function getStrengthLabel(strength: Signal["strength"]): string {
  return { weak: "Weak signal", emerging: "Emerging", strong: "Strong" }[strength];
}
