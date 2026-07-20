"use client";

import { useState, useEffect } from "react";
import { Signal } from "@/types";
import { SIGNALS, getSourceIcon } from "@/lib/trends";

function darkenHex(hex: string, f: number): string {
  return "#" + ["1,3","3,5","5,7"].map(r => Math.round(parseInt(hex.slice(...r.split(",").map(Number)),16)*f).toString(16).padStart(2,"0")).join("");
}
function accessibleTextColor(hex: string): string {
  const lin = (c: number) => { const v=c/255; return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4; };
  const lum = (h: string) => 0.2126*lin(parseInt(h.slice(1,3),16))+0.7152*lin(parseInt(h.slice(3,5),16))+0.0722*lin(parseInt(h.slice(5,7),16));
  let f=1.0; while(1.05/(lum(darkenHex(hex,f))+0.05)<4.5&&f>0.05)f-=0.02; return darkenHex(hex,f);
}

interface Props {
  signal: Signal;
  trendColor: string;
  trendName: string;
  allSignals?: Signal[];
  onClose: () => void;
  onSelectSignal?: (s: Signal) => void;
  onOpenTrend?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  mode?: "modal" | "sidebar";
}

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  news: "Press",
  youtube: "YouTube",
  arxiv: "Research",
  hackernews: "Hacker News",
  manual: "Manual",
};

const SOURCE_DOMAINS: Record<string, string> = {
  "Forbes": "https://forbes.com",
  "Forbes Education": "https://forbes.com",
  "Forbes Wellness": "https://forbes.com",
  "TechCrunch": "https://techcrunch.com",
  "The Guardian": "https://theguardian.com",
  "Business of Fashion": "https://businessoffashion.com",
  "Wired": "https://wired.com",
  "WIRED": "https://wired.com",
  "Bloomberg": "https://bloomberg.com",
  "Bloomberg Businessweek": "https://bloomberg.com",
  "New York Times": "https://nytimes.com",
  "The New York Times": "https://nytimes.com",
  "Financial Times": "https://ft.com",
  "Reuters": "https://reuters.com",
  "Wall Street Journal": "https://wsj.com",
  "The Wall Street Journal": "https://wsj.com",
  "WSJ": "https://wsj.com",
  "The Verge": "https://theverge.com",
  "Dezeen": "https://dezeen.com",
  "Wallpaper*": "https://wallpaper.com",
  "Vogue": "https://vogue.com",
  "Vogue UK": "https://vogue.com",
  "Vogue Business": "https://voguebusiness.com",
  "WWD": "https://wwd.com",
  "Business Insider": "https://businessinsider.com",
  "The Atlantic": "https://theatlantic.com",
  "Washington Post": "https://washingtonpost.com",
  "Vice": "https://vice.com",
  "The Economist": "https://economist.com",
  "Retail Week": "https://retail-week.com",
  "Retail Gazette": "https://retailgazette.co.uk",
  "Retail Dive": "https://retaildive.com",
  "Sports Business Journal": "https://sportsbusinessjournal.com",
  "JD Power": "https://jdpower.com",
  "Campaign": "https://campaignlive.co.uk",
  "CoinDesk": "https://coindesk.com",
  "The Block": "https://theblock.co",
  "Skift": "https://skift.com",
  "EdSurge": "https://edsurge.com",
  "Education Week": "https://edweek.org",
  "Publishers Weekly": "https://publishersweekly.com",
  "HR Dive": "https://hrdive.com",
  "Nation's Restaurant News": "https://nrn.com",
  "Food Navigator": "https://foodnavigator.com",
  "Food Ingredients First": "https://foodingredientsfirst.com",
  "Curbed": "https://curbed.com",
  "VentureBeat": "https://venturebeat.com",
  "Grand View Research": "https://grandviewresearch.com",
  "Le Monde": "https://lemonde.fr",
  "ESPN": "https://espn.com",
  "Variety": "https://variety.com",
  "Fast Company": "https://fastcompany.com",
  "Adweek": "https://adweek.com",
  "Digiday": "https://digiday.com",
  "Marketing Week": "https://marketingweek.com",
  "MIT Technology Review": "https://technologyreview.com",
  "Harvard Business Review": "https://hbr.org",
  "Harvard Crimson": "https://thecrimson.com",
  "Harvard Public Health": "https://hsph.harvard.edu",
  "CNBC": "https://cnbc.com",
  "BBC Tech": "https://bbc.com/news/technology",
  "Healthline": "https://healthline.com",
  "STAT News": "https://statnews.com",
  "JAMA Network Open": "https://jamanetwork.com",
  "Journal of Affective Disorders": "https://sciencedirect.com/journal/journal-of-affective-disorders",
  "Allure": "https://allure.com",
  "Cosmetics Business": "https://cosmeticsbusiness.com",
  "Cosmetics Europe": "https://cosmeticseurope.eu",
  "Beauty Independent": "https://beautyindependent.com",
  "Fragrantica": "https://fragrantica.com",
  "Glossy": "https://glossy.co",
  "Hypebeast": "https://hypebeast.com",
  "SSENSE": "https://ssense.com",
  "WGSN": "https://wgsn.com",
  "Mintel": "https://mintel.com",
  "Kantar": "https://kantar.com",
  "Morning Consult": "https://morningconsult.com",
  "Crunchbase News": "https://news.crunchbase.com",
  "Goldman Sachs Research": "https://goldmansachs.com/insights",
  "Bain & Company": "https://bain.com",
  "LinkedIn Newsroom": "https://news.linkedin.com",
  "Pitchfork": "https://pitchfork.com",
  "Rolling Stone": "https://rollingstone.com",
  "Billboard": "https://billboard.com",
  "Music Week": "https://musicweek.com",
  "DJ Mag": "https://djmag.com",
  "Kotaku": "https://kotaku.com",
  "IndieWire": "https://indiewire.com",
  "The Hollywood Reporter": "https://hollywoodreporter.com",
  "Sprudge": "https://sprudge.com",
  "Restaurant Business": "https://restaurantbusinessonline.com",
  "Good Food Institute": "https://gfi.org",
  "Whole Foods Market": "https://wholefoodsmarket.com",
  "Condé Nast Traveler": "https://cntraveler.com",
  "Phocuswire": "https://phocuswire.com",
  "Outdoor Retailer": "https://outdoorretailer.com",
  "Outside Magazine": "https://outsideonline.com",
  "Runner's World": "https://runnersworld.com",
  "Running Competitor": "https://runningmagazine.ca",
  "DC Rainmaker": "https://dcrainmaker.com",
  "Men's Health": "https://menshealth.com",
  "Sleepopolis": "https://sleepopolis.com",
  "National Jeweler": "https://nationaljeweler.com",
  "Retail Jeweller": "https://retailjeweller.com",
  "Rapaport": "https://rapaportmagazine.com",
  "Artforum": "https://artforum.com",
  "Artnet News": "https://news.artnet.com",
  "The Art Newspaper": "https://theartnewspaper.com",
  "Architectural Record": "https://architecturalrecord.com",
  "The Information": "https://theinformation.com",
  "Inside Higher Ed": "https://insidehighered.com",
  "Columbia Journalism Review": "https://cjr.org",
  "Reuters Institute": "https://reutersinstitute.politics.ox.ac.uk",
  "Social Media Today": "https://socialmediatoday.com",
  "ThredUp": "https://thredup.com",
  "DPReview": "https://dpreview.com",
  "DP Review": "https://dpreview.com",
  "PetaPixel": "https://petapixel.com",
  "British Journal of Photography": "https://bjp-online.com",
  "Time Out": "https://timeout.com",
  "NY Magazine": "https://nymag.com",
  "Nikkei Asia": "https://asia.nikkei.com",
  "Arabian Business": "https://arabianbusiness.com",
  "Politico": "https://politico.com",
  "UNESCO": "https://unesco.org",
  "Research Live": "https://research-live.com",
  "Consumer Reports": "https://consumerreports.org",
  "Lime Blog": "https://li.me/blog",
  "Business of Cycling": "https://businessofcycling.com",
  "Adobe Newsroom": "https://news.adobe.com",
  "9to5Mac": "https://9to5mac.com",
  "Bumble": "https://bumble.com",
  "Hacker News": "https://news.ycombinator.com",
  "YouTube": "https://youtube.com",
  "YouTube Trends": "https://youtube.com/trends",
  "arXiv": "https://arxiv.org",
};

export function SignalPopup({ signal, trendColor, trendName, allSignals, onClose, onSelectSignal, onOpenTrend, onDelete, onEdit, mode = "modal" }: Props) {
  const pool = allSignals ?? SIGNALS;
  const crossLinked = (signal.crossLinks ?? []).map((id) => pool.find((s) => s.id === id)).filter(Boolean) as Signal[];
  const related = crossLinked.length > 0
    ? crossLinked
    : pool.filter((s) => s.trendId === signal.trendId && s.id !== signal.id);
  const relatedLabel = crossLinked.length > 0 ? "Connected signals" : `More signals (${related.length})`;
  const textCol = accessibleTextColor(trendColor);
  const effectiveUrl = signal.sourceUrl
    || (signal.sourceName?.startsWith("r/") ? `https://reddit.com/${signal.sourceName}` : undefined)
    || (signal.sourceName ? SOURCE_DOMAINS[signal.sourceName] : undefined);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  const panel = (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "#f8f7f3",
        borderRadius: mode === "sidebar" ? 0 : (isDesktop ? "24px" : "24px 24px 0 0"),
        width: "100%",
        maxWidth: mode === "sidebar" ? undefined : (isDesktop ? 560 : 680),
        maxHeight: mode === "sidebar" ? undefined : (isDesktop ? "85vh" : "88svh"),
        flex: mode === "sidebar" ? 1 : undefined,
        minHeight: mode === "sidebar" ? 0 : undefined,
        display: "flex",
        flexDirection: "column",
        boxShadow: mode === "sidebar" ? "none" : (isDesktop ? "0 24px 80px rgba(0,0,0,0.2)" : "0 -12px 80px rgba(0,0,0,0.15)"),
        overflow: "hidden",
      }}
    >
        {/* Color bar — modal only */}
        {mode !== "sidebar" && (
          <div style={{ height: 4, background: `linear-gradient(90deg, ${trendColor}, ${trendColor}44)`, flexShrink: 0 }} />
        )}

        {/* Sidebar header — pinned outside the scroll area */}
        {mode === "sidebar" && (
          <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid #f0ede8", flexShrink: 0 }}>
            {/* Row 1: SIGNAL chip + trend dot + trend name (clickable) + close */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: textCol, textTransform: "uppercase", letterSpacing: "0.1em", background: `${trendColor}14`, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>
                Signal
              </span>
              {trendName && (
                <>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: trendColor, flexShrink: 0, display: "inline-block" }} />
                  <button
                    onClick={onOpenTrend ? () => { onClose(); onOpenTrend(); } : undefined}
                    style={{ fontSize: 11, color: onOpenTrend ? textCol : "#888", fontWeight: 600, background: "none", border: "none", padding: 0, cursor: onOpenTrend ? "pointer" : "default", textDecoration: "none", flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {trendName}{onOpenTrend ? " →" : ""}
                  </button>
                </>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
                {onEdit && <button onClick={onEdit} style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#f0f0f0", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Edit</button>}
                {onDelete && <button onClick={onDelete} style={{ fontSize: 11, fontWeight: 600, color: "#e04444", background: "#fee", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Delete</button>}
                <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 17, color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 }}>×</button>
              </div>
            </div>
            {/* Row 2: signal title */}
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.35, margin: 0, fontFamily: "var(--font-serif), serif" }}>
              {signal.title}
            </h3>
          </div>
        )}

        <div style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" } as React.CSSProperties}>

          {/* Modal header — inside scroll */}
          {mode !== "sidebar" && (
            <>
              <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: textCol, textTransform: "uppercase",
                  letterSpacing: "0.1em", background: `${trendColor}14`, padding: "3px 10px", borderRadius: 20,
                }}>
                  Signal
                </span>
                <button onClick={onClose} style={{ marginLeft: "auto", width: 34, height: 34, borderRadius: "50%", background: "#f0f0f0", border: "none", fontSize: 20, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1, WebkitTapHighlightColor: "transparent" } as React.CSSProperties}>×</button>
              </div>
              <div style={{ padding: "0 24px 14px" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111", lineHeight: 1.2, margin: 0, letterSpacing: "-0.03em" }}>
                  {signal.title}
                </h3>
              </div>
            </>
          )}

          {/* Source metadata — single row, no wrap */}
          <div style={{ padding: mode === "sidebar" ? "12px 20px 14px" : "0 24px 18px", display: "flex", alignItems: "center", gap: 0, minWidth: 0 }}>
            <span style={{ fontSize: 14, lineHeight: 1, marginRight: 7, flexShrink: 0 }}>{getSourceIcon(signal.source)}</span>
            {effectiveUrl ? (
              <a href={effectiveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 600, color: textCol, textDecoration: "none", flexShrink: 0 }}>
                {signal.sourceName ?? SOURCE_LABELS[signal.source ?? "manual"]} →
              </a>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 600, color: "#555", flexShrink: 0 }}>
                {signal.sourceName ?? SOURCE_LABELS[signal.source ?? "manual"]}
              </span>
            )}
            {fmt(signal.date) && (
              <>
                <span style={{ fontSize: 12, color: "#ddd", margin: "0 5px", flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 12, color: "#aaa", flexShrink: 0 }}>{fmt(signal.date)}</span>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ margin: mode === "sidebar" ? "0 20px 14px" : "0 24px 18px", height: 1, background: "#f0ede8" }} />

          {/* Summary — primary content */}
          <div style={{ padding: mode === "sidebar" ? "0 20px 18px" : "0 24px 24px" }}>
            <p style={{ fontSize: mode === "sidebar" ? 14 : 15, color: "#333", lineHeight: 1.8, margin: 0, fontFamily: "var(--font-serif), serif" }}>{signal.summary}</p>
          </div>

          {/* Trend link + related — grouped at bottom */}
          {((mode !== "sidebar" && onOpenTrend) || related.length > 0) && (
            <div style={{ margin: mode === "sidebar" ? "0 20px 20px" : "0 24px 24px", borderRadius: 10, border: "1px solid #f0ede8", overflow: "hidden" }}>

              {/* Trend link — only in modal (sidebar header already shows it) */}
              {mode !== "sidebar" && onOpenTrend && (
                <button
                  onClick={() => { onClose(); onOpenTrend(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: `${trendColor}08`, borderBottom: related.length > 0 ? "1px solid #efefef" : "none",
                    padding: "12px 16px", cursor: "pointer",
                    textAlign: "left", width: "100%", boxSizing: "border-box", border: "none",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: trendColor, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Trend</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: textCol }}>{trendName}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>View →</span>
                </button>
              )}

              {/* Related signals */}
              {related.length > 0 && (
                <div>
                  <div style={{ padding: "10px 16px 8px", fontSize: 9, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {relatedLabel}
                  </div>
                  {related.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onSelectSignal?.(r)}
                      style={{
                        textAlign: "left", background: "#f8f7f3",
                        padding: "10px 16px", cursor: "pointer", width: "100%", boxSizing: "border-box", border: "none", borderTop: "1px solid #f5f4f2",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 13, marginTop: 1 }}>{getSourceIcon(r.source)}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#222", lineHeight: 1.4 }}>{r.title}</div>
                          {r.summary && (
                            <p style={{ fontSize: 11, color: "#999", margin: "4px 0 0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {r.summary}
                            </p>
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: "#ccc", marginTop: 2 }}>→</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — modal only */}
        {mode !== "sidebar" && (
          <div style={{ padding: "10px 20px", paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", borderTop: "1px solid #f0ede8", flexShrink: 0, textAlign: "center" } as React.CSSProperties}>
            <p style={{ fontSize: 10, color: "#ccc", margin: 0, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              Augmented Culture maps emerging tech against culture.<br />By Martina from{" "}
              <a href="https://open.substack.com/pub/augmentedrarity" target="_blank" rel="noopener noreferrer" style={{ color: "#bbb", textDecoration: "underline", textUnderlineOffset: 2 }}>
                Augmented Rarity
              </a>
            </p>
          </div>
        )}
    </div>
  );

  if (mode === "sidebar") return panel;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {panel}
    </div>
  );
}
