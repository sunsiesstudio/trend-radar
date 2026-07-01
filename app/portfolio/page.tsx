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
  { id: "interaction", label: "Interaction Design",  sub: "AR/VR · Filters\nMasters Projects",          angleDeg: 270 },
  { id: "brand",       label: "Brand Design",         sub: "Be in Crypto · Rebrandings\nBrandings",       angleDeg: 330 },
  { id: "speculative", label: "Speculative Design",   sub: "End of Emotional Privacy\nPhobos",            angleDeg: 30  },
  { id: "3d",          label: "3D Printing",           sub: "Sunsies",                                    angleDeg: 90  },
  { id: "strategy",    label: "Strategy & Research",  sub: "Augmented Rarity\nTools Building",            angleDeg: 150 },
  { id: "product",     label: "Product Design",        sub: "Guestline\nCase Studies",                    angleDeg: 210 },
];

const NODES = DISCIPLINES.map((d) => {
  const a = toRad(d.angleDeg);
  return {
    ...d,
    x: CX + ARR_R * Math.cos(a),
    y: CY + ARR_R * Math.sin(a),
  };
});

/* ── Image placeholders ────────────────────────────────────────────────────── */
const IMAGES = [
  // ── Interaction Design  (node ~700, 362) ──────────────────────────────────
  { x: 502, y: 52,  w: 128, h: 90,  rot: -2 },
  { x: 692, y: 36,  w: 88,  h: 112, rot:  3 },
  { x: 848, y: 68,  w: 118, h: 84,  rot: -4 },
  { x: 468, y: 202, w: 102, h: 74,  rot:  5 },
  { x: 862, y: 198, w: 88,  h: 112, rot: -3 },

  // ── Brand Design  (node ~870, 460) ────────────────────────────────────────
  { x: 1022, y: 192, w: 112, h: 80,  rot: -3 },
  { x: 1170, y: 282, w: 88,  h: 112, rot:  2 },
  { x: 1174, y: 422, w: 128, h: 88,  rot: -4 },

  // ── Speculative Design  (node ~870, 656) ──────────────────────────────────
  { x: 1158, y: 575, w: 88,  h: 112, rot: -2 },
  { x: 1162, y: 730, w: 128, h: 88,  rot:  4 },
  { x: 988,  y: 838, w: 112, h: 80,  rot: -3 },

  // ── 3D Printing  (node ~700, 754) ─────────────────────────────────────────
  { x: 520,  y: 898, w: 128, h: 90,  rot:  2 },
  { x: 688,  y: 948, w: 88,  h: 112, rot: -3 },
  { x: 854,  y: 904, w: 112, h: 80,  rot: -5 },
  { x: 610,  y: 1032,w: 120, h: 85,  rot:  4 },

  // ── Strategy & Research  (node ~530, 656) ─────────────────────────────────
  { x: 90,   y: 586, w: 88,  h: 112, rot: -2 },
  { x: 96,   y: 752, w: 128, h: 88,  rot:  3 },
  { x: 306,  y: 856, w: 112, h: 80,  rot:  4 },

  // ── Product Design  (node ~530, 460) ──────────────────────────────────────
  { x: 140,  y: 212, w: 88,  h: 112, rot:  2 },
  { x: 80,   y: 374, w: 128, h: 88,  rot: -3 },
  { x: 322,  y: 88,  w: 112, h: 80,  rot: -5 },
];

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
        <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.22, color: "#111", letterSpacing: "-0.025em", fontFamily: "'EB Garamond',Georgia,serif", maxWidth: 560, margin: "0 auto" }}>
          Creative Concept Strategist &amp;<br />Cultural Intelligence Researcher
        </h1>
        <p style={{ fontSize: 13, color: "#999", marginTop: 12, fontFamily: "'DM Sans',system-ui,sans-serif", fontStyle: "italic" }}>
          a map of skills, disciplines &amp; practice
        </p>
      </div>

      {/* ── Diagram ── */}
      <div style={{ width: W, height: H, position: "relative", margin: "0 auto" }}>

        {/* Discipline labels */}
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
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 15.5, fontWeight: 800, color: "#111", lineHeight: 1.18, letterSpacing: "-0.015em", fontFamily: "'EB Garamond',Georgia,serif" }}>
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
            textAlign: "center", pointerEvents: "none", zIndex: 2,
          }}
        >
          <div style={{ fontSize: 19, fontWeight: 800, color: "#111", letterSpacing: "-0.025em", fontFamily: "'EB Garamond',Georgia,serif" }}>
            Martina
          </div>
          <div style={{ fontSize: 8, color: "#aaa", fontFamily: "'DM Sans',system-ui,sans-serif", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 5 }}>
            Creative Strategist
          </div>
        </div>

        {/* Image placeholders */}
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
      </div>

      <div style={{ height: 64 }} />
    </div>
  );
}
