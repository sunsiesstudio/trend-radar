"use client";

import { useEffect, useRef } from "react";

// Each flower is a polar curve: r = fn(theta, R)
// All use [0, 2π] range; petal count determined by frequency k.
// |cos(kθ)| over 2π → 2k petals for integer k, k petals for half-integer k.
const FLOWERS: Record<string, (t: number, R: number) => number> = {
  // 8 sharp petals
  "ai-creativity":         (t, R) => R * Math.abs(Math.cos(4 * t)),
  // 6 soft petals with solid center (limaçon)
  "digital-identity":      (t, R) => R * (0.35 + 0.65 * Math.abs(Math.cos(3 * t))),
  // 5 wide rounded petals (sqrt opens them up)
  "ar-commerce":           (t, R) => R * Math.sqrt(Math.abs(Math.cos(2.5 * t))),
  // 7 petals, pure rose curve
  "biotech-beauty":        (t, R) => R * Math.abs(Math.cos(3.5 * t)),
  // 4 fat petals (exponent > 1 narrows base, widens tip → chunky)
  "sustainable-materials": (t, R) => R * Math.pow(Math.abs(Math.cos(2 * t)), 1.5),
  // 12-petal daisy (never reaches 0 so petals stay connected)
  "3d-printing":           (t, R) => R * (0.5 + 0.5 * Math.abs(Math.cos(6 * t))),
  // 3 broad petals, clover-like
  "wearables":             (t, R) => R * Math.pow(Math.abs(Math.cos(1.5 * t)), 0.8),
  // 10 narrow petals (exponent > 1 tightens each petal)
  "neurotech":             (t, R) => R * Math.pow(Math.abs(Math.cos(5 * t)), 1.3),
  // 6 fan-like petals (low exponent makes them extremely wide)
  "spatial-computing":     (t, R) => R * Math.pow(Math.abs(Math.cos(3 * t)), 0.3),
  // 5 tapered petals
  "longevity":             (t, R) => R * Math.pow(Math.abs(Math.cos(2.5 * t)), 1.2),
};

interface Props {
  trendId: string;
  color: string;
  size: number;
}

export function FlowerCanvas({ trendId, color, size }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const fn = FLOWERS[trendId] ?? FLOWERS["ai-creativity"];
    const R = size * 0.44;
    const cx = size / 2;
    const cy = size / 2;
    const steps = 1200;

    ctx.fillStyle = color;
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const r = fn(theta, R);
      // Rotate so first petal points up
      const x = cx + r * Math.cos(theta - Math.PI / 2);
      const y = cy + r * Math.sin(theta - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }, [trendId, color, size]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
