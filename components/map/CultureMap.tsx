"use client";

import { useState, useMemo } from "react";
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
  if (/belong|community|connect|together|social|friend|tribe|shared|relation|dating|loneliness/.test(text)) found.push("Belonging");
  if (/identity|self|who|authentic|express|personal|individual|profile|avatar|represent/.test(text)) found.push("Identity");
  if (/meaning|purpose|value|why|deeper|spiritual|signif|fulfill|ritual|belief/.test(text)) found.push("Meaning");
  if (/status|prestige|signal|flex|luxury|aspirat|rank|exclusive|premium|clout/.test(text)) found.push("Status");
  if (/autonom|freedom|control|choice|independ|agency|decentrali|ownership|sovereign/.test(text)) found.push("Autonomy");
  if (/safe|nostalg|familiar|comfort|tradition|trust|secure|anchor|roots|slow/.test(text)) found.push("Safety");
  if (found.length === 0) found.push("Meaning");
  return found.slice(0, 2);
}

function getTrendNeeds(trend: Trend): Need[] {
  const explicit = (trend.needs ?? []).filter(n => VALID_NEEDS.has(n)) as Need[];
  return explicit.length > 0 ? explicit : inferNeeds(trend);
}

function ringPos(idx: number, total: number, cx: number, cy: number, r: number, offsetAngle = -Math.PI / 2) {
  const angle = offsetAngle + (idx / total) * Math.PI * 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

interface Intersection {
  topic: string;
  need: Need;
  trends: Trend[];
}

interface Props {
  trends: Trend[];
  topics: string[];
}

export function CultureMap({ trends, topics }: Props) {
  const [selected, setSelected] = useState<Intersection | null>(null);

  const W = 800, H = 660;
  const cx = W / 2, cy = H / 2 - 10;
  const NEED_R  = 128;
  const TOPIC_R = 295;
  const NEED_NODE_R  = 42;
  const TOPIC_NODE_R = 54;

  const needPositions = useMemo(() =>
    NEEDS.map((need, i) => ({ need, ...ringPos(i, NEEDS.length, cx, cy, NEED_R) })),
    [cx, cy]
  );

  const topicPositions = useMemo(() =>
    topics.map((topic, i) => ({ topic, ...ringPos(i, topics.length, cx, cy, TOPIC_R) })),
    [topics, cx, cy]
  );

  const intersections = useMemo(() => {
    const map: Record<string, Trend[]> = {};
    trends.forEach(trend => {
      const trendTopics = trend.topics ?? [];
      const trendNeeds  = getTrendNeeds(trend);
      trendTopics.forEach(topic => {
        if (!topics.includes(topic)) return;
        trendNeeds.forEach(need => {
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#aaa" }}>
        <div style={{ fontSize: 32 }}>◎</div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Add a topic on the Radar to see the culture map</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "100%", maxWidth: W, maxHeight: H }}
        >
          {/* Background web lines */}
          {topicPositions.map(tp =>
            needPositions.map(np => (
              <line
                key={`web-${tp.topic}-${np.need}`}
                x1={tp.x} y1={tp.y} x2={np.x} y2={np.y}
                stroke="#ccc" strokeWidth={0.6} opacity={0.5}
              />
            ))
          )}

          {/* Active lines + dots for intersections with trends */}
          {topicPositions.map(tp =>
            needPositions.map(np => {
              const key = `${tp.topic}--${np.need}`;
              const matched = intersections[key];
              if (!matched?.length) return null;
              const count = matched.length;
              const dotX = tp.x + (np.x - tp.x) * 0.52;
              const dotY = tp.y + (np.y - tp.y) * 0.52;
              const r = 9 + Math.min(count - 1, 4) * 2;
              const isSelected = selected?.topic === tp.topic && selected?.need === np.need;
              return (
                <g key={`active-${tp.topic}-${np.need}`}>
                  <line
                    x1={tp.x} y1={tp.y} x2={np.x} y2={np.y}
                    stroke={NEED_COLORS[np.need]}
                    strokeWidth={isSelected ? 2 : 1.2}
                    opacity={isSelected ? 0.9 : 0.55}
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

          {/* Need nodes (inner) */}
          {needPositions.map(({ need, x, y }) => {
            const color = NEED_COLORS[need];
            const active = Object.keys(intersections).some(k => k.endsWith(`--${need}`) && intersections[k].length > 0);
            return (
              <g key={need}>
                <circle cx={x} cy={y} r={NEED_NODE_R} fill="#fff" stroke={active ? color : "#ddd"} strokeWidth={active ? 1.5 : 1} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={11} fontWeight={500} fill={active ? "#111" : "#aaa"} fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

          {/* Topic nodes (outer) */}
          {topicPositions.map(({ topic, x, y }) => {
            const color = TOPIC_COLORS[topic] ?? "#bbb";
            const label = topic.replace(/-/g, " ");
            const words = label.split(" ");
            return (
              <g key={topic}>
                <circle cx={x} cy={y} r={TOPIC_NODE_R} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
                {words.length === 1
                  ? <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#111" fontFamily="'DM Sans', sans-serif">{label}</text>
                  : <>
                      <text x={x} y={y - 3} textAnchor="middle" fontSize={11} fontWeight={600} fill="#111" fontFamily="'DM Sans', sans-serif">{words[0]}</text>
                      <text x={x} y={y + 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="#111" fontFamily="'DM Sans', sans-serif">{words.slice(1).join(" ")}</text>
                    </>
                }
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected intersection panel */}
      {selected && (
        <div style={{
          flexShrink: 0,
          background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "14px 20px",
          maxHeight: 200,
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: NEED_COLORS[selected.need], display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#111", textTransform: "capitalize" }}>
                {selected.topic.replace(/-/g, " ")} × {selected.need}
              </span>
              <span style={{ fontSize: 11, color: "#aaa" }}>{selected.trends.length} trend{selected.trends.length !== 1 ? "s" : ""}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, color: "#aaa", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.trends.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{t.description.slice(0, 120)}…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        flexShrink: 0,
        padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        background: "#F5F2EC",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Human needs</span>
        {NEEDS.map(need => (
          <div key={need} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: NEED_COLORS[need] }} />
            <span style={{ fontSize: 10, color: "#666" }}>{need}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
