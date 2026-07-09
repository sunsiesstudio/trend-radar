"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend } from "@/types";

// ── Fixed cultural domains (outer ring) ───────────────────────────────────────

const CULTURAL_DOMAINS = [
  "Tech & digital media",
  "Arts & performance",
  "Play",
  "Spirituality & belief",
  "Work & economy",
  "Language & media",
  "Food & ritual",
  "Body & wellness",
  "Aesthetic & design",
] as const;

type CulturalDomain = typeof CULTURAL_DOMAINS[number];

const DOMAIN_COLORS: Record<CulturalDomain, string> = {
  "Tech & digital media":   "#8C93C7",
  "Arts & performance":     "#FF8BB4",
  "Play":                   "#FFD65C",
  "Spirituality & belief":  "#78C9A8",
  "Work & economy":         "#FD8326",
  "Language & media":       "#B6D693",
  "Food & ritual":          "#C4A0CE",
  "Body & wellness":        "#53A373",
  "Aesthetic & design":     "#FFB04A",
};

// Map user topics → cultural domain
const TOPIC_TO_DOMAIN: Record<string, CulturalDomain> = {
  "technology":       "Tech & digital media",
  "ai":               "Tech & digital media",
  "sustainability":   "Tech & digital media",
  "retail":           "Work & economy",
  "finance":          "Work & economy",
  "education":        "Work & economy",
  "branding":         "Work & economy",
  "work":             "Work & economy",
  "art":              "Arts & performance",
  "film":             "Arts & performance",
  "photography":      "Arts & performance",
  "creativity":       "Arts & performance",
  "music":            "Arts & performance",
  "gaming":           "Play",
  "sport":            "Play",
  "sports":           "Play",
  "health":           "Body & wellness",
  "fitness":          "Body & wellness",
  "skincare":         "Body & wellness",
  "pets":             "Body & wellness",
  "beauty":           "Aesthetic & design",
  "fashion":          "Aesthetic & design",
  "interior-design":  "Aesthetic & design",
  "food":             "Food & ritual",
  "food-tech":        "Food & ritual",
  "social":           "Language & media",
  "travel":           "Language & media",
  "dating":           "Language & media",
  "spirituality":     "Spirituality & belief",
};

function getDomain(topic: string): CulturalDomain {
  return TOPIC_TO_DOMAIN[topic] ?? "Tech & digital media";
}

// ── Fixed human needs (inner ring) ────────────────────────────────────────────

const NEEDS = ["Belonging", "Identity", "Meaning", "Status", "Autonomy", "Safety"] as const;
type Need = typeof NEEDS[number];

const NEED_COLORS: Record<Need, string> = {
  Belonging: "#FF8BB4",
  Identity:  "#8C93C7",
  Meaning:   "#78C9A8",
  Status:    "#FFD65C",
  Autonomy:  "#FD8326",
  Safety:    "#B6D693",
};

const VALID_NEEDS = new Set<string>(NEEDS);

function inferNeed(trend: Trend): Need {
  const text = `${trend.name} ${trend.description} ${trend.culturalContext ?? ""}`.toLowerCase();
  if (/belong|community|connect|together|friend|tribe|shared|relation|dating|loneliness/.test(text)) return "Belonging";
  if (/identity|self|authentic|express|personal|individual|profile|avatar|represent/.test(text)) return "Identity";
  if (/status|prestige|signal|flex|luxury|aspirat|rank|exclusive|premium|clout/.test(text)) return "Status";
  if (/autonom|freedom|control|choice|independ|agency|decentrali|ownership/.test(text)) return "Autonomy";
  if (/safe|nostalg|familiar|comfort|tradition|trust|secure|anchor|roots|slow/.test(text)) return "Safety";
  return "Meaning";
}

function getTrendNeed(trend: Trend): Need {
  const explicit = (trend.needs ?? []).find(n => VALID_NEEDS.has(n)) as Need | undefined;
  return explicit ?? inferNeed(trend);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { trends: Trend[]; topics: string[] }

export function CultureMap({ trends, topics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [selected, setSelected] = useState<Trend | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (topics.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, background: "#F5F2EC" }}>
        <div style={{ fontSize: 32, opacity: 0.2 }}>◎</div>
        <div style={{ fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif", textAlign: "center", lineHeight: 1.6 }}>
          Add a topic on the <strong style={{ color: "#888" }}>Radar</strong> tab<br />to populate the culture map
        </div>
      </div>
    );
  }

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(w, h);
  const outerR     = minDim * 0.38;
  const innerR     = minDim * 0.165;
  const domainNodeR = Math.min(54, Math.max(36, outerR * 0.2));
  const needNodeR   = Math.min(44, Math.max(28, innerR * 0.68));

  // All 9 domains always visible on the outer ring
  const domainNodes = CULTURAL_DOMAINS.map((domain, i) => {
    const angle = (i / CULTURAL_DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      domain,
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
      color: DOMAIN_COLORS[domain],
    };
  });

  // All 6 needs on the inner ring
  const needNodes = NEEDS.map((need, i) => {
    const angle = (i / NEEDS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      need,
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
      color: NEED_COLORS[need],
    };
  });

  // One connection per trend: domain → need
  const connections = useMemo(() => trends.flatMap(trend => {
    const topicKey = trend.topics?.[0] ?? "";
    const domain   = getDomain(topicKey);
    const need     = getTrendNeed(trend);
    const dNode = domainNodes.find(n => n.domain === domain);
    const nNode = needNodes.find(n => n.need === need);
    if (!dNode || !nNode) return [];
    return [{ trend, domain, need, dNode, nNode, color: dNode.color }];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [trends]);

  // Which domains and needs are active?
  const activeDomains = new Set(connections.map(c => c.domain));
  const activeNeeds   = new Set(connections.map(c => c.need));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>

          {/* Ghost web */}
          {domainNodes.flatMap(dn =>
            needNodes.map(nn => (
              <line key={`web-${dn.domain}-${nn.need}`}
                x1={dn.x} y1={dn.y} x2={nn.x} y2={nn.y}
                stroke="#ccc" strokeWidth={0.5} opacity={0.3} />
            ))
          )}

          {/* Active connection lines */}
          {connections.map(({ trend, dNode, nNode, color }, idx) => {
            const isSelected = selected?.id === trend.id;
            const dimmed = selected !== null && !isSelected;
            const mx = (dNode.x + nNode.x) / 2;
            const my = (dNode.y + nNode.y) / 2;
            const angleDeg = Math.atan2(nNode.y - dNode.y, nNode.x - dNode.x) * (180 / Math.PI);
            const flip = angleDeg > 90 || angleDeg < -90;
            const labelAngle = flip ? angleDeg + 180 : angleDeg;
            const labelText = trend.name.split(" ").slice(0, 3).join(" ");

            return (
              <g key={`${trend.id}-${idx}`} style={{ cursor: "pointer" }}
                onClick={() => setSelected(isSelected ? null : trend)}>
                <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                  stroke="transparent" strokeWidth={14} />
                <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                  stroke={color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={dimmed ? 0.12 : isSelected ? 1 : 0.55} />
                {!dimmed && (
                  <g transform={`translate(${mx},${my}) rotate(${labelAngle})`}>
                    <rect x={-labelText.length * 2.7} y={-10}
                      width={labelText.length * 5.4} height={13}
                      fill="#F5F2EC" rx={3} opacity={0.88} />
                    <text textAnchor="middle" y={0}
                      fontSize={isSelected ? 9.5 : 8.5}
                      fontWeight={isSelected ? 700 : 500}
                      fill={isSelected ? "#111" : "#555"}
                      fontFamily="'DM Sans', sans-serif"
                      style={{ pointerEvents: "none" }}>
                      {labelText}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Domain nodes — outer ring (always visible) */}
          {domainNodes.map(({ domain, x, y, color }) => {
            const isActive = activeDomains.has(domain);
            const words = domain.split(" & ");
            const lines = words.length > 1 ? words : domain.split(" ").reduce<string[][]>((acc, w) => {
              if (!acc.length || (acc[acc.length - 1].join(" ").length + w.length) > 10) acc.push([w]);
              else acc[acc.length - 1].push(w);
              return acc;
            }, []).map(g => g.join(" "));

            return (
              <g key={domain}>
                <circle cx={x} cy={y} r={domainNodeR}
                  fill={isActive ? `${color}18` : "#fff"}
                  stroke={isActive ? color : "#ddd"}
                  strokeWidth={isActive ? 2 : 1} />
                {lines.map((line, li) => (
                  <text key={li}
                    x={x} y={y + (li - (lines.length - 1) / 2) * 14}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(11, domainNodeR * 0.24)}
                    fontWeight={isActive ? 600 : 400}
                    fill={isActive ? "#111" : "#bbb"}
                    fontFamily="'DM Sans', sans-serif">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Need nodes — inner ring */}
          {needNodes.map(({ need, x, y, color }) => {
            const isActive = activeNeeds.has(need);
            return (
              <g key={need}>
                <circle cx={x} cy={y} r={needNodeR}
                  fill={isActive ? `${color}22` : "#fff"}
                  stroke={isActive ? color : "#ddd"}
                  strokeWidth={isActive ? 1.5 : 1} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={Math.min(11, needNodeR * 0.3)}
                  fontWeight={isActive ? 600 : 400}
                  fill={isActive ? "#111" : "#bbb"}
                  fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Selected trend detail */}
      {selected && (
        <div style={{
          flexShrink: 0, background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "12px 20px 14px", maxHeight: 150, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: DOMAIN_COLORS[getDomain(selected.topics?.[0] ?? "")], flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>
                {selected.name}
              </span>
              <span style={{ fontSize: 9, color: "#888", background: "#f5f3ef", padding: "2px 8px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif" }}>
                {getDomain(selected.topics?.[0] ?? "")} × {getTrendNeed(selected)}
              </span>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", fontSize: 18, color: "#bbb", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
          <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {selected.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        flexShrink: 0, padding: "7px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>Active:</span>
          {[...activeDomains].map(d => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: DOMAIN_COLORS[d] }} />
              <span style={{ fontSize: 10, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          Tap a line to explore
        </span>
      </div>
    </div>
  );
}
