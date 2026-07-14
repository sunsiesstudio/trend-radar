"use client";

import { useState, useMemo, useEffect } from "react";
import { Trend, Signal } from "@/types";
import { TOPIC_LIBRARY } from "@/lib/extended-trends";
import { SIGNALS } from "@/lib/trends";
import { EXTENDED_SIGNALS } from "@/lib/extended-trends";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";

// ── Life arenas (outer ring) ──────────────────────────────────────────────────

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

// ── Cultural tensions (inner ring) ────────────────────────────────────────────

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
  const [selection,    setSelection]    = useState<Selection>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [isMobile,     setIsMobile]     = useState(false);

  const allSignals = useMemo(() => [...SIGNALS, ...EXTENDED_SIGNALS], []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const enriched = useMemo(() => allTrends.map(t => ({
    trend: t,
    domain: getDomain(t.topics?.[0] ?? ""),
    need:   getTrendNeed(t),
  })), [allTrends]);

  function clearSelection() { setSelection(null); }

  // ── Detail panel content ──────────────────────────────────────────────────────

  const listContent = selection && (selection.type === "need" || selection.type === "domain") && (
    <>
      {/* Sticky header */}
      <div style={{
        padding: "16px 20px 12px", flexShrink: 0,
        borderBottom: "1px solid #f0ede8", background: "#fff",
      }}>
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
          const vibe = DOMAIN_VIBES[selection.domain];
          return vibe ? (
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.55, margin: 0, fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>{vibe}</p>
          ) : null;
        })()}

        {selection.type === "need" && (() => {
          const vibe = TENSION_VIBES[selection.need];
          return vibe ? (
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.55, margin: 0, fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>{vibe}</p>
          ) : null;
        })()}
      </div>

      {/* Scrollable trend list */}
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
                <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{t.relevanceScore ?? 0}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    {t.description.slice(0, 100)}…
                  </div>
                  {(t.techTags ?? []).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                      {(t.techTags ?? []).map(tag => (
                        <span key={tag} style={{ fontSize: 9, fontWeight: 700, color, background: `${color}15`, borderRadius: 20, padding: "2px 7px", letterSpacing: "0.04em" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  // ── Card grid ─────────────────────────────────────────────────────────────────

  const cardGrid = (
    <div style={{
      flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch",
      padding: isMobile ? "20px 16px 24px" : "32px 40px 32px",
    } as React.CSSProperties}>

      {/* Life Arenas */}
      <div style={{ marginBottom: isMobile ? 24 : 32 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#bbb", letterSpacing: "0.14em",
          textTransform: "uppercase", marginBottom: 12,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}>
          Life Arenas
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? 8 : 12,
        }}>
          {CULTURAL_DOMAINS.map(domain => {
            const color = DOMAIN_COLORS[domain];
            const isSelected = selection?.type === "domain" && selection.domain === domain;
            const domainTrends = enriched.filter(e => e.domain === domain).map(e => e.trend);
            return (
              <div
                key={domain}
                onClick={() => setSelection(isSelected ? null : { type: "domain", domain, trends: domainTrends })}
                style={{
                  borderRadius: isMobile ? 14 : 18,
                  padding: isMobile ? "16px 10px" : "20px 14px",
                  background: color,
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  boxShadow: isSelected
                    ? `0 0 0 3px #fff, 0 0 0 5px ${color}, 0 6px 20px ${color}55`
                    : "0 2px 10px rgba(0,0,0,0.10)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                <div style={{
                  fontSize: isMobile ? 13 : 15, fontWeight: 800, color: "#fff",
                  letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {domain}
                </div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.7)",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {domainTrends.length} trends
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cultural Tensions */}
      <div>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#bbb", letterSpacing: "0.14em",
          textTransform: "uppercase", marginBottom: 12,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}>
          Cultural Tensions
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: isMobile ? 8 : 12,
        }}>
          {NEEDS.map(need => {
            const color = NEED_COLORS[need];
            const isSelected = selection?.type === "need" && selection.need === need;
            const needTrends = enriched.filter(e => e.need === need).map(e => e.trend);
            return (
              <div
                key={need}
                onClick={() => setSelection(isSelected ? null : { type: "need", need, trends: needTrends })}
                style={{
                  borderRadius: isMobile ? 14 : 18,
                  padding: isMobile ? "16px 10px" : "20px 14px",
                  background: isSelected ? `${color}14` : "#fff",
                  border: `2px solid ${isSelected ? color : `${color}66`}`,
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${color}33, 0 6px 20px ${color}22`
                    : "0 2px 10px rgba(0,0,0,0.06)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                <div style={{
                  fontSize: isMobile ? 12 : 14, fontWeight: 700,
                  color: isSelected ? color : "#333",
                  letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {need}
                </div>
                <div style={{
                  fontSize: 10, color: isSelected ? color : "#aaa",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {needTrends.length} trends
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff" }}>

      {/* Main row: card grid + optional right panel (desktop only) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>

        {cardGrid}

        {/* Desktop right sidebar */}
        {!isMobile && (selection || activeSignal) && (
          <div style={{
            width: "38vw", minWidth: 300, maxWidth: 540, flexShrink: 0,
            background: "#fff",
            borderLeft: "1px solid rgba(0,0,0,0.07)",
            display: "flex", flexDirection: "column",
            overflowY: "auto",
          }}>
            {activeSignal ? (() => {
              const sigTrend = selection?.type === "trend" ? selection.trend : allTrends.find(t => t.id === activeSignal.trendId);
              return (
                <SignalPopup
                  signal={activeSignal}
                  mode="sidebar"
                  trendColor={sigTrend?.color ?? "#888"}
                  trendName={sigTrend?.name ?? ""}
                  allSignals={allSignals}
                  onClose={() => setActiveSignal(null)}
                  onOpenTrend={sigTrend ? () => { setActiveSignal(null); setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) }); } : undefined}
                />
              );
            })() : selection?.type === "trend" ? (
              <TrendDetailModal
                trend={selection.trend}
                onClose={clearSelection}
                onSelectSignal={(s) => setActiveSignal(s)}
                mode="sidebar"
              />
            ) : listContent}
          </div>
        )}
      </div>

      {/* Footer — desktop only */}
      {!isMobile && (
        <div style={{
          flexShrink: 0, padding: "7px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          borderTop: "1px solid rgba(0,0,0,0.05)", background: "#fff",
        }}>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
            Tap a life arena or cultural tension to explore trends
          </span>
          <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
            {allTrends.length} trends mapped
          </span>
        </div>
      )}

      {/* Mobile bottom sheet — fixed height so it's consistent across domains and tensions */}
      {isMobile && selection && (
        <>
          <div
            onClick={clearSelection}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200 }}
          />
          <div style={{
            position: "fixed", left: 0, right: 0, bottom: 0,
            background: "#fff",
            borderRadius: "20px 20px 0 0",
            height: "72svh",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            zIndex: 201,
            boxShadow: "0 -8px 48px rgba(0,0,0,0.2)",
          }}>
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "12px auto 0", flexShrink: 0 }} />

            {activeSignal ? (() => {
              const sigTrend = selection?.type === "trend" ? selection.trend : allTrends.find(t => t.id === activeSignal.trendId);
              return (
                <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                  <SignalPopup
                    signal={activeSignal}
                    trendColor={sigTrend?.color ?? "#888"}
                    trendName={sigTrend?.name ?? ""}
                    allSignals={allSignals}
                    onClose={() => setActiveSignal(null)}
                    onOpenTrend={sigTrend ? () => { setActiveSignal(null); setSelection({ type: "trend", trend: sigTrend, domain: getDomain(sigTrend.topics?.[0] ?? ""), need: getTrendNeed(sigTrend) }); } : undefined}
                  />
                </div>
              );
            })() : selection?.type === "trend" ? (
              <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                <TrendDetailModal
                  trend={selection.trend}
                  onClose={clearSelection}
                  onSelectSignal={(s) => setActiveSignal(s)}
                  mode="sidebar"
                />
              </div>
            ) : listContent}
          </div>
        </>
      )}

    </div>
  );
}
