"use client";

import React from "react";
import Link from "next/link";

/* ── Geometry ──────────────────────────────────────────────────────────────── */
const W = 1400;
const H = 1150;
const CX = 700;     // canvas centre x
const CY = 558;     // canvas centre y
const ARR_R = 196;  // distance from canvas centre to each circle centre
const R = 234;      // circle radius

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/* ── Disciplines ───────────────────────────────────────────────────────────── */
const DISCIPLINES = [
  {
    id: "interaction",
    label: "Interaction Design",
    sub: "AR/VR · Filters\nMasters Projects",
    angleDeg: 270,
  },
  {
    id: "brand",
    label: "Brand Design",
    sub: "Be in Crypto · Rebrandings\nBrandings",
    angleDeg: 330,
  },
  {
    id: "speculative",
    label: "Speculative Design",
    sub: "End of Emotional Privacy\nPhobos",
    angleDeg: 30,
  },
  {
    id: "3d",
    label: "3D Printing",
    sub: "Sunsies",
    angleDeg: 90,
  },
  {
    id: "strategy",
    label: "Strategy & Research",
    sub: "Augmented Rarity\nTools Building",
    angleDeg: 150,
  },
  {
    id: "product",
    label: "Product Design",
    sub: "Guestline\nCase Studies",
    angleDeg: 210,
  },
];

/* Derive circle centres and label anchor points */
const CIRCLES = DISCIPLINES.map((d) => {
  const a = toRad(d.angleDeg);
  const cx = CX + ARR_R * Math.cos(a);
  const cy = CY + ARR_R * Math.sin(a);
  // Place label in outer portion of the circle, away from canvas centre
  const labelX = cx + R * 0.46 * Math.cos(a);
  const labelY = cy + R * 0.46 * Math.sin(a);
  return { ...d, cx, cy, labelX, labelY };
});

/* ── Image placeholders ────────────────────────────────────────────────────── */
// Positioned in the natural spaces between and around the 6 circles.
// x/y = top-left corner, w/h = size, rot = degrees.
const IMAGES = [
  // Above — Interaction Design zone
  { x: 558, y: 46, w: 132, h: 94, rot: -2 },
  { x: 748, y: 34, w: 90, h: 116, rot: 3 },
  // Top-left gap (between Interaction and Product Design)
  { x: 362, y: 164, w: 116, h: 84, rot: 5 },
  // Top-right gap (between Interaction and Brand Design)
  { x: 904, y: 164, w: 116, h: 84, rot: -4 },
  // Left — Product Design / Strategy & Research zone
  { x: 90, y: 396, w: 90, h: 116, rot: 3 },
  { x: 100, y: 618, w: 130, h: 90, rot: -2 },
  // Right — Brand Design / Speculative Design zone
  { x: 1152, y: 374, w: 90, h: 116, rot: -3 },
  { x: 1146, y: 608, w: 130, h: 90, rot: 2 },
  // Bottom-left gap (between Strategy and 3D Printing)
  { x: 354, y: 876, w: 116, h: 84, rot: -5 },
  // Bottom-right gap (between Speculative and 3D Printing)
  { x: 892, y: 876, w: 116, h: 84, rot: 4 },
  // Below — 3D Printing zone
  { x: 544, y: 996, w: 132, h: 94, rot: 2 },
  { x: 732, y: 1012, w: 90, h: 116, rot: -3 },
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
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(246,244,240,0.94)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#aaa",
            textDecoration: "none",
            letterSpacing: "0.08em",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          ← Augmented Radar
        </Link>
        <span
          style={{
            fontSize: 11,
            color: "#bbb",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Portfolio
        </span>
      </div>

      {/* ── Title block ── */}
      <div style={{ textAlign: "center", padding: "46px 24px 0" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#bbb",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            marginBottom: 10,
          }}
        >
          Martina Soles
        </p>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            lineHeight: 1.22,
            color: "#111",
            letterSpacing: "-0.025em",
            fontFamily: "'EB Garamond', Georgia, serif",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Creative Concept Strategist &amp;<br />
          Cultural Intelligence Researcher
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#999",
            marginTop: 12,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          a map of skills, disciplines &amp; practice
        </p>
      </div>

      {/* ── Diagram ── */}
      <div
        style={{
          width: W,
          height: H,
          position: "relative",
          margin: "0 auto",
          flexShrink: 0,
        }}
      >
        {/* SVG — circles only */}
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {CIRCLES.map((c) => (
            <circle
              key={c.id}
              cx={c.cx}
              cy={c.cy}
              r={R}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity={0.65}
            />
          ))}

          {/* Tiny dot at the intersection centre */}
          <circle cx={CX} cy={CY} r={2.5} fill="#1a1a1a" opacity={0.3} />
        </svg>

        {/* Discipline labels — positioned in the outer half of each circle */}
        {CIRCLES.map((c) => (
          <div
            key={`lbl-${c.id}`}
            style={{
              position: "absolute",
              left: c.labelX,
              top: c.labelY,
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              width: 188,
            }}
          >
            <div
              style={{
                fontSize: 15.5,
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.18,
                letterSpacing: "-0.015em",
                fontFamily: "'EB Garamond', Georgia, serif",
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#777",
                marginTop: 5,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                lineHeight: 1.55,
                letterSpacing: "0.01em",
                whiteSpace: "pre-line",
              }}
            >
              {c.sub}
            </div>
          </div>
        ))}

        {/* Centre "me" label */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              fontFamily: "'EB Garamond', Georgia, serif",
            }}
          >
            Martina
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#aaa",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 5,
            }}
          >
            Creative Strategist
          </div>
        </div>

        {/* Image placeholders */}
        {IMAGES.map((img, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: img.x,
              top: img.y,
              width: img.w,
              height: img.h,
              background: TONES[i % TONES.length],
              borderRadius: 2,
              transform: `rotate(${img.rot}deg)`,
              boxShadow: "0 3px 16px rgba(0,0,0,0.11)",
              overflow: "hidden",
            }}
          >
            {/* Inner photo-frame inset */}
            <div
              style={{
                position: "absolute",
                inset: 5,
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: 1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom breathing room */}
      <div style={{ height: 64 }} />
    </div>
  );
}
