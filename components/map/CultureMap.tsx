"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend } from "@/types";
import { TOPIC_LIBRARY } from "@/lib/extended-trends";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";

// ── Fixed cultural domains ─────────────────────────────────────────────────────

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
  gaming: "Play", sport: "Play", sports: "Play",
  nightlife: "Play", mobility: "Play",
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

// ── Human needs ───────────────────────────────────────────────────────────────

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

// ── Types ─────────────────────────────────────────────────────────────────────

type Selection =
  | { type: "need";   need: Need;                                 trends: Trend[] }
  | { type: "domain"; domain: CulturalDomain;                     trends: Trend[] }
  | { type: "trend";  trend: Trend; domain: CulturalDomain; need: Need }
  | null;

interface Props {
  dynamicTrends: Trend[];
  activeTopics:  string[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CultureMap({ dynamicTrends, activeTopics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims,      setDims]      = useState({ w: 900, h: 600 });
  const [selection, setSelection] = useState<Selection>(null);
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    const seen = new Set<string>();
    const libraryFlat = Object.entries(TOPIC_LIBRARY).flatMap(([topic, trends]) =>
      trends.map(t => ({ ...t, topics: t.topics?.length ? t.topics : [topic] }))
    ).filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
    const dynamicIds = new Set(dynamicTrends.map(t => t.id));
    return [...libraryFlat.filter(t => !dynamicIds.has(t.id)), ...dynamicTrends];
  }, [dynamicTrends]);

  // Enrich each trend with its mapped domain + need
  const enriched = useMemo(() => allTrends.map(t => ({
    trend: t,
    domain: getDomain(t.topics?.[0] ?? ""),
    need:   getTrendNeed(t),
  })), [allTrends]);

  // Aggregated groups for background chords
  const groups = useMemo(() => {
    const map = new Map<string, { domain: CulturalDomain; need: Need; trends: Trend[] }>();
    enriched.forEach(({ trend, domain, need }) => {
      const key = `${domain}--${need}`;
      if (!map.has(key)) map.set(key, { domain, need, trends: [] });
      map.get(key)!.trends.push(trend);
    });
    return [...map.values()];
  }, [enriched]);

  // Tech & digital media is the meta-domain — it shows all trends
  const techGroups = useMemo(() => NEEDS.map(need => ({
    domain: "Tech & digital media" as CulturalDomain,
    need,
    trends: enriched.filter(e => e.need === need).map(e => e.trend),
  })).filter(g => g.trends.length > 0), [enriched]);

  const allGroups = useMemo(() => {
    const techKey = new Set(techGroups.map(g => `Tech & digital media--${g.need}`));
    return [...groups.filter(g => !techKey.has(`${g.domain}--${g.need}`)), ...techGroups];
  }, [groups, techGroups]);

  const maxCount = Math.max(1, ...allGroups.map(g => g.trends.length));

  const { w, h } = dims;
  const cx = w / 2, cy = h / 2;
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

  function isHighlighted(domain: CulturalDomain, need: Need) {
    if (!selection) return false;
    if (selection.type === "need")   return selection.need === need;
    if (selection.type === "domain") return selection.domain === domain;
    if (selection.type === "trend")  return selection.domain === domain && selection.need === need;
    return false;
  }

  function clearSelection() { setSelection(null); }

  // ── Detail panel content (shared between sidebar and popup) ──────────────────

  const listContent = selection && (selection.type === "need" || selection.type === "domain") && (
    <div style={{ padding: isMobile ? "16px 20px 28px" : "20px 20px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {selection.type === "need" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: NEED_COLORS[selection.need], display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>
                {selection.need}
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>{selection.trends.length} trends</span>
            </>
          )}
          {selection.type === "domain" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOMAIN_COLORS[selection.domain], display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>
                {selection.domain}
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>{selection.trends.length} trends</span>
            </>
          )}
        </div>
        <button onClick={clearSelection}
          style={{ background: "none", border: "none", fontSize: 20, color: "#bbb", cursor: "pointer", lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>×</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...selection.trends].sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)).slice(0, 12).map(t => {
          const tDomain = getDomain(t.topics?.[0] ?? "");
          const tNeed   = getTrendNeed(t);
          const color   = DOMAIN_COLORS[tDomain];
          return (
            <div
              key={t.id}
              onClick={() => setSelection({ type: "trend", trend: t, domain: tDomain, need: tNeed })}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: "#f9f8f5", borderRadius: 10, padding: "10px 12px",
                cursor: "pointer", border: "1px solid transparent",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color + "66")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                background: color,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
                    {t.relevanceScore ?? 0}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                  {t.description.slice(0, 100)}…
                </div>
              </div>
            </div>
          );
        })}
        {selection.trends.length > 12 && (
          <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif", paddingLeft: 4 }}>
            +{selection.trends.length - 12} more
          </div>
        )}
      </div>
    </div>
  );

  // ── SVG canvas ────────────────────────────────────────────────────────────────

  const svgCanvas = (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>

      {/* Ghost web */}
      {domainNodes.flatMap(dn =>
        needNodes.map(nn => (
          <line key={`web-${dn.domain}-${nn.need}`}
            x1={dn.x} y1={dn.y} x2={nn.x} y2={nn.y}
            stroke="#ccc" strokeWidth={0.5} opacity={0.2} />
        ))
      )}

      {/* Background aggregated chords — all domains including Tech meta-chords */}
      {allGroups.map(group => {
          const dNode = domainNodes.find(n => n.domain === group.domain);
          const nNode = needNodes.find(n => n.need === group.need);
          if (!dNode || !nNode) return null;
          const highlighted = isHighlighted(group.domain, group.need);
          const dimmed = selection !== null && !highlighted;
          const weight = group.trends.length / maxCount;
          const color = DOMAIN_COLORS[group.domain];
          const opacity = dimmed ? 0.05 : highlighted ? 0.7 : 0.3 + weight * 0.4;
          const strokeW = highlighted ? 2 + weight * 3 : 0.8 + weight * 1.5;
          return (
            <g key={`bg-${group.domain}--${group.need}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelection(highlighted ? null : {
                type: "need", need: group.need,
                trends: enriched.filter(e => e.need === group.need).map(e => e.trend),
              })}>
              <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                stroke="transparent" strokeWidth={14} />
              <line x1={dNode.x} y1={dNode.y} x2={nNode.x} y2={nNode.y}
                stroke={color} strokeWidth={strokeW} opacity={opacity} />
            </g>
          );
        })
      }

      {/* Domain nodes — outer ring */}
      {domainNodes.map(({ domain, x, y }) => {
        const color = DOMAIN_COLORS[domain];
        const isSelectedDomain = selection?.type === "domain" && selection.domain === domain;
        const r = domainNodeR;
        const words = domain.split(" & ");
        const lines = words.length > 1 ? words : domain.split(" ").reduce<string[][]>((acc, word) => {
          if (!acc.length || acc[acc.length - 1].join(" ").length + word.length > 12) acc.push([word]);
          else acc[acc.length - 1].push(word);
          return acc;
        }, []).map(g => g.join(" "));
        const domainTrends = domain === "Tech & digital media"
          ? allTrends
          : enriched.filter(e => e.domain === domain).map(e => e.trend);
        return (
          <g key={domain} style={{ cursor: "pointer" }}
            onClick={() => setSelection(isSelectedDomain ? null : { type: "domain", domain, trends: domainTrends })}>
            <circle cx={x} cy={y} r={r}
              fill={isSelectedDomain ? `${color}22` : `${color}12`}
              stroke={isSelectedDomain ? color : `${color}88`}
              strokeWidth={isSelectedDomain ? 2 : 1.5} />
            {lines.map((line, li) => (
              <text key={li} x={x} y={y + (li - (lines.length - 1) / 2) * 14}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.min(11, r * 0.24)}
                fontWeight={isSelectedDomain ? 700 : 500}
                fill={isSelectedDomain ? "#111" : "#666"}
                fontFamily="'DM Sans', sans-serif">
                {line}
              </text>
            ))}
          </g>
        );
      })}

      {/* Need nodes — inner ring (diamond shape) */}
      {needNodes.map(({ need, x, y }) => {
        const color = NEED_COLORS[need];
        const isSelectedNeed = selection?.type === "need" && selection.need === need;
        const hasConnections = enriched.some(e => e.need === need);
        const needTrends = enriched.filter(e => e.need === need).map(e => e.trend);
        const d = needNodeR;
        const pts = `${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`;
        return (
          <g key={need} style={{ cursor: "pointer" }}
            onClick={() => setSelection(isSelectedNeed ? null : { type: "need", need, trends: needTrends })}>
            <polygon points={pts}
              fill={isSelectedNeed ? `${color}33` : hasConnections ? `${color}18` : "#f8f7f4"}
              stroke={isSelectedNeed ? color : hasConnections ? `${color}99` : "#ddd"}
              strokeWidth={isSelectedNeed ? 2.5 : hasConnections ? 1.5 : 1} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fontSize={Math.min(11, needNodeR * 0.3)}
              fontWeight={isSelectedNeed ? 700 : hasConnections ? 500 : 400}
              fill={isSelectedNeed ? "#111" : hasConnections ? "#333" : "#ccc"}
              fontFamily="'DM Sans', sans-serif">
              {need}
            </text>
          </g>
        );
      })}

    </svg>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      {/* Main row: canvas + optional right panel (desktop only) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>

        {/* SVG canvas */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {svgCanvas}
        </div>

        {/* Desktop right sidebar */}
        {!isMobile && selection && (
          <div style={{
            width: "33.333vw", minWidth: 280, maxWidth: 520, flexShrink: 0,
            background: "#fff",
            borderLeft: "1px solid rgba(0,0,0,0.07)",
            overflowY: "auto",
            display: "flex", flexDirection: "column",
          }}>
            {selection.type === "trend" ? (
              <TrendDetailModal
                trend={selection.trend}
                onClose={clearSelection}
                onSelectSignal={() => {}}
                mode="sidebar"
              />
            ) : listContent}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0, padding: "7px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          Tap a need, a sector, or a trend line to explore
        </span>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          {allTrends.length} trends mapped
        </span>
      </div>

      {/* Mobile bottom-sheet popup */}
      {isMobile && selection && (
        <>
          {/* Backdrop */}
          <div
            onClick={clearSelection}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 200,
            }}
          />
          {/* Sheet */}
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            background: "#fff",
            borderRadius: "18px 18px 0 0",
            maxHeight: "62vh",
            overflowY: "auto",
            zIndex: 201,
            boxShadow: "0 -6px 40px rgba(0,0,0,0.18)",
          }}>
            {/* Drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: "#ddd", margin: "12px auto 0",
            }} />
            {selection.type === "trend" ? (
              <TrendDetailModal
                trend={selection.trend}
                onClose={clearSelection}
                onSelectSignal={() => {}}
                mode="sidebar"
              />
            ) : listContent}
          </div>
        </>
      )}

    </div>
  );
}
