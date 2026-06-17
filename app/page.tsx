"use client";

import { useState } from "react";
import { TRENDS, SIGNALS } from "@/lib/trends";
import { Trend, Signal } from "@/types";
import { TrendShape } from "@/components/map/TrendShape";
import { TrendDetailModal } from "@/components/map/TrendDetailModal";
import { SignalPopup } from "@/components/map/SignalPopup";
import { AddSignalModal } from "@/components/map/AddSignalModal";

export default function HomePage() {
  const [activeTrend, setActiveTrend] = useState<Trend | null>(null);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [extraSignals, setExtraSignals] = useState<Signal[]>([]);

  const sorted = [...TRENDS].sort((a, b) => b.relevanceScore - a.relevanceScore);
  const featured = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const allSignals = [...SIGNALS, ...extraSignals];
  const activeTrendObj = activeTrend;

  function signalCount(trendId: string) {
    return allSignals.filter((s) => s.trendId === trendId).length;
  }

  function topSignals(trendId: string, n = 2) {
    return allSignals.filter((s) => s.trendId === trendId).slice(0, n);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F5F0" }}>
      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        backgroundColor: "rgba(247,245,240,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8E4DE",
        padding: "0 20px",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span className="serif" style={{ fontSize: 22, letterSpacing: "-0.03em", color: "#1a1a1a" }}>
          Trend Radar
        </span>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: "8px 16px", backgroundColor: "#1a1a1a", color: "#fff",
            border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.01em",
          }}
        >
          + Add signal
        </button>
      </header>

      <main style={{ padding: "28px 16px 60px", maxWidth: 900, margin: "0 auto" }}>
        {/* Intro */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.03em", color: "#1a1a1a", marginBottom: 8 }}>
            What's emerging<br /><em>right now</em>
          </h1>
          <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6 }}>
            {TRENDS.length} trends tracked · {allSignals.length} signals · tap any trend to explore
          </p>
        </div>

        {/* Featured — top 3 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Strongest signals
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}>
            {featured.map((trend) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                signals={topSignals(trend.id)}
                signalCount={signalCount(trend.id)}
                featured
                onClick={() => setActiveTrend(trend)}
              />
            ))}
          </div>
        </div>

        {/* Rest */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Also tracking
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}>
            {rest.map((trend) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                signals={topSignals(trend.id)}
                signalCount={signalCount(trend.id)}
                onClick={() => setActiveTrend(trend)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Trend detail bottom sheet */}
      {activeTrendObj && (
        <TrendDetailModal
          trend={activeTrendObj}
          extraSignals={extraSignals}
          onClose={() => setActiveTrend(null)}
          onSelectSignal={(s) => setActiveSignal(s)}
        />
      )}

      {/* Signal popup */}
      {activeSignal && (() => {
        const t = TRENDS.find((t) => t.id === activeSignal.trendId);
        return t ? (
          <SignalPopup
            signal={activeSignal}
            trendColor={t.color}
            trendName={t.name}
            onClose={() => setActiveSignal(null)}
          />
        ) : null;
      })()}

      {/* Add signal */}
      {showAdd && (
        <AddSignalModal
          onAdd={(s) => setExtraSignals((prev) => [...prev, s])}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

// ─── Trend Card ──────────────────────────────────────────────────────────────

function TrendCard({
  trend, signals, signalCount, featured = false, onClick,
}: {
  trend: Trend;
  signals: Signal[];
  signalCount: number;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", background: "#fff",
        border: "1px solid #ece9e3",
        borderRadius: 18, overflow: "hidden",
        cursor: "pointer", display: "flex", flexDirection: "column",
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.15s ease, transform 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
      }}
    >
      {/* Shape area */}
      <div style={{
        backgroundColor: trend.color + "12",
        padding: featured ? "28px 28px 20px" : "22px 22px 16px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: featured ? 110 : 88, height: featured ? 110 : 88 }}>
          <TrendShape trendId={trend.id} color={trend.color} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: featured ? "18px 20px 20px" : "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Relevance pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: trend.color,
            background: trend.color + "18", padding: "3px 9px", borderRadius: 20,
            letterSpacing: "0.04em",
          }}>
            {trend.relevanceScore}% relevance
          </span>
          <span style={{ fontSize: 10, color: "#ccc", fontWeight: 500 }}>
            {signalCount} signals
          </span>
        </div>

        <h2 className="serif" style={{
          fontSize: featured ? 17 : 15,
          fontWeight: 400, color: "#1a1a1a",
          lineHeight: 1.25, letterSpacing: "-0.02em",
          marginBottom: 12, flex: 1,
        }}>
          {trend.name}
        </h2>

        {/* Signal previews */}
        {signals.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {signals.map((s) => (
              <div key={s.id} style={{
                fontSize: 11, color: "#999", lineHeight: 1.35,
                padding: "5px 8px", backgroundColor: "#faf9f6",
                borderRadius: 7, borderLeft: `2px solid ${trend.color}55`,
                display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {s.title}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: 11, color: trend.color, fontWeight: 700, letterSpacing: "0.02em" }}>
          Explore →
        </div>
      </div>
    </button>
  );
}
