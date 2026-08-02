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
  { href: "#work", label: "Work" },
  { href: "#writing", label: "Field Notes" },
  { href: "#about", label: "About" },
];

const TILE_TONES = ["#ebe7e0", "#dedad2", "#e6e2db", "#d6d2ca", "#f0ece5", "#e0dcd4", "#ccc8c0", "#eae5de"];

const COLLABORATORS = "Guestline · Be In Crypto · automotive & telecoms enterprise teams";

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
      {/* ── Nav ── */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 32px",
          background: "rgba(248,247,243,0.9)", backdropFilter: "blur(6px)",
          overflowX: "auto", whiteSpace: "nowrap",
        }}
      >
        <span style={{ ...serif, fontSize: 19, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>
          {PROFILE.name}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 28, marginLeft: 16 }}>
          {NAV_LINKS.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{ ...sans, fontSize: 12.5, fontWeight: 500, color: "#666", textDecoration: "none", letterSpacing: "0.02em" }}
            >
              {n.label}
            </a>
          ))}
          <Link
            href="/radar"
            style={{ ...sans, fontSize: 11.5, fontWeight: 500, color: "#999", textDecoration: "none" }}
          >
            Trend Radar
          </Link>
          <a
            href="#contact"
            style={{ ...sans, fontSize: 12.5, fontWeight: 700, color: "#f8f7f3", background: "#111", padding: "9px 18px", borderRadius: 999, textDecoration: "none" }}
          >
            Let&rsquo;s talk
          </a>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 28px 0" }}>
        <h1 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(30px, 5.5vw, 48px)", fontWeight: 400, lineHeight: 1.28, color: "#161513", letterSpacing: "-0.01em" }}>
          {PROFILE.tagline}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
          {ABOUT_PARAGRAPHS.slice(0, 2).map((p, i) => (
            <p key={i} style={{ ...sans, fontSize: 16, lineHeight: 1.7, color: "#565349" }}>{p}</p>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          <a href={`mailto:${PROFILE.email}`} style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#f8f7f3", background: "#161513", padding: "12px 22px", borderRadius: 999, textDecoration: "none" }}>
            Say hello
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#161513", background: "transparent", border: "1.5px solid rgba(0,0,0,0.16)", padding: "12px 22px", borderRadius: 999, textDecoration: "none" }}>
            LinkedIn
          </a>
        </div>

        <p style={{ ...sans, fontSize: 12, color: "#a49f92", marginTop: 26 }}>
          Past collaborators &amp; research partners: {COLLABORATORS}
        </p>
      </div>

      {/* ── Work ── */}
      <section id="work" style={{ maxWidth: 760, margin: "0 auto", padding: "88px 28px 40px" }}>
        <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 46 }}>
          Selected Work
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 68 }}>
          {CASE_STUDIES.map((c, i) => {
            const body = (
              <>
                <div style={{ width: "100%", aspectRatio: "4 / 3", background: TILE_TONES[i % TILE_TONES.length], borderRadius: 3, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 14, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 2 }} />
                </div>
                <div style={{ marginTop: 18 }}>
                  <p style={{ ...sans, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#a49f92" }}>
                    {[c.category, c.client].filter(Boolean).join(" · ")}
                  </p>
                  <h3 style={{ ...serif, fontSize: 22, fontWeight: 700, color: "#161513", marginTop: 6, lineHeight: 1.3 }}>
                    {c.title}
                  </h3>
                  <p style={{ ...sans, fontSize: 14.5, color: "#78745f", lineHeight: 1.65, marginTop: 8, maxWidth: 560 }}>
                    {c.description}
                  </p>
                  <p style={{ ...sans, fontSize: 12, color: "#a49f92", marginTop: 10 }}>
                    {c.tags.join(" · ")}{c.href ? " · view tool →" : ""}
                  </p>
                </div>
              </>
            );
            return c.href ? (
              <Link key={c.id} href={c.href} style={{ textDecoration: "none", display: "block" }}>
                {body}
              </Link>
            ) : (
              <div key={c.id}>{body}</div>
            );
          })}
        </div>
      </section>

      {/* ── Skill map ── */}
      <section style={{ padding: "60px 0 0" }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92" }}>
            Practice
          </p>
          <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 400, color: "#161513", marginTop: 10 }}>
            A map of skills, disciplines &amp; practice
          </h2>
        </div>
        <SkillMap />
      </section>

      {/* ── About ── */}
      <section id="about" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 28px 70px" }}>
        <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 20 }}>
          About
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ABOUT_PARAGRAPHS.slice(2).map((p, i) => (
            <p key={i} style={{ ...sans, fontSize: 16, lineHeight: 1.7, color: "#565349" }}>{p}</p>
          ))}
        </div>
        <p style={{ ...sans, fontSize: 13, fontStyle: "italic", color: "#a49f92", marginTop: 18 }}>{ASIDE}</p>

        <div style={{ marginTop: 46 }}>
          <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 4 }}>
            What I Do
          </p>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "16px 0", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.08)" }}>
              <span style={{ ...serif, fontSize: 16, fontWeight: 700, color: "#161513", flexShrink: 0, width: 220 }}>{s.title}</span>
              <span style={{ ...sans, fontSize: 13.5, color: "#78745f", lineHeight: 1.55 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Writing & Speaking ── */}
      <section id="writing" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 28px 70px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginTop: 46, marginBottom: 20 }}>
          Field Notes
        </p>
        <p style={{ ...sans, fontSize: 16, lineHeight: 1.7, color: "#565349" }}>
          I write a Substack about emerging tech — it started as a weekly news summary and has since turned into
          longer essays (and the occasional rant) about where technology is actually taking us.
        </p>
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...sans, display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 700, color: "#161513", borderBottom: "1.5px solid rgba(0,0,0,0.3)", paddingBottom: 2, textDecoration: "none" }}
        >
          Read the Substack →
        </a>

        <div style={{ marginTop: 44 }}>
          <p style={{ ...sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a49f92", marginBottom: 14 }}>
            Talks &amp; Podcasts
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>
            {SPEAKING.map((s, i) => (
              <li key={i} style={{ ...sans, fontSize: 14.5, color: "#565349" }}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 28px 100px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ ...serif, fontStyle: "italic", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#161513", marginTop: 46 }}>
          Let&rsquo;s work together.
        </h2>
        <p style={{ ...sans, fontSize: 15, color: "#78745f", marginTop: 12, maxWidth: 460 }}>
          Research call, workshop, trend report, or a project that doesn&rsquo;t have a name yet — reach out.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
          <a href={`mailto:${PROFILE.email}`} style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#f8f7f3", background: "#161513", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
            {PROFILE.email}
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#161513", background: "transparent", border: "1.5px solid rgba(0,0,0,0.16)", padding: "12px 24px", borderRadius: 999, textDecoration: "none" }}>
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
