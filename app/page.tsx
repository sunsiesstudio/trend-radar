import type { Metadata } from "next";
import Link from "next/link";

import { PROFILE, CASE_STUDIES, LINKEDIN_URL } from "@/components/portfolio/content";

export const metadata: Metadata = {
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: PROFILE.tagline,
};

const serif = { fontFamily: "var(--font-serif), serif" } as const;
const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;

const BIO =
  "UX researcher and interaction designer with a background in cultural intelligence and a focus on creative strategy — currently working mostly with crypto, AI, automotive, hospitality and telecoms clients, with an eye toward doing more in lifestyle, beauty and fashion.";

export default function PortfolioHome() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        backgroundColor: "#f8f7f3",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 28px 100px" }}>
        <p style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#161513", letterSpacing: "0.02em" }}>
          {PROFILE.name}
        </p>

        <h1 style={{ ...serif, fontSize: "clamp(26px, 4.5vw, 36px)", fontWeight: 700, lineHeight: 1.3, color: "#161513", marginTop: 18, letterSpacing: "-0.01em" }}>
          {PROFILE.tagline}
        </h1>

        <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.7, color: "#565349", marginTop: 20 }}>
          {BIO}
        </p>

        <div style={{ marginTop: 48 }}>
          <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 16 }}>
            Work
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {CASE_STUDIES.map((c) => {
              const title = (
                <span style={{ ...serif, fontSize: 16.5, fontWeight: 700, color: "#161513" }}>
                  {c.title}{c.client ? ` — ${c.client}` : ""}
                </span>
              );
              return (
                <div key={c.id}>
                  {c.href ? (
                    <Link href={c.href} style={{ textDecoration: "none" }}>{title}</Link>
                  ) : (
                    title
                  )}
                  <p style={{ ...sans, fontSize: 14, color: "#78745f", lineHeight: 1.55, marginTop: 3 }}>
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 16 }}>
            Contact
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a href={`mailto:${PROFILE.email}`} style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: "#161513", textDecoration: "none", borderBottom: "1.5px solid rgba(0,0,0,0.3)", paddingBottom: 1 }}>
              {PROFILE.email}
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: "#161513", textDecoration: "none", borderBottom: "1.5px solid rgba(0,0,0,0.3)", paddingBottom: 1 }}>
              LinkedIn
            </a>
          </div>
        </div>

        <p style={{ ...sans, fontSize: 12, color: "#bbb", marginTop: 64 }}>
          © {new Date().getFullYear()} {PROFILE.name} · <Link href="/radar" style={{ color: "#bbb" }}>Trend Radar</Link>
        </p>
      </div>
    </div>
  );
}
