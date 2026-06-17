"use client";

// Unique abstract SVG shape for each trend — no two alike
export function TrendShape({ trendId, color }: { trendId: string; color: string }) {
  const props = { viewBox: "0 0 200 200", xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%" };

  switch (trendId) {
    case "ai-creativity":
      // 8-point geometric star — precision, explosion of ideas
      return (
        <svg {...props}>
          <polygon points="100,8 115,82 190,72 130,120 168,188 100,152 32,188 70,120 10,72 85,82" fill={color} />
          <circle cx="100" cy="100" r="22" fill="rgba(255,255,255,0.25)" />
        </svg>
      );
    case "digital-identity":
      // Three overlapping offset circles — layered selves
      return (
        <svg {...props}>
          <circle cx="75" cy="100" r="58" fill={color} />
          <circle cx="125" cy="100" r="58" fill={color} opacity="0.7" />
          <circle cx="100" cy="70" r="42" fill={color} opacity="0.5" />
          <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.3)" />
        </svg>
      );
    case "ar-commerce":
      // Nested portal ovals — window into another world
      return (
        <svg {...props}>
          <ellipse cx="100" cy="100" rx="90" ry="65" fill={color} />
          <ellipse cx="100" cy="100" rx="65" ry="44" fill="rgba(255,255,255,0.2)" />
          <ellipse cx="100" cy="100" rx="40" ry="26" fill="rgba(255,255,255,0.25)" />
          <ellipse cx="100" cy="100" rx="16" ry="10" fill="rgba(255,255,255,0.4)" />
        </svg>
      );
    case "biotech-beauty":
      // Organic cell blob
      return (
        <svg {...props}>
          <path d="M100,20 C145,15 185,55 180,100 C175,148 138,185 95,182 C52,179 15,145 18,98 C21,52 55,25 100,20Z" fill={color} />
          <circle cx="80" cy="88" r="12" fill="rgba(255,255,255,0.3)" />
          <circle cx="118" cy="112" r="7" fill="rgba(255,255,255,0.25)" />
          <circle cx="95" cy="130" r="5" fill="rgba(255,255,255,0.2)" />
        </svg>
      );
    case "sustainable-materials":
      // Leaf — growth, nature
      return (
        <svg {...props}>
          <path d="M100,185 C100,185 20,140 20,80 C20,35 58,15 100,15 C142,15 180,35 180,80 C180,140 100,185 100,185Z" fill={color} />
          <path d="M100,185 L100,40" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" />
          <path d="M100,130 C80,110 50,100 35,90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
          <path d="M100,105 C120,88 148,82 162,75" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "3d-printing":
      // Isometric stack — layers building up
      return (
        <svg {...props}>
          <polygon points="100,18 175,58 175,102 100,62" fill={color} />
          <polygon points="100,18 25,58 25,102 100,62" fill={color} opacity="0.75" />
          <polygon points="25,102 100,142 175,102 100,62" fill={color} opacity="0.5" />
          <polygon points="100,78 155,108 155,140 100,110" fill={color} opacity="0.9" />
          <polygon points="100,78 45,108 45,140 100,110" fill={color} opacity="0.65" />
          <polygon points="45,140 100,170 155,140 100,110" fill={color} opacity="0.4" />
        </svg>
      );
    case "wearables":
      // Bold arc — ring, sensor
      return (
        <svg {...props}>
          <path d="M30,100 A70,70 0 1,1 100,170" stroke={color} strokeWidth="34" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="100" r="22" fill={color} />
          <circle cx="100" cy="100" r="10" fill="rgba(255,255,255,0.5)" />
          <circle cx="30" cy="100" r="10" fill={color} />
        </svg>
      );
    case "neurotech":
      // Brain-like irregular blob
      return (
        <svg {...props}>
          <path d="M100,25 C128,22 158,38 168,62 C178,86 170,108 158,122 C180,132 185,162 168,175 C150,188 124,178 108,168 C96,182 72,188 55,175 C38,162 42,138 56,124 C38,112 28,88 38,64 C48,40 72,28 100,25Z" fill={color} />
          <path d="M100,25 C100,25 100,175 100,175" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
          <path d="M42,95 C42,95 158,95 158,95" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
          <circle cx="82" cy="80" r="8" fill="rgba(255,255,255,0.25)" />
          <circle cx="120" cy="120" r="6" fill="rgba(255,255,255,0.2)" />
        </svg>
      );
    case "spatial-computing":
      // Nested squares — frames, dimensions, depth
      return (
        <svg {...props}>
          <rect x="12" y="12" width="176" height="176" rx="8" fill={color} />
          <rect x="32" y="32" width="136" height="136" rx="6" fill="rgba(255,255,255,0.18)" />
          <rect x="54" y="54" width="92" height="92" rx="4" fill="rgba(255,255,255,0.18)" />
          <rect x="76" y="76" width="48" height="48" rx="3" fill="rgba(255,255,255,0.22)" />
          <rect x="90" y="90" width="20" height="20" rx="2" fill="rgba(255,255,255,0.4)" />
        </svg>
      );
    case "longevity":
      // Infinity / figure-eight — endless
      return (
        <svg {...props}>
          <path d="M55,100 C55,68 75,45 100,45 C125,45 145,68 145,100 C145,132 165,155 190,155" stroke={color} strokeWidth="28" fill="none" strokeLinecap="round" />
          <path d="M145,100 C145,68 125,45 100,45 C75,45 55,68 55,100 C55,132 35,155 10,155" stroke={color} strokeWidth="28" fill="none" strokeLinecap="round" opacity="0.55" />
          <circle cx="100" cy="100" r="14" fill={color} />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="100" cy="100" r="80" fill={color} />
        </svg>
      );
  }
}
