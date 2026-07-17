"use client";

import React from "react";
import Link from "next/link";

/* ── Geometry ──────────────────────────────────────────────────────────────── */
const W = 1400;
const H = 1150;
const CX = 700;
const CY = 558;
const ARR_R = 196;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/* ── Disciplines ───────────────────────────────────────────────────────────── */
const DISCIPLINES = [
  { id: "interaction", label: "Interaction Design",  sub: "AR/VR · Filters\nMasters Projects",       angleDeg: 270 },
  { id: "brand",       label: "Brand Design",         sub: "Be in Crypto · Rebrandings\nBrandings",    angleDeg: 330 },
  { id: "speculative", label: "Speculative Design",   sub: "End of Emotional Privacy\nPhobos",         angleDeg: 30  },
  { id: "3d",          label: "3D Printing",           sub: "Sunsies",                                 angleDeg: 90  },
  { id: "strategy",    label: "Strategy & Research",  sub: "Augmented Rarity\nTools Building",         angleDeg: 150 },
  { id: "product",     label: "Product Design",        sub: "Guestline\nCase Studies",                 angleDeg: 210 },
];

const NODES = DISCIPLINES.map((d) => {
  const a = toRad(d.angleDeg);
  return { ...d, x: CX + ARR_R * Math.cos(a), y: CY + ARR_R * Math.sin(a) };
});

/* ── Image clusters ────────────────────────────────────────────────────────── */
/* Each slot: da = angle offset from node direction, r = distance from node   */
const CLUSTER_CONFIG = [
  {
    nodeId: "interaction",
    slots: [
      { da: -40, r: 190, w: 128, h: 90,  rot: -2 },
      { da: -15, r: 245, w: 88,  h: 112, rot:  3 },
      { da:   0, r: 285, w: 118, h: 84,  rot: -4 },
      { da:  15, r: 240, w: 102, h: 74,  rot:  5 },
      { da:  40, r: 185, w: 88,  h: 112, rot: -3 },
    ],
  },
  {
    nodeId: "brand",
    slots: [
      { da: -35, r: 205, w: 112, h: 80,  rot: -3 },
      { da: -10, r: 255, w: 88,  h: 112, rot:  2 },
      { da:  10, r: 250, w: 128, h: 88,  rot: -4 },
      { da:  35, r: 200, w: 96,  h: 68,  rot:  3 },
    ],
  },
  {
    nodeId: "speculative",
    slots: [
      { da: -30, r: 210, w: 88,  h: 112, rot: -2 },
      { da:   0, r: 265, w: 128, h: 88,  rot:  4 },
      { da:  30, r: 205, w: 112, h: 80,  rot: -3 },
    ],
  },
  {
    nodeId: "3d",
    slots: [
      { da: -40, r: 195, w: 128, h: 90,  rot:  2 },
      { da: -12, r: 245, w: 88,  h: 112, rot: -3 },
      { da:  12, r: 245, w: 112, h: 80,  rot: -5 },
      { da:  40, r: 190, w: 120, h: 85,  rot:  4 },
    ],
  },
  {
    nodeId: "strategy",
    slots: [
      { da: -30, r: 205, w: 88,  h: 112, rot: -2 },
      { da:   0, r: 260, w: 128, h: 88,  rot:  3 },
      { da:  30, r: 200, w: 112, h: 80,  rot:  4 },
    ],
  },
  {
    nodeId: "product",
    slots: [
      { da: -35, r: 200, w: 88,  h: 112, rot:  2 },
      { da: -10, r: 252, w: 128, h: 88,  rot: -3 },
      { da:  10, r: 255, w: 112, h: 80,  rot: -5 },
      { da:  35, r: 202, w: 96,  h: 68,  rot:  2 },
    ],
  },
];

const IMAGES = CLUSTER_CONFIG.flatMap(({ nodeId, slots }) => {
  const node = NODES.find((n) => n.id === nodeId)!;
  const disc = DISCIPLINES.find((d) => d.id === nodeId)!;
  const baseA = toRad(disc.angleDeg);
  return slots.map(({ da, r, w, h, rot }) => {
    const a = baseA + toRad(da);
    return {
      x: node.x + r * Math.cos(a) - w / 2,
      y: node.y + r * Math.sin(a) - h / 2,
      w,
      h,
      rot,
    };
  });
});

const TONES = [
  "#ebe7e0", "#dedad2", "#e6e2db", "#d6d2ca",
  "#f0ece5", "#e0dcd4", "#ccc8c0", "#eae5de",
];

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        backgroundColor: "#f6f4f0",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "26px 26px",
      } as React.CSSProperties}
    >
      {/* ── Nav ── */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(246,244,240,0.94)", backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 11, fontWeight: 700, color: "#aaa", textDecoration: "none",
            letterSpacing: "0.08em", fontFamily: "'DM Sans',system-ui,sans-serif",
            textTransform: "uppercase",
          }}
        >
          ← Augmented Radar
        </Link>
        <span style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Portfolio
        </span>
      </div>

      {/* ── Title ── */}
      <div style={{ textAlign: "center", padding: "46px 24px 0" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", fontFamily: "'DM Sans',system-ui,sans-serif", marginBottom: 10 }}>
          Martina Soles
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.22, color: "#111", letterSpacing: "-0.025em", fontFamily: "var(--font-serif),serif", maxWidth: 560, margin: "0 auto" }}>
          Creative Concept Strategist &amp;<br />Cultural Intelligence Researcher
        </h1>
        <p style={{ fontSize: 13, color: "#999", marginTop: 12, fontFamily: "'DM Sans',system-ui,sans-serif", fontStyle: "italic" }}>
          a map of skills, disciplines &amp; practice
        </p>
      </div>

      {/* ── Diagram ── */}
      <div style={{ width: W, height: H, position: "relative", margin: "0 auto" }}>

        {/* Soft glow anchoring each discipline cluster */}
        {NODES.map((n) => (
          <div
            key={`glow-${n.id}`}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              transform: "translate(-50%, -50%)",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(180,170,158,0.13) 0%, transparent 68%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Image placeholders — orbiting each node */}
        {IMAGES.map((img, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: img.x, top: img.y,
              width: img.w, height: img.h,
              background: TONES[i % TONES.length],
              borderRadius: 2,
              transform: `rotate(${img.rot}deg)`,
              boxShadow: "0 3px 16px rgba(0,0,0,0.11)",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <div style={{ position: "absolute", inset: 5, border: "1px solid rgba(0,0,0,0.07)", borderRadius: 1 }} />
          </div>
        ))}

        {/* Discipline labels — on top of images */}
        {NODES.map((n) => (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              width: 180,
              zIndex: 3,
            }}
          >
            <div style={{ fontSize: 15.5, fontWeight: 800, color: "#111", lineHeight: 1.18, letterSpacing: "-0.015em", fontFamily: "var(--font-serif),serif" }}>
              {n.label}
            </div>
            <div style={{ fontSize: 10, color: "#777", marginTop: 5, fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 500, lineHeight: 1.55, whiteSpace: "pre-line" }}>
              {n.sub}
            </div>
          </div>
        ))}

        {/* Centre label */}
        <div
          style={{
            position: "absolute", left: CX, top: CY,
            transform: "translate(-50%, -50%)",
            textAlign: "center", pointerEvents: "none", zIndex: 3,
          }}
        >
          <div style={{ fontSize: 19, fontWeight: 800, color: "#111", letterSpacing: "-0.025em", fontFamily: "var(--font-serif),serif" }}>
            Martina
          </div>
          <div style={{ fontSize: 8, color: "#aaa", fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 5 }}>
            Creative Strategist
          </div>
        </div>
      </div>

      <div style={{ height: 64 }} />
    </div>
  );
}
