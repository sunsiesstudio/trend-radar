"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend } from "@/types";
import { TOPIC_LIBRARY } from "@/lib/extended-trends";

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

const TOPIC_TO_DOMAIN: Record<string, CulturalDomain> = {
  technology: "Tech & digital media", ai: "Tech & digital media",
  sustainability: "Tech & digital media", "climate-tech": "Tech & digital media",
  fintech: "Tech & digital media", cybersecurity: "Tech & digital media",
  biotech: "Tech & digital media", robotics: "Tech & digital media",
  web3: "Tech & digital media", "ar-vr": "Tech & digital media",
  "smart-home": "Tech & digital media", space: "Tech & digital media",
  medtech: "Tech & digital media",
  art: "Arts & performance", film: "Arts & performance",
  photography: "Arts & performance", creativity: "Arts & performance",
  music: "Arts & performance",
  gaming: "Play", sport: "Play", sports: "Play", nightlife: "Play",
  mobility: "Play",
  spirituality: "Spirituality & belief",
  retail: "Work & economy", finance: "Work & economy", branding: "Work & economy",
  education: "Work & economy", "future-of-work": "Work & economy",
  social: "Language & media", travel: "Language & media",
  dating: "Language & media", parenting: "Language & media", kids: "Language & media",
  food: "Food & ritual", "food-tech": "Food & ritual", coffee: "Food & ritual",
  health: "Body & wellness", fitness: "Body & wellness", skincare: "Body & wellness",
  wellness: "Body & wellness", "mental-health": "Body & wellness",
  pets: "Body & wellness", "synthetic-biology": "Body & wellness",
  beauty: "Aesthetic & design", fashion: "Aesthetic & design",
  "interior-design": "Aesthetic & design", luxury: "Aesthetic & design",
  fragrance: "Aesthetic & design", jewellery: "Aesthetic & design",
  lifestyle: "Aesthetic & design",
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
  const text = `${trend.name} ${trend.description} ${(trend as { culturalContext?: string }).culturalContext ?? ""}`.toLowerCase();
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

interface SelectedGroup {
  domain: CulturalDomain;
  need: Need;
  trends: Trend[];
}

interface Props {
  dynamicTrends: Trend[]; // user's AI-generated trends to layer on top
}

export function CultureMap({ dynamicTrends }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [selected, setSelected] = useState<SelectedGroup | null>(null);

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

  // All library trends + user's dynamic trends (deduped)
  const allTrends = useMemo(() => {
    const libraryFlat = Object.entries(TOPIC_LIBRARY).flatMap(([topic, trends]) =>
      trends.map(t => ({ ...t, topics: t.topics?.length ? t.topics : [topic] }))
    );
    const dynamicIds = new Set(dynamicTrends.map(t => t.id));
    return [
      ...libraryFlat.filter(t => !dynamicIds.has(t.id)),
      ...dynamicTrends,
    ];
  }, [dynamicTrends]);

  // Group by domain × need — one aggregated "chord" per pair
  const groups = useMemo(() => {
    const map = new Map<string, SelectedGroup>();
    allTrends.forEach(trend => {
      const topicKey = trend.topics?.[0] ?? "";
      const domain   = getDomain(topicKey);
      const need     = getTrendNeed(trend);
      const key = `${domain}--${need}`;
      if (!map.has(key)) map.set(key, { domain, need, trends: [] });
      map.get(key)!.trends.push(trend);
    });
    return [...map.values()];
  }, [allTrends]);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(w, h);
  const outerR      = minDim * 0.38;
  const innerR      = minDim * 0.165;
  const domainNodeR = Math.min(54, Math.max(34, outerR * 0.2));
  const needNodeR   = Math.min(44, Math.max(28, innerR * 0.7));

  const domainNodes = CULTURAL_DOMAINS.map((domain, i) => {
    const angle = (i / CULTURAL_DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
    return { domain, x: cx + outerR * Math.cos(angle), y: cy + outerR * Math.sin(angle) };
  });

  const needNodes = NEEDS.map((need, i) => {
    const angle = (i / NEEDS.length) * Math.PI * 2 - Math.PI / 2;
    return { need, x: cx + innerR * Math.cos(angle), y: cy + innerR * Math.sin(angle) };
  });

  const maxCount = Math.max(1, ...groups.map(g => g.trends.length));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>

          {/* Ghost web — all possible connections */}
          {domainNodes.flatMap(dn =>
            needNodes.map(nn => (
              <line key={`web-${dn.domain}-${nn.need}`}
                x1={dn.x} y1={dn.y} x2={nn.x} y2={nn.y}
                stroke="#ccc" strokeWidth={0.5} opacity={0.25} />
            ))
          )}

          {/* Aggregated connection chords */}
          {groups.map(group => {
            const dNode = domainNodes.find(n => n.domain === group.domain);
            const nNode = needNodes.find(n => n.need === group.need);
            if (!dNode || !nNode) return null;

            const isSelected = selected?.domain === group.domain && selected?.need === group.need;
            const dimmed = selected !== null && !isSelected;
            const count = group.trends.length;
            const weight = count / maxCount; // 0–1
            const strokeW = 1 + weight * 4;
            const opacity = dimmed ? 0.08 : isSelected ? 1 : 0.35 + weight * 0.5;
            const mx = (dNode.x + nNode.x) / 2;
            const my = (dNode.y + nNode.y) / 2;
            const color = DOMAIN_COLORS[group.domain];

            return (
              <g key={`${group.domain}--${group.need}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(isSelected ? null : group)}>
                {/* Wide invisible hit area */}
                <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                  stroke="transparent" strokeWidth={18} />
                {/* Visible chord */}
                <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                  stroke={color} strokeWidth={strokeW} opacity={opacity} />
                {/* Count badge */}
                {!dimmed && (
                  <g>
                    <circle cx={mx} cy={my} r={9} fill={isSelected ? color : "#F5F2EC"}
                      stroke={color} strokeWidth={1.5} opacity={isSelected ? 1 : 0.9} />
                    <text x={mx} y={my + 3.5} textAnchor="middle"
                      fontSize={7.5} fontWeight={700}
                      fill={isSelected ? "#fff" : color}
                      fontFamily="'DM Sans', sans-serif"
                      style={{ pointerEvents: "none" }}>
                      {count}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Domain nodes — outer ring */}
          {domainNodes.map(({ domain, x, y }) => {
            const color = DOMAIN_COLORS[domain];
            const active = groups.some(g => g.domain === domain);
            const words = domain.split(" & ");
            const lines = words.length > 1 ? words : domain.split(" ").reduce<string[][]>((acc, word) => {
              if (!acc.length || acc[acc.length - 1].join(" ").length + word.length > 12) acc.push([word]);
              else acc[acc.length - 1].push(word);
              return acc;
            }, []).map(g => g.join(" "));

            return (
              <g key={domain}>
                <circle cx={x} cy={y} r={domainNodeR}
                  fill={active ? `${color}18` : "#f8f7f4"}
                  stroke={active ? color : "#ddd"}
                  strokeWidth={active ? 2 : 1} />
                {lines.map((line, li) => (
                  <text key={li} x={x} y={y + (li - (lines.length - 1) / 2) * 14}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(11, domainNodeR * 0.24)}
                    fontWeight={active ? 600 : 400}
                    fill={active ? "#111" : "#bbb"}
                    fontFamily="'DM Sans', sans-serif">
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Need nodes — inner ring */}
          {needNodes.map(({ need, x, y }) => {
            const color = NEED_COLORS[need];
            const active = groups.some(g => g.need === need);
            return (
              <g key={need}>
                <circle cx={x} cy={y} r={needNodeR}
                  fill={active ? `${color}22` : "#f8f7f4"}
                  stroke={active ? color : "#ddd"}
                  strokeWidth={active ? 1.5 : 1} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={Math.min(11, needNodeR * 0.3)}
                  fontWeight={active ? 600 : 400}
                  fill={active ? "#111" : "#bbb"}
                  fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Selected group detail panel */}
      {selected && (
        <div style={{
          flexShrink: 0, background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "12px 20px 14px", maxHeight: 200, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOMAIN_COLORS[selected.domain], display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>
                {selected.domain} <span style={{ color: "#bbb", fontWeight: 400 }}>×</span> {selected.need}
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>— {selected.trends.length} trends</span>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", fontSize: 18, color: "#bbb", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.trends.slice(0, 8).map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color ?? DOMAIN_COLORS[selected.domain], marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#777", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}>
                    {t.description.slice(0, 100)}…
                  </div>
                </div>
              </div>
            ))}
            {selected.trends.length > 8 && (
              <div style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
                +{selected.trends.length - 8} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        flexShrink: 0, padding: "7px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          Line weight = signal strength · numbers = trend count · tap to explore
        </span>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          {allTrends.length} trends mapped
        </span>
      </div>
    </div>
  );
}
