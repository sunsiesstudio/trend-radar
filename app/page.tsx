import type { Metadata } from "next";
import Link from "next/link";

import { SkillMap } from "@/components/portfolio/SkillMap";
import {
  PROFILE,
  ABOUT_PARAGRAPHS,
  ASIDE,
  SERVICES,
  CASE_STUDIES,
  SPEAKING,
  SUBSTACK_URL,
  LINKEDIN_URL,
} from "@/components/portfolio/content";

export const metadata: Metadata = {
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: PROFILE.tagline,
};

const serif = { fontFamily: "var(--font-serif), serif" } as const;
const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

const CATEGORIES = [
  "Emerging Tech",
  "Industry Innovation",
  "Speculative & R&D",
  "Products & Ventures",
];

const TILE_TONES = ["#ebe7e0", "#dedad2", "#e6e2db", "#d6d2ca", "#f0ece5", "#e0dcd4", "#ccc8c0", "#eae5de"];

export default function PortfolioHome() {
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
      }}
    >
      {/* ── Nav ── */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px",
          background: "rgba(246,244,240,0.94)", backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          overflowX: "auto", whiteSpace: "nowrap",
        }}
      >
        <span style={{ ...serif, fontSize: 16, fontWeight: 800, color: "#111", letterSpacing: "-0.01em" }}>
          {PROFILE.name}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 22, marginLeft: 16 }}>
          {NAV_LINKS.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{ ...sans, fontSize: 12, fontWeight: 600, color: "#666", textDecoration: "none", letterSpacing: "0.02em" }}
            >
              {n.label}
            </a>
          ))}
          <Link
            href="/radar"
            style={{
              ...sans, fontSize: 11, fontWeight: 700, color: "#aaa", textDecoration: "none",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}
          >
            Trend Radar →
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "72px 24px 40px" }}>
        <p style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#aaa", marginBottom: 16 }}>
          {PROFILE.role} · {PROFILE.subrole}
        </p>
        <h1 style={{ ...serif, fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.15, color: "#111", letterSpacing: "-0.025em", maxWidth: 760, margin: "0 auto" }}>
          {PROFILE.tagline}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <a href="#work" style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#f6f4f0", background: "#111", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
            View my work
          </a>
          <a href="#contact" style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#111", background: "transparent", border: "1.5px solid rgba(0,0,0,0.18)", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
            Get in touch
          </a>
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px" }}>
        <SectionLabel>About</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18 }}>
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i} style={{ ...sans, fontSize: 16, lineHeight: 1.7, color: "#333" }}>{p}</p>
          ))}
        </div>
        <p style={{ ...sans, fontSize: 13, fontStyle: "italic", color: "#999", marginTop: 20 }}>{ASIDE}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 44 }}>
          {SERVICES.map((s) => (
            <div key={s.title} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ ...serif, fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 6 }}>{s.title}</div>
              <div style={{ ...sans, fontSize: 12.5, color: "#777", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skill map ── */}
      <section style={{ padding: "40px 0 0" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <SectionLabel center>Practice</SectionLabel>
          <h2 style={{ ...serif, fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#111", marginTop: 10, letterSpacing: "-0.02em" }}>
            A map of skills, disciplines &amp; practice
          </h2>
        </div>
        <SkillMap />
      </section>

      {/* ── Work ── */}
      <section id="work" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 60px" }}>
        <SectionLabel>Selected Work</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 44, marginTop: 24 }}>
          {CATEGORIES.map((cat) => {
            const items = CASE_STUDIES.filter((c) => c.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <h3 style={{ ...sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
                  {cat}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                  {items.map((c, i) => {
                    const Card = (
                      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                        <div style={{ height: 120, background: TILE_TONES[i % TILE_TONES.length], position: "relative" }}>
                          <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 4 }} />
                        </div>
                        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                          {c.client && (
                            <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                              {c.client}
                            </span>
                          )}
                          <span style={{ ...serif, fontSize: 17, fontWeight: 800, color: "#111", lineHeight: 1.25 }}>
                            {c.title}
                          </span>
                          <p style={{ ...sans, fontSize: 13, color: "#777", lineHeight: 1.55, flex: 1 }}>{c.description}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                            {c.tags.map((t) => (
                              <span key={t} style={{ ...sans, fontSize: 10.5, fontWeight: 600, color: "#888", background: "#f4f2ee", borderRadius: 999, padding: "3px 9px" }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                    return c.href ? (
                      <Link key={c.id} href={c.href} style={{ textDecoration: "none" }}>
                        {Card}
                      </Link>
                    ) : (
                      <div key={c.id}>{Card}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Writing & Speaking ── */}
      <section id="writing" style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 60px" }}>
        <SectionLabel>Writing</SectionLabel>
        <p style={{ ...sans, fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 18 }}>
          I write a Substack about emerging tech — it started as a weekly news summary and has since turned into
          longer essays (and the occasional rant) about where technology is actually taking us.
        </p>
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...sans, display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 700, color: "#111", background: "transparent", border: "1.5px solid rgba(0,0,0,0.18)", padding: "10px 20px", borderRadius: 999, textDecoration: "none" }}
        >
          Read the Substack →
        </a>

        <div style={{ marginTop: 44 }}>
          <h3 style={{ ...sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 14 }}>
            Talks &amp; Podcasts
          </h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
            {SPEAKING.map((s, i) => (
              <li key={i} style={{ ...sans, fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8c2b8", flexShrink: 0 }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ textAlign: "center", padding: "40px 24px 90px" }}>
        <SectionLabel center>Contact</SectionLabel>
        <h2 style={{ ...serif, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#111", marginTop: 12, letterSpacing: "-0.02em" }}>
          Let&rsquo;s work together
        </h2>
        <p style={{ ...sans, fontSize: 14, color: "#777", marginTop: 10, maxWidth: 460, margin: "10px auto 0" }}>
          Research call, workshop, trend report, or a project that doesn&rsquo;t have a name yet — reach out.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
          <a href={`mailto:${PROFILE.email}`} style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#f6f4f0", background: "#111", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
            {PROFILE.email}
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#111", background: "transparent", border: "1.5px solid rgba(0,0,0,0.18)", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
            LinkedIn
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", padding: "0 24px 40px" }}>
        <span style={{ ...sans, fontSize: 11, color: "#bbb", letterSpacing: "0.04em" }}>
          © {new Date().getFullYear()} {PROFILE.name}
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      style={{
        ...sans,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
        color: "#bbb", textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </p>
  );
}
