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

function inferNeeds(trend: Trend): Need[] {
  const text = `${trend.name} ${trend.description} ${trend.culturalContext ?? ""}`.toLowerCase();
  const found: Need[] = [];
  if (/belong|community|connect|together|friend|tribe|shared|relation|dating|loneliness/.test(text)) found.push("Belonging");
  if (/identity|self|authentic|express|personal|individual|profile|avatar|represent/.test(text)) found.push("Identity");
  if (/meaning|purpose|value|why|deeper|spiritual|signif|fulfill|ritual|belief/.test(text)) found.push("Meaning");
  if (/status|prestige|signal|flex|luxury|aspirat|rank|exclusive|premium|clout/.test(text)) found.push("Status");
  if (/autonom|freedom|control|choice|independ|agency|decentrali|ownership/.test(text)) found.push("Autonomy");
  if (/safe|nostalg|familiar|comfort|tradition|trust|secure|anchor|roots|slow/.test(text)) found.push("Safety");
  if (found.length === 0) found.push("Meaning");
  return found.slice(0, 2);
}

function getTrendNeeds(trend: Trend): Need[] {
  const explicit = (trend.needs ?? []).filter(n => VALID_NEEDS.has(n)) as Need[];
  return explicit.length > 0 ? explicit : inferNeeds(trend);
}

interface Intersection { topic: string; need: Need; trends: Trend[] }

interface Props { trends: Trend[]; topics: string[] }

export function CultureMap({ trends, topics }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 560 });
  const [selected, setSelected] = useState<Intersection | null>(null);

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

  const intersections = useMemo(() => {
    const map: Record<string, Trend[]> = {};
    trends.forEach(trend => {
      (trend.topics ?? []).forEach(topic => {
        if (!topics.includes(topic)) return;
        getTrendNeeds(trend).forEach(need => {
          const key = `${topic}--${need}`;
          if (!map[key]) map[key] = [];
          if (!map[key].find(t => t.id === trend.id)) map[key].push(trend);
        });
      });
    });
    return map;
  }, [trends, topics]);

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
  const PAD_X = Math.min(160, w * 0.18);
  const PAD_Y = 60;

  // Topic nodes — left column, evenly spaced
  const topicSpacing = topics.length > 1 ? Math.min(110, (h - PAD_Y * 2) / (topics.length - 1)) : 0;
  const topicStartY  = h / 2 - topicSpacing * (topics.length - 1) / 2;
  const topicX = PAD_X;
  const topicNodeR = Math.min(46, Math.max(32, topicSpacing * 0.4));

  // Need nodes — right column, evenly spaced
  const needSpacing = Math.min(82, (h - PAD_Y * 2) / (NEEDS.length - 1));
  const needStartY  = h / 2 - needSpacing * (NEEDS.length - 1) / 2;
  const needX = w - PAD_X;
  const needNodeR = Math.min(38, Math.max(28, needSpacing * 0.42));

  const topicPositions = topics.map((topic, i) => ({
    topic, x: topicX, y: topicStartY + i * topicSpacing,
  }));
  const needPositions = NEEDS.map((need, i) => ({
    need, x: needX, y: needStartY + i * needSpacing,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>
      {/* Map canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
          {/* Background web lines */}
          {topicPositions.map(tp =>
            needPositions.map(np => (
              <line
                key={`web-${tp.topic}-${np.need}`}
                x1={tp.x} y1={tp.y} x2={np.x} y2={np.y}
                stroke="#ccc" strokeWidth={0.7} opacity={0.45}
              />
            ))
          )}

          {/* Active lines + dots */}
          {topicPositions.map(tp =>
            needPositions.map(np => {
              const key = `${tp.topic}--${np.need}`;
              const matched = intersections[key];
              if (!matched?.length) return null;
              const count = matched.length;
              const dotX = tp.x + (np.x - tp.x) * 0.5;
              const dotY = tp.y + (np.y - tp.y) * 0.5;
              const r = 9 + Math.min(count - 1, 4) * 2;
              const isSelected = selected?.topic === tp.topic && selected?.need === np.need;
              return (
                <g key={`act-${tp.topic}-${np.need}`}>
                  <line
                    x1={tp.x} y1={tp.y} x2={np.x} y2={np.y}
                    stroke={NEED_COLORS[np.need]}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={isSelected ? 1 : 0.55}
                  />
                  <circle
                    cx={dotX} cy={dotY} r={r}
                    fill={NEED_COLORS[np.need]}
                    opacity={isSelected ? 1 : 0.85}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelected(isSelected ? null : { topic: tp.topic, need: np.need, trends: matched })}
                  />
                  <text x={dotX} y={dotY + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" style={{ pointerEvents: "none" }}>
                    {count}
                  </text>
                </g>
              );
            })
          )}

          {/* Topic nodes */}
          {topicPositions.map(({ topic, x, y }) => {
            const color = TOPIC_COLORS[topic] ?? "#bbb";
            const label = topic.replace(/-/g, " ");
            return (
              <g key={topic}>
                <circle cx={x} cy={y} r={topicNodeR} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={Math.min(12, topicNodeR * 0.28)} fontWeight={600} fill="#111" fontFamily="'DM Sans', sans-serif"
                  style={{ textTransform: "capitalize" }}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Need nodes */}
          {needPositions.map(({ need, x, y }) => {
            const color = NEED_COLORS[need];
            const active = NEEDS.some(n => n === need && topics.some(t => (intersections[`${t}--${need}`]?.length ?? 0) > 0));
            return (
              <g key={need}>
                <circle cx={x} cy={y} r={needNodeR} fill="#fff" stroke={active ? color : "#ddd"} strokeWidth={active ? 1.5 : 1} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={Math.min(11, needNodeR * 0.3)} fontWeight={500} fill={active ? "#111" : "#bbb"} fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

          {/* Column labels */}
          <text x={topicX} y={PAD_Y * 0.55} textAnchor="middle" fontSize={9} fontWeight={700} fill="#bbb" letterSpacing={1} fontFamily="'DM Sans', sans-serif" style={{ textTransform: "uppercase" }}>
            TOPICS
          </text>
          <text x={needX} y={PAD_Y * 0.55} textAnchor="middle" fontSize={9} fontWeight={700} fill="#bbb" letterSpacing={1} fontFamily="'DM Sans', sans-serif" style={{ textTransform: "uppercase" }}>
            HUMAN NEEDS
          </text>
        </svg>
      </div>

      {/* Selected intersection panel */}
      {selected && (
        <div style={{
          flexShrink: 0, background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "12px 20px", maxHeight: 180, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: NEED_COLORS[selected.need], display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>
                {selected.topic.replace(/-/g, " ")} activates <em>{selected.need}</em>
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>— {selected.trends.length} trend{selected.trends.length !== 1 ? "s" : ""}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, color: "#aaa", cursor: "pointer" }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.trends.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{t.description.slice(0, 130)}…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: legend + hint */}
      <div style={{
        flexShrink: 0, padding: "8px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {NEEDS.map(need => (
            <div key={need} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: NEED_COLORS[need] }} />
              <span style={{ fontSize: 10, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>{need}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}>
          Dots = trends. Tap to explore.
        </span>
      </div>
    </div>
  );
}
