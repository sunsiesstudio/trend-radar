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
          Switch to <strong style={{ color: "#888" }}>Radar</strong> and add a topic<br />to populate the culture map
        </div>
      </div>
    );
  }

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const minDim = Math.min(w, h);

  const outerR    = minDim * 0.38;
  const innerR    = minDim * 0.165;
  const topicNodeR = Math.min(54, Math.max(36, outerR * 0.22));
  const needNodeR  = Math.min(46, Math.max(30, innerR * 0.68));

  // Topics evenly spaced around the outer ring
  const topicNodes = useMemo(() => topics.map((topic, i) => {
    const angle = (i / topics.length) * Math.PI * 2 - Math.PI / 2;
    return {
      topic,
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
      color: TOPIC_COLORS[topic] ?? "#aaa",
    };
  }), [topics, cx, cy, outerR]);

  // Needs evenly spaced around the inner ring
  const needNodes = useMemo(() => NEEDS.map((need, i) => {
    const angle = (i / NEEDS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      need,
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
      color: NEED_COLORS[need],
    };
  }), [cx, cy, innerR]);

  // One connection per trend: topic node → need node
  const connections = useMemo(() => trends.flatMap(trend => {
    const need = getTrendNeed(trend);
    const topicKey = trend.topics?.[0] ?? "";
    const tNode = topicNodes.find(n => n.topic === topicKey);
    const nNode = needNodes.find(n => n.need === need);
    if (!tNode || !nNode) return [];
    return [{ trend, need, tNode, nNode, color: tNode.color }];
  }), [trends, topicNodes, needNodes]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F5F2EC" }}>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>

          {/* Ghost web — all possible sector × need connections */}
          {topicNodes.flatMap(tn =>
            needNodes.map(nn => (
              <line key={`web-${tn.topic}-${nn.need}`}
                x1={tn.x} y1={tn.y} x2={nn.x} y2={nn.y}
                stroke="#ccc" strokeWidth={0.6} opacity={0.35} />
            ))
          )}

          {/* Active connections — one line per trend */}
          {connections.map(({ trend, tNode, nNode, color }, idx) => {
            const isSelected = selected?.id === trend.id;
            const dimmed = selected !== null && !isSelected;
            const mx = (tNode.x + nNode.x) / 2;
            const my = (tNode.y + nNode.y) / 2;

            // Rotate label so it follows the line
            const angleDeg = Math.atan2(nNode.y - tNode.y, nNode.x - tNode.x) * (180 / Math.PI);
            const flip = angleDeg > 90 || angleDeg < -90;
            const labelAngle = flip ? angleDeg + 180 : angleDeg;
            const labelWords = trend.name.split(" ").slice(0, 3).join(" ");

            return (
              <g key={`${trend.id}-${idx}`} style={{ cursor: "pointer" }}
                onClick={() => setSelected(isSelected ? null : trend)}>
                {/* Invisible wider hit zone */}
                <line x1={tNode.x} y1={tNode.y} x2={nNode.x} y2={nNode.y}
                  stroke="transparent" strokeWidth={14} />
                {/* Visible line */}
                <line x1={tNode.x} y1={tNode.y} x2={nNode.x} y2={nNode.y}
                  stroke={color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={dimmed ? 0.15 : isSelected ? 1 : 0.55} />
                {/* Label along the line, near midpoint */}
                <g transform={`translate(${mx},${my}) rotate(${labelAngle})`}>
                  <rect x={-labelWords.length * 2.6} y={-10} width={labelWords.length * 5.2} height={13}
                    fill="#F5F2EC" rx={3} opacity={dimmed ? 0 : 0.85} />
                  <text textAnchor="middle" y={0}
                    fontSize={isSelected ? 9.5 : 8.5}
                    fontWeight={isSelected ? 700 : 500}
                    fill={dimmed ? "transparent" : isSelected ? "#111" : "#444"}
                    fontFamily="'DM Sans', sans-serif"
                    style={{ pointerEvents: "none" }}>
                    {labelWords}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Topic nodes — outer ring */}
          {topicNodes.map(({ topic, x, y, color }) => {
            const label = topic.replace(/-/g, " ");
            const words = label.split(" ");
            return (
              <g key={topic}>
                <circle cx={x} cy={y} r={topicNodeR}
                  fill="#fff" stroke={color} strokeWidth={2} />
                {words.map((word, wi) => (
                  <text key={wi}
                    x={x} y={y + (wi - (words.length - 1) / 2) * 15}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(12, topicNodeR * 0.26)}
                    fontWeight={600} fill="#111"
                    fontFamily="'DM Sans', sans-serif">
                    {word}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Need nodes — inner ring */}
          {needNodes.map(({ need, x, y, color }) => {
            const active = connections.some(c => c.need === need && (selected === null || selected.id === c.trend.id));
            const anyActive = connections.some(c => c.need === need);
            return (
              <g key={need}>
                <circle cx={x} cy={y} r={needNodeR}
                  fill={anyActive ? `${color}22` : "#fff"}
                  stroke={anyActive ? color : "#ddd"}
                  strokeWidth={anyActive ? 1.5 : 1} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={Math.min(11, needNodeR * 0.3)}
                  fontWeight={500}
                  fill={anyActive ? "#111" : "#bbb"}
                  fontFamily="'DM Sans', sans-serif">
                  {need}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      {/* Selected trend detail panel */}
      {selected && (
        <div style={{
          flexShrink: 0, background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          padding: "12px 20px 14px", maxHeight: 150, overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: selected.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111", fontFamily: "'EB Garamond', Georgia, serif" }}>
                {selected.name}
              </span>
              <span style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 10,
                background: `${NEED_COLORS[getTrendNeed(selected)]}22`,
                border: `1px solid ${NEED_COLORS[getTrendNeed(selected)]}66`,
                color: "#555", fontFamily: "'DM Sans', sans-serif",
              }}>
                {getTrendNeed(selected)}
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

      {/* Footer legend */}
      <div style={{
        flexShrink: 0, padding: "7px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        borderTop: "1px solid rgba(0,0,0,0.05)", background: "#F5F2EC",
      }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
          Tap a line to explore a trend
        </span>
      </div>
    </div>
  );
}
