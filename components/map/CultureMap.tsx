"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend, Signal } from "@/types";
import { TOPIC_LIBRARY } from "@/lib/extended-trends";
import { SIGNALS } from "@/lib/trends";
import { EXTENDED_SIGNALS } from "@/lib/extended-trends";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";

// ── Life arenas ───────────────────────────────────────────────────────────────

const CULTURAL_DOMAINS = [
  "Body", "Home", "Work", "Play", "Style",
  "Food", "Community", "Mind", "Nature",
] as const;
type CulturalDomain = typeof CULTURAL_DOMAINS[number];

const DOMAIN_COLORS: Record<CulturalDomain, string> = {
  Body:      "#E87B7B",
  Home:      "#D4A76A",
  Work:      "#6B8FBB",
  Play:      "#FFD65C",
  Style:     "#C4A0CE",
  Food:      "#FD8326",
  Community: "#FF8BB4",
  Mind:      "#78C9A8",
  Nature:    "#6BAD6B",
};

const TOPIC_TO_DOMAIN: Record<string, CulturalDomain> = {
  biotech: "Body", medtech: "Body", health: "Body", fitness: "Body",
  wellness: "Body", skincare: "Body", "synthetic-biology": "Body",
  "smart-home": "Home", "interior-design": "Home", lifestyle: "Home",
  technology: "Work", ai: "Work", fintech: "Work", cybersecurity: "Work",
  robotics: "Work", finance: "Work", retail: "Work", branding: "Work",
  education: "Work", "future-of-work": "Work", web3: "Work",
  gaming: "Play", sport: "Play", sports: "Play", nightlife: "Play",
  mobility: "Play", travel: "Play", film: "Play", music: "Play", "ar-vr": "Play",
  beauty: "Style", fashion: "Style", luxury: "Style", fragrance: "Style",
  jewellery: "Style", art: "Style", photography: "Style", creativity: "Style",
  food: "Food", "food-tech": "Food", coffee: "Food",
  social: "Community", dating: "Community", parenting: "Community",
  kids: "Community", pets: "Community", spirituality: "Community",
  "mental-health": "Mind",
  sustainability: "Nature", "climate-tech": "Nature", space: "Nature",
};

function getDomain(topic: string): CulturalDomain {
  return TOPIC_TO_DOMAIN[topic] ?? "Work";
}

// ── Cultural tensions ──────────────────────────────────────────────────────────

const NEEDS = ["Control", "Connection", "Escape", "Recognition", "Authenticity", "Resilience"] as const;
type Need = typeof NEEDS[number];

const NEED_COLORS: Record<Need, string> = {
  Control:      "#FD8326",
  Connection:   "#FF8BB4",
  Escape:       "#8C93C7",
  Recognition:  "#FFD65C",
  Authenticity: "#78C9A8",
  Resilience:   "#B6D693",
};

const TENSION_VIBES: Record<Need, string> = {
  Control:      "People are reclaiming agency over their data, bodies, and environments as automation accelerates.",
  Connection:   "Genuine human connection is growing scarce — and more valuable — in algorithmically mediated social life.",
  Escape:       "Pressure to be always-on is fuelling a mainstream retreat into rest, slowness, and alternative realities.",
  Recognition:  "Attention is the new currency. Status is fragmenting from prestige brands into cultural credibility.",
  Authenticity: "Audiences have finely tuned radar for performance. Raw, unfiltered, and unoptimised is winning trust.",
  Resilience:   "Climate anxiety, economic precarity, and health shocks have normalised planning for disruption.",
};

const NEED_REMAP: Record<string, Need> = {
  Belonging: "Connection", Identity: "Authenticity", Meaning: "Escape",
  Status: "Recognition", Autonomy: "Control", Safety: "Resilience",
};
const VALID_NEEDS = new Set<string>(NEEDS);

const DOMAIN_VIBES: Record<CulturalDomain, string> = {
  Body:      "Performance, longevity, and stress are being quantified and chemically optimised. The body is now a data source.",
  Home:      "The home is becoming a responsive environment — tracking, adapting, and personalising in real time.",
  Work:      "AI is compressing tasks, eliminating roles, and rewriting what productivity actually means.",
  Play:      "Entertainment is going spatial and participatory. The line between content and experience is dissolving.",
  Style:     "Identity is being expressed, archived, and resold at a pace the fashion system wasn't built for.",
  Food:      "What we eat is being reinvented at the molecular level — from lab-grown to AI-formulated.",
  Community: "Belonging is migrating online and fragmenting into micro-communities built around shared obsessions.",
  Mind:      "Mental health has gone mainstream. The market for mood, focus, and calm is now a tech battleground.",
  Nature:    "The climate crisis is forcing a redesign of materials, energy, and how brands talk about responsibility.",
};

function inferNeed(trend: Trend): Need {
  const text = `${trend.name} ${trend.description} ${(trend as { culturalContext?: string }).culturalContext ?? ""}`.toLowerCase();
  if (/control|own|agent|agenc|choice|independ|customi|personal|sovereign|empower/.test(text)) return "Control";
  if (/belong|together|communit|intimac|friend|love|care|relation|dating|loneli|connect/.test(text)) return "Connection";
  if (/wonder|adventure|dream|escap|fantasi|transcend|rest|slow|decompress|wanderlust|holiday/.test(text)) return "Escape";
  if (/status|prestige|signal|achiev|fame|attention|flex|recog|celebr|exclusive|luxury|aspirat|clout/.test(text)) return "Recognition";
  if (/authentic|real|genuine|honest|raw|transparent|fake|perform|truth|original|unfiltered/.test(text)) return "Authenticity";
  return "Resilience";
}

function getTrendNeed(trend: Trend): Need {
  const explicit = (trend.needs ?? []).find(n => VALID_NEEDS.has(n)) as Need | undefined;
  if (explicit) return explicit;
  const remapped = (trend.needs ?? []).map(n => NEED_REMAP[n]).find(Boolean);
  if (remapped) return remapped;
  return inferNeed(trend);
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Selection =
  | { type: "need";   need: Need;                              trends: Trend[] }
  | { type: "domain"; domain: CulturalDomain;                  trends: Trend[] }
  | { type: "trend";  trend: Trend; domain: CulturalDomain; need: Need }
  | null;

type View = "card" | "map";

interface Props {
  dynamicTrends: Trend[];
  activeTopics:  string[];
}

// ── Helper ────────────────────────────────────────────────────────────────────

function edgePts(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  return { sx: x1 + ux * r1, sy: y1 + uy * r1, ex: x2 - ux * r2, ey: y2 - uy * r2 };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CultureMap({ dynamicTrends, activeTopics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims,         setDims]         = useState({ w: 900, h: 600 });
  const [view,         setView]         = useState<View>("card");
  const [selection,    setSelection]    = useState<Selection>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [isMobile,     setIsMobile]     = useState(false);

  const allSignals = useMemo(() => [...SIGNALS, ...EXTENDED_SIGNALS], []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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

  const allTrends = useMemo(() => {
    const seen = new Set<string>();
    const libraryFlat = Object.entries(TOPIC_LIBRARY).flatMap(([topic, trends]) =>
      trends.map(t => ({ ...t, topics: t.topics?.length ? t.topics : [topic] }))
    ).filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
    const dynamicIds = new Set(dynamicTrends.map(t => t.id));
    return [...libraryFlat.filter(t => !dynamicIds.has(t.id)), ...dynamicTrends];
  }, [dynamicTrends]);

  const enriched = useMemo(() => allTrends.map(t => ({
    trend: t, domain: getDomain(t.topics?.[0] ?? ""), need: getTrendNeed(t),
  })), [allTrends]);

  function clearSelection() { setSelection(null); }

  // ── Map geometry ─────────────────────────────────────────────────────────────

  const { w, h } = dims;
  const cx = w / 2, cy = h / 2;
  const minDim = Math.min(w, h);
  const portrait = h > w * 1.15;
  const domR = Math.min(minDim < 500 ? 38 : 48, Math.max(28, minDim * 0.077));
  const PAD = 12;
  const maxRx = w / 2 - domR - PAD;
  const maxRy = h / 2 - domR - PAD;
  const baseR = Math.min(maxRx, maxRy);
  const outerRx = portrait ? maxRx : baseR;
  const outerRy = portrait ? Math.min(maxRy, maxRx * Math.min(h / w, 1.3)) : baseR;
  const INNER = 0.42;
  const innerRx = outerRx * INNER;
  const innerRy = outerRy * INNER;
  // Rounded-rect size for tension nodes
  const tensW = Math.min(88, Math.max(58, Math.min(innerRx, innerRy) * 1.4));
  const tensH = Math.min(44, Math.max(32, tensW * 0.5));

  const domainNodes = CULTURAL_DOMAINS.map((domain, i) => {
    const angle = (i / CULTURAL_DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
    return { domain, x: cx + outerRx * Math.cos(angle), y: cy + outerRy * Math.sin(angle) };
  });

  const needNodes = NEEDS.map((need, i) => {
    const angle = (i / NEEDS.length) * Math.PI * 2 - Math.PI / 2;
    return { need, x: cx + innerRx * Math.cos(angle), y: cy + innerRy * Math.sin(angle) };
  });

  // Which domains/needs are connected to the current selection
  const selectedDomain = selection?.type === "domain" ? selection.domain
    : selection?.type === "trend" ? selection.domain : null;
  const selectedNeed = selection?.type === "need" ? selection.need
    : selection?.type === "trend" ? selection.need : null;

  const connectedNeeds = selectedDomain
    ? new Set(enriched.filter(e => e.domain === selectedDomain).map(e => e.need))
    : null;
  const connectedDomains = selectedNeed
    ? new Set(enriched.filter(e => e.need === selectedNeed).map(e => e.domain))
    : null;

  // ── Detail panel content ──────────────────────────────────────────────────────

  const listContent = selection && (selection.type === "need" || selection.type === "domain") && (
    <>
      <div style={{ padding: "16px 20px 12px", flexShrink: 0, borderBottom: "1px solid #f0ede8", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {selection.type === "need" && (
              <>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: NEED_COLORS[selection.need], display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>{selection.need}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{selection.trends.length} trends</span>
              </>
            )}
            {selection.type === "domain" && (
              <>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: DOMAIN_COLORS[selection.domain], display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>{selection.domain}</span>
                <span style={{ fontSize: 11, color: "#aaa" }}>{selection.trends.length} trends</span>
              </>
            )}
          </div>
          <button onClick={clearSelection}
            style={{ background: "none", border: "none", fontSize: 20, color: "#bbb", cursor: "pointer", lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>×</button>
        </div>
        {selection.type === "domain" && (() => {
          const v = DOMAIN_VIBES[selection.domain];
          return v ? <p style={{ fontSize: 13, color: "#888", lineHeight: 1.55, margin: 0, fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>{v}</p> : null;
        })()}
        {selection.type === "need" && (() => {
          const v = TENSION_VIBES[selection.need];
          return v ? <p style={{ fontSize: 13, color: "#888", lineHeight: 1.55, margin: 0, fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>{v}</p> : null;
        })()}
      </div>
      <div style={{
        ...(isMobile ? { flex: 1, overflowY: "auto" as const, WebkitOverflowScrolling: "touch" as const } : {}),
        padding: "12px 20px",
        paddingBottom: isMobile ? "max(28px, env(safe-area-inset-bottom, 28px))" : 20,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...selection.trends].sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)).map(t => {
            const tDomain = getDomain(t.topics?.[0] ?? "");
            const tNeed   = getTrendNeed(t);
            const color   = t.color || DOMAIN_COLORS[tDomain];
            return (
              <div key={t.id}
                onClick={() => setSelection({ type: "trend", trend: t, domain: tDomain, need: tNeed })}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#f9f8f5", borderRadius: 10, padding: "10px 12px", cursor: "pointer", border: "1px solid transparent", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color + "66")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", flexShrink: 0 }}>{t.relevanceScore ?? 0}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
                    {t.description.slice(0, 100)}…
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  // ── Card grid view ────────────────────────────────────────────────────────────

  const cardGrid = (
    <div style={{
      flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch",
      padding: isMobile ? "20px 16px 24px" : "32px 40px 32px",
    } as React.CSSProperties}>
      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          Life Arenas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 12 }}>
          {CULTURAL_DOMAINS.map(domain => {
            const color = DOMAIN_COLORS[domain];
            const isSelected = selection?.type === "domain" && selection.domain === domain;
            const domainTrends = enriched.filter(e => e.domain === domain).map(e => e.trend);
            return (
              <div key={domain}
                onClick={() => setSelection(isSelected ? null : { type: "domain", domain, trends: domainTrends })}
                style={{
                  borderRadius: isMobile ? 14 : 18, padding: isMobile ? "16px 10px" : "20px 14px",
                  background: color, cursor: "pointer", textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  boxShadow: isSelected ? `0 0 0 3px #fff, 0 0 0 5px ${color}, 0 6px 20px ${color}55` : "0 2px 10px rgba(0,0,0,0.10)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.15s ease", userSelect: "none",
                }}>
                <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif" }}>{domain}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif" }}>{domainTrends.length} trends</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#bbb", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          Cultural Tensions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 12 }}>
          {NEEDS.map(need => {
            const color = NEED_COLORS[need];
            const isSelected = selection?.type === "need" && selection.need === need;
            const needTrends = enriched.filter(e => e.need === need).map(e => e.trend);
            return (
              <div key={need}
                onClick={() => setSelection(isSelected ? null : { type: "need", need, trends: needTrends })}
                style={{
                  borderRadius: isMobile ? 14 : 18, padding: isMobile ? "16px 10px" : "20px 14px",
                  background: isSelected ? `${color}14` : "#fff", border: `2px solid ${isSelected ? color : `${color}66`}`,
                  cursor: "pointer", textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  boxShadow: isSelected ? `0 0 0 3px ${color}33, 0 6px 20px ${color}22` : "0 2px 10px rgba(0,0,0,0.06)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.15s ease", userSelect: "none",
                }}>
                <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: isSelected ? color : "#333", fontFamily: "'DM Sans', sans-serif" }}>{need}</div>
                <div style={{ fontSize: 10, color: isSelected ? color : "#aaa", fontFamily: "'DM Sans', sans-serif" }}>{needTrends.length} trends</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── SVG map view ──────────────────────────────────────────────────────────────

  const svgMap = (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, display: "block" }}>
      <defs>
        <filter id="nodeShad" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.10" />
        </filter>
      </defs>

      {/* Connection lines — only appear when a node is selected */}
      {selectedDomain && connectedNeeds && needNodes.map(({ need, x: nx, y: ny }) => {
        if (!connectedNeeds.has(need)) return null;
        const dNode = domainNodes.find(n => n.domain === selectedDomain)!;
        const color = DOMAIN_COLORS[selectedDomain];
        const { sx, sy, ex, ey } = edgePts(dNode.x, dNode.y, nx, ny, domR, tensH * 0.65);
        return (
          <line key={need} x1={sx} y1={sy} x2={ex} y2={ey}
            stroke={color} strokeWidth={1.5} opacity={0.55} strokeLinecap="round" />
        );
      })}
      {selectedNeed && connectedDomains && domainNodes.map(({ domain, x: dx, y: dy }) => {
        if (!connectedDomains.has(domain)) return null;
        const nNode = needNodes.find(n => n.need === selectedNeed)!;
        const color = DOMAIN_COLORS[domain];
        const { sx, sy, ex, ey } = edgePts(dx, dy, nNode.x, nNode.y, domR, tensH * 0.65);
        return (
          <line key={domain} x1={sx} y1={sy} x2={ex} y2={ey}
            stroke={color} strokeWidth={1.5} opacity={0.55} strokeLinecap="round" />
        );
      })}

      {/* Domain circles — outer ring */}
      {domainNodes.map(({ domain, x, y }) => {
        const color = DOMAIN_COLORS[domain];
        const isSelected = selection?.type === "domain" && selection.domain === domain;
        const dimmed = selection !== null && !isSelected &&
          !(connectedDomains?.has(domain)) && selection.type !== "trend";
        const domainTrends = enriched.filter(e => e.domain === domain).map(e => e.trend);
        const fontSize = Math.min(12, Math.max(9, domR * 0.28));
        return (
          <g key={domain} style={{ cursor: "pointer" }} opacity={dimmed ? 0.3 : 1}
            onClick={() => setSelection(isSelected ? null : { type: "domain", domain, trends: domainTrends })}>
            {isSelected && <circle cx={x} cy={y} r={domR + 6} fill="none" stroke={color} strokeWidth={2} opacity={0.35} />}
            <circle cx={x} cy={y} r={domR} fill={color}
              stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"} strokeWidth={isSelected ? 2.5 : 1}
              filter="url(#nodeShad)" />
            <text x={x} y={y - 5} textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize} fontWeight={800} fill="#fff" fontFamily="'DM Sans', sans-serif">{domain}</text>
            <text x={x} y={y + fontSize + 2} textAnchor="middle" dominantBaseline="middle"
              fontSize={Math.max(7, fontSize * 0.75)} fill="rgba(255,255,255,0.65)" fontFamily="'DM Sans', sans-serif">
              {domainTrends.length} trends
            </text>
          </g>
        );
      })}

      {/* Tension nodes — inner ring, rounded rectangles */}
      {needNodes.map(({ need, x, y }) => {
        const color = NEED_COLORS[need];
        const isSelected = selection?.type === "need" && selection.need === need;
        const dimmed = selection !== null && !isSelected &&
          !(connectedNeeds?.has(need)) && selection.type !== "trend";
        const needTrends = enriched.filter(e => e.need === need).map(e => e.trend);
        const fontSize = Math.min(11, Math.max(8, tensW * 0.125));
        return (
          <g key={need} style={{ cursor: "pointer" }} opacity={dimmed ? 0.3 : 1}
            onClick={() => setSelection(isSelected ? null : { type: "need", need, trends: needTrends })}>
            <rect x={x - tensW / 2} y={y - tensH / 2} width={tensW} height={tensH} rx={tensH / 2}
              fill={isSelected ? `${color}18` : "#fff"}
              stroke={color} strokeWidth={isSelected ? 2.2 : 1.5}
              filter="url(#nodeShad)" />
            <text x={x} y={y - 4} textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize} fontWeight={700} fill={isSelected ? color : "#333"} fontFamily="'DM Sans', sans-serif">{need}</text>
            <text x={x} y={y + fontSize + 2} textAnchor="middle" dominantBaseline="middle"
              fontSize={Math.max(6, fontSize * 0.75)} fill={isSelected ? color : "#aaa"} fontFamily="'DM Sans', sans-serif">
              {needTrends.length} trends
            </text>
          </g>
        );
      })}
    </svg>
  );

  // ── View toggle ───────────────────────────────────────────────────────────────

  const viewToggle = (
    <div style={{
      position: "absolute", top: 12, right: 12, zIndex: 5,
      display: "flex", background: "#f0f0f0", borderRadius: 10, padding: 3, gap: 2,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}>
      {(["card", "map"] as View[]).map(v => (
        <button key={v} onClick={() => setView(v)}
          style={{
            padding: "5px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.02em",
            background: view === v ? "#fff" : "transparent",
            color: view === v ? "#111" : "#999",
            boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
            transition: "all 0.15s",
          }}>
          {v === "card" ? "Grid" : "Map"}
        </button>
      ))}
    </div>
  );

  // ── Sidebar helpers ───────────────────────────────────────────────────────────

  function renderSidebarBody() {
    if (activeSignal) {
      const sigTrend = selection?.type === "trend" ? selection.trend : allTrends.find(t => t.id === activeSignal.trendId);
      return (
        <SignalPopup signal={activeSignal} mode="sidebar"
          trendColor={sigTrend?.color ?? "#888"} trendName={sigTrend?.name ?? ""}
          allSignals={allSignals} onClose={() => setActiveSignal(null)}
          onOpenTrend={sigTrend ? () => { setActiveSignal(null); setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) }); } : undefined}
        />
      );
    }
    if (selection?.type === "trend") {
      return <TrendDetailModal trend={selection.trend} onClose={clearSelection} onSelectSignal={s => setActiveSignal(s)} mode="sidebar" />;
    }
    return listContent;
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff" }}>

      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>

        {/* Canvas / grid area */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "map" ? svgMap : cardGrid}
          {viewToggle}
        </div>

        {/* Desktop right sidebar */}
        {!isMobile && (selection || activeSignal) && (
          <div style={{
            width: "38vw", minWidth: 300, maxWidth: 540, flexShrink: 0,
            background: "#fff", borderLeft: "1px solid rgba(0,0,0,0.07)",
            display: "flex", flexDirection: "column", overflowY: "auto",
          }}>
            {renderSidebarBody()}
          </div>
        )}
      </div>

      {/* Footer — desktop only */}
      {!isMobile && (
        <div style={{
          flexShrink: 0, padding: "7px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(0,0,0,0.05)", background: "#fff",
        }}>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
            {view === "map" ? "Tap a node to reveal its connections" : "Tap a life arena or cultural tension to explore trends"}
          </span>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>{allTrends.length} trends mapped</span>
        </div>
      )}

      {/* Mobile bottom sheet — fixed height for consistency */}
      {isMobile && selection && (
        <>
          <div onClick={clearSelection}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200 }} />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff",
            borderRadius: "20px 20px 0 0", height: "72svh",
            display: "flex", flexDirection: "column", overflow: "hidden",
            zIndex: 201, boxShadow: "0 -8px 48px rgba(0,0,0,0.2)",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "12px auto 0", flexShrink: 0 }} />
            {activeSignal ? (() => {
              const sigTrend = selection?.type === "trend" ? selection.trend : allTrends.find(t => t.id === activeSignal.trendId);
              return (
                <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                  <SignalPopup signal={activeSignal}
                    trendColor={sigTrend?.color ?? "#888"} trendName={sigTrend?.name ?? ""}
                    allSignals={allSignals} onClose={() => setActiveSignal(null)}
                    onOpenTrend={sigTrend ? () => { setActiveSignal(null); setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) }); } : undefined}
                  />
                </div>
              );
            })() : selection?.type === "trend" ? (
              <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                <TrendDetailModal trend={selection.trend} onClose={clearSelection} onSelectSignal={s => setActiveSignal(s)} mode="sidebar" />
              </div>
            ) : listContent}
          </div>
        </>
      )}
    </div>
  );
}
