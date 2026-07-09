"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Trend } from "@/types";
import { TOPIC_COLORS } from "@/lib/extended-trends";

export const NEEDS = ["Belonging", "Identity", "Meaning", "Status", "Autonomy", "Safety"] as const;
export type Need = typeof NEEDS[number];

const NEED_COLORS: Record<Need, string> = {
  Belonging: "#FF8BB4",
  Identity:  "#8C93C7",
  Meaning:   "#78C9A8",
  Status:    "#FFD65C",
  Autonomy:  "#FD8326",
  Safety:    "#B6D693",
};

const VALID_NEEDS = new Set<string>(NEEDS);

const ZONES = ["emergent", "dominant", "residual"] as const;
type Zone = typeof ZONES[number];

const ZONE_META: Record<Zone, { label: string; sub: string; color: string }> = {
  emergent: { label: "EMERGENT",  sub: "avant-garde · early adopters",      color: "#78C9A8" },
  dominant: { label: "DOMINANT",  sub: "mainstream · mass brands can enter", color: "#FFD65C" },
  residual: { label: "RESIDUAL",  sub: "saturating · becoming cliché",       color: "#FD8326" },
};

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

function parseZone(trajectory?: string): Zone {
  const t = (trajectory ?? "").toLowerCase();
  if (/peak|saturat|matur|declin|plateau|widespread|overdo|waning|slow/.test(t)) return "residual";
  if (/accelerat|pick.*up|growing|fast|rapid|mainstream|mass|expand|scal|broad/.test(t)) return "dominant";
  return "emergent";
}

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b) >>> 0; h ^= h >>> 16;
  return h;
}

interface Props { trends: Trend[]; topics: string[] }

export function CultureMap({ trends, topics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 520 });
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

  const plotData = useMemo(() =>
    trends.map(trend => ({
      trend,
      need: getTrendNeed(trend),
      zone: parseZone(trend.trajectory),
    })),
  [trends]);

  if (topics.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, background: "#F5F2EC" }}>
        <div style={{ fontSize: 32, opacity: 0.2 }}>◎</div>
        <div style={{ fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif", textAlign: "center", lineHeight: 1.6 }}>
          Switch to <strong style={{ color: "#888" }}>Radar</strong> and add a topic<br />to populate the culture map
        </div>
      </div>
    );
  }

  const { w, h } = dims;
  const PAD_L = Math.min(124, w * 0.14);
  const PAD_R = 18;
  const PAD_T = 18;
  const PAD_B = 56;

  const chartW = w - PAD_L - PAD_R;
  const chartH = h - PAD_T - PAD_B;
  const zoneH  = chartH / 3;
  const needW  = chartW / NEEDS.length;

  const zoneTop: Record<Zone, number> = {
    emergent: PAD_T,
    dominant: PAD_T + zoneH,
    residual: PAD_T + zoneH * 2,
  };

  // Place each trend as a bubble; use hash for stable jitter within its cell
  const bubbles = plotData.map(({ trend, need, zone }) => {
    const needIdx = NEEDS.indexOf(need);
    const h1 = fnv(trend.id + "x");
    const h2 = fnv(trend.id + "y");
    const jx = ((h1 % 10000) / 10000 - 0.5) * needW * 0.52;
    const jy = ((h2 % 10000) / 10000 - 0.5) * zoneH * 0.52;
    const cx = PAD_L + (needIdx + 0.5) * needW + jx;
    const cy = zoneTop[zone] + zoneH * 0.5 + jy;
    const r  = 11 + (trend.relevanceScore / 100) * 16;
    const color = TOPIC_COLORS[trend.topics?.[0] ?? ""] ?? trend.color ?? "#bbb";
    return { trend, need, zone, cx, cy, r, color };
  });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      {/* Chart canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>

          {/* Zone background bands */}
          {ZONES.map(zone => {
            const { color, label, sub } = ZONE_META[zone];
            const ty = zoneTop[zone];
            return (
              <g key={zone}>
                <rect x={PAD_L} y={ty} width={chartW} height={zoneH}
                  fill={color + "14"} />
                {/* Divider line (not for top zone) */}
                {zone !== "emergent" && (
                  <line x1={PAD_L} y1={ty} x2={PAD_L + chartW} y2={ty}
                    stroke="#ddd" strokeWidth={1} strokeDasharray="4 6" />
                )}
                {/* Zone label block on left */}
                <text x={PAD_L - 10} y={ty + zoneH / 2 - 7}
                  textAnchor="end" fontSize={9} fontWeight={700} fill={color}
                  letterSpacing="0.08em" fontFamily="'DM Sans', sans-serif">
                  {label}
                </text>
                <text x={PAD_L - 10} y={ty + zoneH / 2 + 8}
                  textAnchor="end" fontSize={8} fill={color + "99"}
                  fontFamily="'DM Sans', sans-serif">
                  {sub}
                </text>
              </g>
            );
          })}

          {/* Vertical need guides + bottom labels */}
          {NEEDS.map((need, i) => {
            const x = PAD_L + (i + 0.5) * needW;
            const color = NEED_COLORS[need];
            return (
              <g key={need}>
                <line x1={x} y1={PAD_T} x2={x} y2={PAD_T + chartH}
                  stroke={color + "40"} strokeWidth={1} strokeDasharray="2 8" />
                <circle cx={x} cy={PAD_T + chartH + 18} r={4} fill={color} />
                <text x={x} y={PAD_T + chartH + 34}
                  textAnchor="middle" fontSize={9} fontWeight={600} fill="#888"
                  fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

          {/* Bubbles */}
          {bubbles.map(({ trend, need, cx, cy, r, color }, idx) => {
            const isSelected = selected?.id === trend.id;
            // Two-word label for larger bubbles
            const words = trend.name.split(" ");
            const labelLine1 = words.slice(0, 2).join(" ");
            const labelLine2 = words.length > 2 ? words.slice(2, 4).join(" ") : null;
            return (
              <g key={`${trend.id}-${need}-${idx}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(isSelected ? null : trend)}>
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r={r + 5} fill="none"
                    stroke={color} strokeWidth={2} opacity={0.4} />
                )}
                <circle cx={cx} cy={cy} r={r}
                  fill={color + (isSelected ? "ee" : "bb")}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1.5} />
                {r >= 16 && (
                  <>
                    <text x={cx} y={cy + (labelLine2 ? 0 : 4)}
                      textAnchor="middle"
                      fontSize={Math.min(8, r * 0.44)} fontWeight={700} fill="#fff"
                      style={{ pointerEvents: "none" }}
                      fontFamily="'DM Sans', sans-serif">
                      {labelLine1}
                    </text>
                    {labelLine2 && (
                      <text x={cx} y={cy + 11}
                        textAnchor="middle"
                        fontSize={Math.min(7, r * 0.4)} fontWeight={600} fill="rgba(255,255,255,0.8)"
                        style={{ pointerEvents: "none" }}
                        fontFamily="'DM Sans', sans-serif">
                        {labelLine2}
                      </text>
                    )}
                  </>
                )}
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
          padding: "12px 20px 14px", maxHeight: 160, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: selected.color }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>
                {selected.name}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.07em",
                color: ZONE_META[parseZone(selected.trajectory)].color,
                background: ZONE_META[parseZone(selected.trajectory)].color + "22",
                border: `1px solid ${ZONE_META[parseZone(selected.trajectory)].color}55`,
                padding: "2px 8px", borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {ZONE_META[parseZone(selected.trajectory)].label}
              </span>
              <span style={{ fontSize: 9, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
                {getTrendNeed(selected)}
              </span>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", fontSize: 18, color: "#bbb", cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
          <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>
            {selected.description}
          </p>
          {selected.trajectory && (
            <p style={{ fontSize: 11, color: "#999", fontStyle: "italic", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              {selected.trajectory.slice(0, 180)}{selected.trajectory.length > 180 ? "…" : ""}
            </p>
          )}
        </div>
      )}

      {/* Footer legend */}
      <div style={{
        flexShrink: 0, padding: "7px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {topics.map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: TOPIC_COLORS[t] ?? "#bbb" }} />
              <span style={{ fontSize: 10, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                {t.replace(/-/g, " ")}
              </span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          Size = relevance · tap to explore
        </span>
      </div>
    </div>
  );
}
