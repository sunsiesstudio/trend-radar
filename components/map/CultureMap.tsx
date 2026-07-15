"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend, Signal } from "@/types";
import { EXTENDED_TRENDS, EXTENDED_SIGNALS } from "@/lib/extended-trends";
import { SIGNALS } from "@/lib/trends";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { BlobRadarView } from "@/components/map/BlobRadarView";

// ── Life arenas ───────────────────────────────────────────────────────────────

const CULTURAL_DOMAINS = [
  "Body", "Home", "Work", "Play", "Style",
  "Food", "Community", "Mind", "Nature",
] as const;
type CulturalDomain = typeof CULTURAL_DOMAINS[number];

const DOMAIN_COLORS: Record<CulturalDomain, string> = {
  Body:      "#FFC0C0",  // Peony Bundle
  Home:      "#F4D242",  // Pure Sun
  Work:      "#80B0E8",  // Airplane View
  Play:      "#D6D35F",  // Limeade
  Style:     "#C45F3F",  // Tomato Jam
  Food:      "#D1CAEA",  // Autumn Lavender
  Community: "#008471",  // Tropical Rain
  Mind:      "#D1CAEA",  // Autumn Lavender
  Nature:    "#898E46",  // Monet Ponds
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

// ── Cultural tensions ─────────────────────────────────────────────────────────

const NEEDS = ["Control", "Connection", "Escape", "Recognition", "Authenticity", "Resilience"] as const;
type Need = typeof NEEDS[number];

const NEED_COLORS: Record<Need, string> = {
  Control:      "#C45F3F",  // Tomato Jam
  Connection:   "#FFC0C0",  // Peony Bundle
  Escape:       "#80B0E8",  // Airplane View
  Recognition:  "#F4D242",  // Pure Sun
  Authenticity: "#D6D35F",  // Limeade
  Resilience:   "#898E46",  // Monet Ponds
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
  | { type: "need";   need: Need;             trends: Trend[] }
  | { type: "domain"; domain: CulturalDomain; trends: Trend[] }
  | { type: "trend";  trend: Trend; domain: CulturalDomain; need: Need }
  | null;

type View = "map" | "radar";

interface Props {
  dynamicTrends:   Trend[];
  activeTopics:    string[];
  extraSignals?:   Signal[];
  topicAddedAt?:   Record<string, string>;
  generatingTopic?: string | null;
  onAddTopic:      (topic: string) => void;
  onRemoveTopic:   (topic: string) => void;
  view:            "map" | "radar";
  onSetView:       (v: "map" | "radar") => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function blobFromId(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b) >>> 0; h ^= h >>> 16;
  let g = 0x811c9dc5 ^ id.length;
  for (let i = id.length - 1; i >= 0; i--) { g ^= id.charCodeAt(i); g = Math.imul(g, 0x01000193) >>> 0; }
  g ^= g >>> 16; g = Math.imul(g, 0x45d9f3b) >>> 0; g ^= g >>> 16;
  const v = (seed: number) => 28 + (seed % 52);
  return `${v(h & 0xff)}% ${v((h >> 8) & 0xff)}% ${v((h >> 16) & 0xff)}% ${v((h >>> 24) & 0xff)}% / ${v(g & 0xff)}% ${v((g >> 8) & 0xff)}% ${v((g >> 16) & 0xff)}% ${v((g >>> 24) & 0xff)}%`;
}

function darkenColor(hex: string, factor = 0.62): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function edgePts(x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  return { sx: x1 + ux * r1, sy: y1 + uy * r1, ex: x2 - ux * r2, ey: y2 - uy * r2 };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CultureMap({ dynamicTrends, activeTopics, extraSignals, topicAddedAt, generatingTopic, onAddTopic, onRemoveTopic, view, onSetView }: Props) {
  const containerRef      = useRef<HTMLDivElement>(null);
  const sheetRef          = useRef<HTMLDivElement>(null);
  const [dims,         setDims]         = useState({ w: 900, h: 600 });
  const [selection,    setSelection]    = useState<Selection>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [isMobile,     setIsMobile]     = useState(false);
  const [sheetOffset,  setSheetOffset]  = useState(0);
  const [mapScale,     setMapScale]     = useState(1);
  const touchStartY       = useRef<number>(0);
  const isDragging        = useRef(false);
  const sheetOffsetRef    = useRef(0);
  const clearSelectionRef = useRef<() => void>(() => {});
  const pinchRef          = useRef<{ dist: number; scale: number } | null>(null);

  // Clear panel state and reset zoom when switching views
  useEffect(() => { setSelection(null); setActiveSignal(null); setSheetOffset(0); setMapScale(1); }, [view]);

  // Wheel zoom on map
  useEffect(() => {
    const el = containerRef.current;
    if (!el || view !== "map") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setMapScale(s => Math.min(3, Math.max(0.35, s * (e.deltaY < 0 ? 1.1 : 0.91))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [view]);

  const allSignals = useMemo(() => {
    const base = [...SIGNALS, ...EXTENDED_SIGNALS];
    if (!extraSignals?.length) return base;
    const extraIds = new Set(extraSignals.map(s => s.id));
    return [...extraSignals, ...base.filter(s => !extraIds.has(s.id))];
  }, [extraSignals]);

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
    if (dynamicTrends.length > 0) return dynamicTrends;
    const seen = new Set<string>();
    return EXTENDED_TRENDS.filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
  }, [dynamicTrends]);

  const enriched = useMemo(() => allTrends.map(t => ({
    trend: t, domain: getDomain(t.topics?.[0] ?? ""), need: getTrendNeed(t),
  })), [allTrends]);

  // Groups used by the radar chord lines
  const groups = useMemo(() => {
    const map = new Map<string, { domain: CulturalDomain; need: Need; trends: Trend[] }>();
    enriched.forEach(({ trend, domain, need }) => {
      const key = `${domain}--${need}`;
      if (!map.has(key)) map.set(key, { domain, need, trends: [] });
      map.get(key)!.trends.push(trend);
    });
    return [...map.values()];
  }, [enriched]);

  const maxCount = Math.max(1, ...groups.map(g => g.trends.length));

  function clearSelection() { setSelection(null); setActiveSignal(null); setSheetOffset(0); }
  clearSelectionRef.current = clearSelection;

  // Non-passive touchmove on the sheet so we can call preventDefault and prevent
  // native scroll while dragging the sheet down to dismiss.
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
      sheetOffsetRef.current = 0;
      setSheetOffset(0);
    };

    const onMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchStartY.current;
      if (!isDragging.current) {
        if (dy < 10) return;
        // Only start sheet-drag when no scrollable ancestor inside the sheet is scrolled
        let node = e.target as HTMLElement | null;
        while (node && node !== el) {
          if (node.scrollTop > 0) return;
          node = node.parentElement;
        }
        isDragging.current = true;
      }
      e.preventDefault();
      const offset = Math.max(0, dy);
      sheetOffsetRef.current = offset;
      setSheetOffset(offset);
    };

    const onEnd = () => {
      isDragging.current = false;
      if (sheetOffsetRef.current > 80) {
        clearSelectionRef.current();
      }
      sheetOffsetRef.current = 0;
      setSheetOffset(0);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  // ── Shared geometry ───────────────────────────────────────────────────────────

  const { w, h } = dims;
  const cx = w / 2, cy = h / 2;
  const minDim = Math.min(w, h);
  const portrait = h > w * 1.15;

  // Outer ring (domains)
  const domR = Math.min(minDim < 600 ? 56 : 70, Math.max(34, minDim * 0.105));
  const PAD  = 14;
  const maxRx = w / 2 - domR - PAD;
  const maxRy = h / 2 - domR - PAD;
  const baseR = Math.min(maxRx, maxRy);
  const outerRx = portrait ? maxRx : baseR;
  const outerRy = portrait ? Math.min(maxRy, maxRx * Math.min(h / w, 1.35)) : baseR;

  // Inner ring (tensions) — ~43% of outer radius
  const INNER_RATIO = 0.43;
  const innerRx = outerRx * INNER_RATIO;
  const innerRy = outerRy * INNER_RATIO;
  const needR   = Math.min(44, Math.max(26, Math.min(innerRx, innerRy) * 0.72));
  // Pill width for map view
  const pillW = needR * 2.4;
  const pillH = needR * 1.1;

  const domainNodes = CULTURAL_DOMAINS.map((domain, i) => {
    const angle = (i / CULTURAL_DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
    return { domain, x: cx + outerRx * Math.cos(angle), y: cy + outerRy * Math.sin(angle) };
  });

  const needNodes = NEEDS.map((need, i) => {
    const angle = (i / NEEDS.length) * Math.PI * 2 - Math.PI / 2;
    return { need, x: cx + innerRx * Math.cos(angle), y: cy + innerRy * Math.sin(angle) };
  });

  // Which nodes connect to the current selection (for map view on-demand lines + radar dimming)
  const selDomain = selection?.type === "domain" ? selection.domain
    : selection?.type === "trend" ? selection.domain : null;
  const selNeed   = selection?.type === "need" ? selection.need
    : selection?.type === "trend" ? selection.need : null;
  const connNeeds   = selDomain ? new Set(enriched.filter(e => e.domain === selDomain).map(e => e.need)) : null;
  const connDomains = selNeed   ? new Set(enriched.filter(e => e.need   === selNeed  ).map(e => e.domain)) : null;

  function isHighlighted(domain: CulturalDomain, need: Need) {
    if (!selection) return false;
    if (selection.type === "need")   return selection.need === need;
    if (selection.type === "domain") return selection.domain === domain;
    if (selection.type === "trend")  return selection.domain === domain && selection.need === need;
    return false;
  }

  // ── Detail panel ─────────────────────────────────────────────────────────────

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

  // ── Map view (spatial, on-demand connections) ─────────────────────────────────

  const onPinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinchRef.current = { dist: Math.hypot(dx, dy), scale: mapScale };
    }
  };
  const onPinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      setMapScale(Math.min(3, Math.max(0.35, pinchRef.current.scale * (dist / pinchRef.current.dist))));
    }
  };
  const onPinchEnd = () => { pinchRef.current = null; };

  const svgMap = (
    <div
      onTouchStart={onPinchStart}
      onTouchMove={onPinchMove}
      onTouchEnd={onPinchEnd}
      style={{ position: "absolute", inset: 0, transform: `scale(${mapScale})`, transformOrigin: "50% 50%" }}
    >
      {/* SVG — connection lines only; pointer-events off so HTML blobs receive clicks */}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}>
        {/* Connection lines — revealed on selection only */}
        {selDomain && connNeeds && needNodes.map(({ need, x: nx, y: ny }) => {
          if (!connNeeds.has(need)) return null;
          const dn = domainNodes.find(n => n.domain === selDomain)!;
          const { sx, sy, ex, ey } = edgePts(dn.x, dn.y, nx, ny, domR, needR);
          return <line key={need} x1={sx} y1={sy} x2={ex} y2={ey}
            stroke={DOMAIN_COLORS[selDomain]} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />;
        })}
        {selNeed && connDomains && domainNodes.map(({ domain, x: dx, y: dy }) => {
          if (!connDomains.has(domain)) return null;
          const nn = needNodes.find(n => n.need === selNeed)!;
          const { sx, sy, ex, ey } = edgePts(dx, dy, nn.x, nn.y, domR, needR);
          return <line key={domain} x1={sx} y1={sy} x2={ex} y2={ey}
            stroke={DOMAIN_COLORS[domain]} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />;
        })}
      </svg>

      {/* Need blobs — inner ring */}
      {needNodes.map(({ need, x, y }) => {
        const color = NEED_COLORS[need];
        const isSel = selection?.type === "need" && selection.need === need;
        const dimmed = selection !== null && !isSel && !connNeeds?.has(need) && selection.type !== "trend";
        const needTrends = enriched.filter(e => e.need === need).map(e => e.trend);
        const fs = Math.min(10, Math.max(7, needR * 0.30));
        const fillColor = darkenColor(color, isSel ? 0.68 : 0.82);
        return (
          <div
            key={need}
            onClick={() => setSelection(isSel ? null : { type: "need", need, trends: needTrends })}
            style={{
              position: "absolute",
              left: x - needR,
              top: y - needR,
              width: needR * 2,
              height: needR * 2,
              borderRadius: blobFromId(need),
              background: fillColor,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 4,
              boxSizing: "border-box",
              cursor: "pointer",
              opacity: dimmed ? 0.25 : 1,
              boxShadow: isSel ? `0 0 0 3px ${color}, 0 4px 18px ${color}66` : `0 3px 14px ${color}44`,
              transition: "opacity 0.2s, box-shadow 0.15s",
              userSelect: "none",
            } as React.CSSProperties}
          >
            <div style={{ fontSize: fs, fontWeight: 800, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif" }}>{need}</div>
            <div style={{ fontSize: Math.max(6, fs * 0.78), color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{needTrends.length} trends</div>
          </div>
        );
      })}

      {/* Domain blobs — outer ring, stroke-only */}
      {domainNodes.map(({ domain, x, y }) => {
        const color = DOMAIN_COLORS[domain];
        const isSel = selection?.type === "domain" && selection.domain === domain;
        const dimmed = selection !== null && !isSel && !connDomains?.has(domain) && selection.type !== "trend";
        const domainTrends = enriched.filter(e => e.domain === domain).map(e => e.trend);
        const fs = Math.min(12, Math.max(9, domR * 0.27));
        const strokeColor = darkenColor(color, isSel ? 0.62 : 0.72);
        return (
          <div
            key={domain}
            onClick={() => setSelection(isSel ? null : { type: "domain", domain, trends: domainTrends })}
            style={{
              position: "absolute",
              left: x - domR,
              top: y - domR,
              width: domR * 2,
              height: domR * 2,
              borderRadius: blobFromId(domain),
              background: isSel ? `${color}22` : "transparent",
              border: `2.5px solid ${strokeColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 6,
              boxSizing: "border-box",
              cursor: "pointer",
              opacity: dimmed ? 0.28 : 1,
              boxShadow: isSel ? `0 0 0 3px ${color}66, 0 6px 24px ${color}44` : "none",
              transition: "opacity 0.2s, box-shadow 0.15s",
              userSelect: "none",
            } as React.CSSProperties}
          >
            <div style={{ fontSize: fs, fontWeight: 800, color: strokeColor, lineHeight: 1.18, letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif" }}>{domain}</div>
            <div style={{ fontSize: Math.max(7, fs * 0.78), color: strokeColor + "aa", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{domainTrends.length} trends</div>
          </div>
        );
      })}
    </div>
  );

  // ── Radar view (blob canvas) ──────────────────────────────────────────────────

  const blobRadar = (
    <BlobRadarView
      trends={dynamicTrends}
      signals={allSignals}
      topicAddedAt={topicAddedAt}
      activeTopics={activeTopics}
      generatingTopic={generatingTopic}
      onAddTopic={onAddTopic}
      onRemoveTopic={onRemoveTopic}
      onSelectTrend={(trend) => setSelection({ type: "trend", trend, domain: getDomain(trend.topics?.[0] ?? ""), need: getTrendNeed(trend) })}
      onSelectSignal={(sig) => {
        setActiveSignal(sig);
        const sigTrend = allTrends.find(t => t.id === sig.trendId);
        if (sigTrend) setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) });
      }}
    />
  );

  // ── Sidebar helpers ───────────────────────────────────────────────────────────

  function renderSidebarBody() {
    if (activeSignal) {
      const sigTrend = allTrends.find(t => t.id === activeSignal.trendId);
      return (
        <SignalPopup signal={activeSignal} mode="sidebar"
          trendColor={sigTrend?.color ?? "#888"} trendName={sigTrend?.name ?? ""}
          allSignals={allSignals} onClose={() => setActiveSignal(null)}
          onSelectSignal={s => setActiveSignal(s)}
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

  const footerHints: Record<View, string> = {
    map:   "Tap a node to reveal its connections",
    radar: "Tap a trend blob to explore it · pinch or scroll to zoom",
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>

        {/* Canvas area */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {view === "map"   ? svgMap    : null}
          {view === "radar" ? blobRadar : null}
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

      {!isMobile && (
        <div style={{
          flexShrink: 0, padding: "7px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(0,0,0,0.05)", background: "#fff",
        }}>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>{footerHints[view]}</span>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>{allTrends.length} trends mapped</span>
        </div>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && selection && (
        <>
          <div onClick={clearSelection}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200 }} />
          <div ref={sheetRef} style={{
            position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff",
            borderRadius: "20px 20px 0 0", height: "calc(100svh - 56px)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            zIndex: 201, boxShadow: "0 -8px 48px rgba(0,0,0,0.2)",
            transform: `translateY(${Math.max(0, sheetOffset)}px)`,
            transition: isDragging.current ? "none" : "transform 0.25s ease",
          }}>
            {/* Drag handle — visual only, touch handled on whole sheet */}
            <div
              onClick={clearSelection}
              style={{ width: "100%", padding: "16px 0 8px", display: "flex", justifyContent: "center", cursor: "grab", flexShrink: 0 }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd" }} />
            </div>
            {activeSignal ? (() => {
              const sigTrend = allTrends.find(t => t.id === activeSignal.trendId);
              return (
                <SignalPopup signal={activeSignal} mode="sidebar"
                  trendColor={sigTrend?.color ?? "#888"} trendName={sigTrend?.name ?? ""}
                  allSignals={allSignals} onClose={() => setActiveSignal(null)}
                  onSelectSignal={s => setActiveSignal(s)}
                  onOpenTrend={sigTrend ? () => { setActiveSignal(null); setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) }); } : undefined}
                />
              );
            })() : selection?.type === "trend" ? (
              <TrendDetailModal trend={selection.trend} onClose={clearSelection} onSelectSignal={s => setActiveSignal(s)} mode="sidebar" />
            ) : listContent}
          </div>
        </>
      )}
    </div>
  );
}
