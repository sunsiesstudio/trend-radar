import { Trend, Signal } from "@/types";

// Trend center positions (React Flow units — large canvas)
export const TRENDS: Trend[] = [
  {
    id: "ai-creativity",
    name: "AI & Generative Creativity",
    description: "AI is reshaping creative production across fashion, art, music and content — from design tools to synthetic models to AI-written briefs.",
    color: "#6366f1",
    relevanceScore: 88,
    redditQuery: "AI fashion design generative",
    newsQuery: "AI generative fashion design",
    position: { x: 520, y: 380 },
  },
  {
    id: "digital-identity",
    name: "Digital Identity & Virtual Self",
    description: "How people present themselves online is becoming as important as physical appearance — avatars, digital fashion, and online persona as self-expression.",
    color: "#8b5cf6",
    relevanceScore: 82,
    redditQuery: "digital identity avatar virtual fashion",
    newsQuery: "digital identity virtual avatar fashion",
    position: { x: 1100, y: 220 },
  },
  {
    id: "ar-commerce",
    name: "AR/VR Commerce & Try-On",
    description: "Augmented and virtual reality are transforming shopping — from virtual try-on to immersive brand worlds to spatial storefronts.",
    color: "#a855f7",
    relevanceScore: 79,
    redditQuery: "AR VR shopping try-on retail",
    newsQuery: "augmented reality virtual try-on shopping",
    position: { x: 1700, y: 380 },
  },
  {
    id: "biotech-beauty",
    name: "Biotech Beauty & Skin Science",
    description: "Biology and technology are merging in beauty — from lab-grown ingredients to bioprinted skin, microbiome science to personalised formulation.",
    color: "#10b981",
    relevanceScore: 71,
    redditQuery: "biotech skincare microbiome beauty science",
    newsQuery: "biotech beauty skincare innovation",
    position: { x: 280, y: 900 },
  },
  {
    id: "sustainable-materials",
    name: "Sustainable & Bio-Materials",
    description: "A new generation of materials — algae fibres, mycelium leather, carbon-captured textiles — is replacing conventional fashion inputs.",
    color: "#14b8a6",
    relevanceScore: 74,
    redditQuery: "sustainable fashion materials mycelium algae",
    newsQuery: "sustainable bio-materials fashion innovation",
    position: { x: 900, y: 980 },
  },
  {
    id: "3d-printing",
    name: "3D Printing & On-Demand Making",
    description: "3D printing is moving from prototyping novelty to scalable on-demand fashion and beauty manufacturing — zero-waste, hyper-personalised.",
    color: "#f59e0b",
    relevanceScore: 61,
    redditQuery: "3D printing fashion footwear manufacturing",
    newsQuery: "3D printing fashion manufacturing",
    position: { x: 1500, y: 960 },
  },
  {
    id: "wearables",
    name: "Smart Wearables & Health Data",
    description: "Wearables are crossing from fitness tracking to continuous health intelligence — rings, patches, and garments that read your body in real time.",
    color: "#ec4899",
    relevanceScore: 67,
    redditQuery: "smart wearables health ring fitness tracker",
    newsQuery: "smart wearables health monitoring",
    position: { x: 1950, y: 820 },
  },
  {
    id: "neurotech",
    name: "Neurotech & Mind-Body Tech",
    description: "Neurotechnology is entering consumer life — from EEG headbands to brain-computer interfaces, adaptogens to neurocosmetics.",
    color: "#f43f5e",
    relevanceScore: 48,
    redditQuery: "neurotech BCI brain computer interface wellness",
    newsQuery: "neurotech consumer brain computer interface",
    position: { x: 460, y: 1480 },
  },
  {
    id: "spatial-computing",
    name: "Spatial Computing & Immersive Worlds",
    description: "Apple Vision Pro and spatial platforms are creating persistent digital worlds — new arenas for brand presence, experience, and community.",
    color: "#0ea5e9",
    relevanceScore: 58,
    redditQuery: "spatial computing Apple Vision Pro metaverse",
    newsQuery: "spatial computing Apple Vision Pro brands",
    position: { x: 1100, y: 1500 },
  },
  {
    id: "longevity",
    name: "Longevity & Anti-Ageing Culture",
    description: "Treating ageing as a solvable problem — not just slowing it — is becoming a mainstream cultural and commercial obsession across wellness, beauty, and lifestyle.",
    color: "#f97316",
    relevanceScore: 73,
    redditQuery: "longevity anti-aging biohacking health",
    newsQuery: "longevity anti-ageing culture wellness",
    position: { x: 1750, y: 1460 },
  },
];

export const SIGNALS: Signal[] = [
  // AI & Generative Creativity
  {
    id: "ai-s1", trendId: "ai-creativity",
    title: "Midjourney used for luxury mood boards",
    summary: "Major fashion houses are using Midjourney and Adobe Firefly to generate seasonal mood boards and concept visuals, compressing 3-week creative processes into hours.",
    source: "news", sourceName: "Business of Fashion", sourceUrl: "https://businessoffashion.com",
    date: "2026-05-12", crossLinks: ["did-s2", "did-s4"],
  },
  {
    id: "ai-s2", trendId: "ai-creativity",
    title: "AI synthetic models in H&M campaigns",
    summary: "H&M and Levi's are deploying AI-generated models to diversify campaign imagery without photoshoots. Raises major questions around transparency and authenticity.",
    source: "news", sourceName: "Vogue Business",
    date: "2026-04-28", crossLinks: ["did-s1"],
  },
  {
    id: "ai-s3", trendId: "ai-creativity",
    title: "Cala: AI from brief to tech pack",
    summary: "Cala's AI can take a concept brief and output production-ready tech packs. Early adopters report 60% faster development cycles.",
    source: "hackernews", sourceName: "Hacker News",
    date: "2026-05-20", crossLinks: [],
  },
  {
    id: "ai-s4", trendId: "ai-creativity",
    title: "Reddit: designers fear displacement",
    summary: "r/femalefashionadvice and r/malefashionadvice threads show growing anxiety among junior designers about AI replacing entry-level creative roles.",
    source: "reddit", sourceName: "r/femalefashionadvice",
    date: "2026-06-01", crossLinks: [],
  },
  {
    id: "ai-s5", trendId: "ai-creativity",
    title: "AI trend forecasting vs WGSN",
    summary: "Startups like Heuritech and Trendalytics are using computer vision on social media to predict microtrends 6 months out — threatening traditional forecasting agencies.",
    source: "news", sourceName: "WWD",
    date: "2026-05-08", crossLinks: ["did-s3"],
  },

  // Digital Identity
  {
    id: "did-s1", trendId: "digital-identity",
    title: "DressX: 4M digital garments sold",
    summary: "Digital fashion platform DressX has passed 4M digital garment sales. Consumers are spending real money on clothes they'll only wear in photos and online.",
    source: "news", sourceName: "Vogue Business",
    date: "2026-05-15", crossLinks: ["ai-s2", "arc-s1"],
  },
  {
    id: "did-s2", trendId: "digital-identity",
    title: "Fortnite x Balenciaga: gaming fashion",
    summary: "Luxury fashion's entry into gaming is deepening. Balenciaga, Gucci and Burberry have active in-game presences with millions of digital item sales.",
    source: "reddit", sourceName: "r/gaming",
    date: "2026-04-10", crossLinks: ["ai-s1", "spc-s1"],
  },
  {
    id: "did-s3", trendId: "digital-identity",
    title: "Avatar personalisation as status signal",
    summary: "Research shows Gen Z treats avatar appearance with the same social weight as physical dress. Digital exclusives create the same scarcity dynamics as limited physical drops.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-03-22", crossLinks: ["ai-s5"],
  },
  {
    id: "did-s4", trendId: "digital-identity",
    title: "Ready Player Me: 40M avatars",
    summary: "Cross-platform avatar system Ready Player Me has 40M avatars across 10,000 apps. A universal digital self is becoming infrastructure.",
    source: "hackernews", sourceName: "Hacker News",
    date: "2026-05-30", crossLinks: ["ai-s1", "spc-s3"],
  },
  {
    id: "did-s5", trendId: "digital-identity",
    title: "YouTube: 'fit check' going virtual",
    summary: "YouTube's fit-check video format — 2B+ views — is spawning a virtual variant where creators style their digital avatars and rate digital-only outfits.",
    source: "youtube", sourceName: "YouTube Trends",
    date: "2026-06-05", crossLinks: ["arc-s2"],
  },

  // AR/VR Commerce
  {
    id: "arc-s1", trendId: "ar-commerce",
    title: "Snap AR try-on: 250M users",
    summary: "Snap's AR try-on tool has reached 250M users. Brands report 2.4x higher purchase intent and 30% lower return rates for AR-viewed products.",
    source: "news", sourceName: "TechCrunch",
    date: "2026-05-18", crossLinks: ["did-s1", "spc-s2"],
  },
  {
    id: "arc-s2", trendId: "ar-commerce",
    title: "Apple Vision Pro virtual storefronts",
    summary: "Nike, Porsche and Net-a-Porter have launched spatial commerce experiences on Vision Pro. Immersive retail is becoming a serious brand channel.",
    source: "news", sourceName: "Dezeen",
    date: "2026-04-22", crossLinks: ["did-s5", "spc-s1"],
  },
  {
    id: "arc-s3", trendId: "ar-commerce",
    title: "Beauty AR: try before you buy",
    summary: "L'Oréal and Sephora's AR makeup try-on is reducing beauty purchase uncertainty dramatically. 70% of users who try AR-on convert versus 40% without.",
    source: "news", sourceName: "Vogue Business",
    date: "2026-05-02", crossLinks: ["bio-s1"],
  },
  {
    id: "arc-s4", trendId: "ar-commerce",
    title: "Reddit: AR fatigue emerging",
    summary: "r/malefashionadvice discussing 'AR try-on fatigue' — the gap between realistic AR preview and actual product is creating a new form of buyer disappointment.",
    source: "reddit", sourceName: "r/malefashionadvice",
    date: "2026-06-08", crossLinks: [],
  },
  {
    id: "arc-s5", trendId: "ar-commerce",
    title: "Virtual showrooms replacing trade shows",
    summary: "B2B fashion is adopting virtual showrooms. ORDRE and NuOrder report 40% of wholesale buyers now prefer virtual to physical showroom visits.",
    source: "news", sourceName: "WWD",
    date: "2026-05-25", crossLinks: ["spc-s2"],
  },

  // Biotech Beauty
  {
    id: "bio-s1", trendId: "biotech-beauty",
    title: "L'Oréal bioprinted skin testing",
    summary: "L'Oréal's partnership with Poietis for bioprinted skin has replaced 30% of animal testing. EU cosmetics regulation is accelerating this shift across the industry.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-04-14", crossLinks: ["arc-s3", "lon-s2"],
  },
  {
    id: "bio-s2", trendId: "biotech-beauty",
    title: "Microbiome skincare: Gallinée raises $20M",
    summary: "Microbiome-focused skincare brand Gallinée raised $20M to scale. Consumer familiarity with 'good bacteria' from gut health is unlocking the skin market.",
    source: "news", sourceName: "Business of Fashion",
    date: "2026-05-06", crossLinks: ["lon-s1"],
  },
  {
    id: "bio-s3", trendId: "biotech-beauty",
    title: "Fermentation: the next clean beauty wave",
    summary: "K-beauty's fermentation techniques are going global. Fermented ingredients (galactomyces, bifida) outperform synthetics on Reddit's r/SkincareAddiction.",
    source: "reddit", sourceName: "r/SkincareAddiction",
    date: "2026-05-29", crossLinks: [],
  },
  {
    id: "bio-s4", trendId: "biotech-beauty",
    title: "AI + biology: personalised serum formulation",
    summary: "Startups are combining skin microbiome analysis with AI to formulate personalised serums on demand — a subscription skincare that evolves with your skin.",
    source: "hackernews", sourceName: "Hacker News",
    date: "2026-06-02", crossLinks: ["ai-s3"],
  },
  {
    id: "bio-s5", trendId: "biotech-beauty",
    title: "Adaptogens moving from wellness to skincare",
    summary: "Ashwagandha, reishi and lion's mane are appearing in topical formulas. The wellness-to-beauty ingredient pipeline is accelerating.",
    source: "news", sourceName: "Allure",
    date: "2026-05-11", crossLinks: ["neu-s2", "lon-s3"],
  },

  // Sustainable Materials
  {
    id: "sus-s1", trendId: "sustainable-materials",
    title: "Bolt Threads Mylo: Hermès partnership",
    summary: "Mylo mycelium leather has been adopted by Hermès and Stella McCartney. First commercial-scale production run sold out in 48 hours.",
    source: "news", sourceName: "Dezeen",
    date: "2026-04-05", crossLinks: ["3dp-s3"],
  },
  {
    id: "sus-s2", trendId: "sustainable-materials",
    title: "Algae-based fibre: Algaeing scales",
    summary: "Algaeing has secured three fashion group partnerships to replace synthetic dyes and fibres with algae-based alternatives. Carbon-negative in production.",
    source: "news", sourceName: "Fast Company",
    date: "2026-05-17", crossLinks: ["3dp-s2"],
  },
  {
    id: "sus-s3", trendId: "sustainable-materials",
    title: "Reddit r/Sustainable Fashion: greenwashing fatigue",
    summary: "Community discussions show increasing sophistication — consumers are demanding LCA (lifecycle analysis) data, not just 'recycled' labels.",
    source: "reddit", sourceName: "r/SustainableFashion",
    date: "2026-06-03", crossLinks: [],
  },
  {
    id: "sus-s4", trendId: "sustainable-materials",
    title: "AirCarbon: carbon-captured plastic replaces nylon",
    summary: "Newlight Technologies' AirCarbon (made from greenhouse gas) is entering fashion production. Dell and Ikea already use it. Fashion is next.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-04-30", crossLinks: ["3dp-s1"],
  },
  {
    id: "sus-s5", trendId: "sustainable-materials",
    title: "YouTube: material science creators boom",
    summary: "Channels explaining biomaterials and sustainable chemistry are exploding — Material Matters has 2M subscribers, signalling consumer hunger for materials literacy.",
    source: "youtube", sourceName: "YouTube",
    date: "2026-05-24", crossLinks: [],
  },

  // 3D Printing
  {
    id: "3dp-s1", trendId: "3d-printing",
    title: "Zellerfeld: 3D-printed shoes at scale",
    summary: "Zellerfeld is 3D-printing fully recyclable shoes in 45 minutes per pair. ASICS and New Balance are in pilot programmes. The factory model is under threat.",
    source: "news", sourceName: "Wired",
    date: "2026-04-18", crossLinks: ["sus-s4"],
  },
  {
    id: "3dp-s2", trendId: "3d-printing",
    title: "Multi-material printing breaks the flexibility barrier",
    summary: "New multi-material FDM printers can combine rigid and flexible filaments in one print — solving the wearability problem that blocked fashion 3D printing.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-05-03", crossLinks: ["sus-s2"],
  },
  {
    id: "3dp-s3", trendId: "3d-printing",
    title: "Iris van Herpen: couture goes printable",
    summary: "van Herpen's AW26 collection was 100% 3D printed. Orders from 8 major museums. 3D printing is now legitimate couture, not novelty.",
    source: "news", sourceName: "Dezeen",
    date: "2026-03-30", crossLinks: ["sus-s1"],
  },
  {
    id: "3dp-s4", trendId: "3d-printing",
    title: "Reddit: DIY fashion printing community exploding",
    summary: "r/3Dprinting and r/fashiondesign crossover communities are growing. Consumers designing and printing their own accessories at home — a new form of fashion production.",
    source: "reddit", sourceName: "r/3Dprinting",
    date: "2026-05-28", crossLinks: [],
  },
  {
    id: "3dp-s5", trendId: "3d-printing",
    title: "On-demand beauty tools: 3D-printed applicators",
    summary: "Niche brands are offering custom 3D-printed makeup applicators shaped to individual lip/face profiles. Small but signals a personalisation wave.",
    source: "news", sourceName: "Allure",
    date: "2026-06-07", crossLinks: ["bio-s4"],
  },

  // Wearables
  {
    id: "wear-s1", trendId: "wearables",
    title: "Oura Ring Gen 4: mainstream health",
    summary: "Oura Ring Gen 4 sold 2M units in 2025. Health rings are mainstream accessories — the question is whether fashion brands can design into this form factor.",
    source: "news", sourceName: "TechCrunch",
    date: "2026-04-08", crossLinks: ["lon-s1", "neu-s1"],
  },
  {
    id: "wear-s2", trendId: "wearables",
    title: "Smart fabric: Google x Levi's Jacquard",
    summary: "Jacquard by Google continues evolving — the latest iteration integrates gesture control and health sensing into standard denim weaves. Invisible tech.",
    source: "news", sourceName: "Wired",
    date: "2026-05-14", crossLinks: ["neu-s3"],
  },
  {
    id: "wear-s3", trendId: "wearables",
    title: "Continuous glucose monitoring goes fashion",
    summary: "CGM patches (Abbott Libre, Dexcom) are being worn openly as health signals. Fashion brands are exploring decorative patch covers — a new category.",
    source: "reddit", sourceName: "r/diabetes_t1",
    date: "2026-06-04", crossLinks: ["lon-s2"],
  },
  {
    id: "wear-s4", trendId: "wearables",
    title: "YouTube: 'wearable hauls' replacing tech reviews",
    summary: "Health wearable unboxings and reviews are merging with fashion haul culture on YouTube. Creators are styling Oura, Whoop, and patches as accessories.",
    source: "youtube", sourceName: "YouTube",
    date: "2026-05-31", crossLinks: [],
  },
  {
    id: "wear-s5", trendId: "wearables",
    title: "Luxury entering health wearables",
    summary: "Tag Heuer, Movado, and emerging jewellery brands are partnering with sensor companies to embed health monitoring in luxury jewellery. Massive price-point opportunity.",
    source: "news", sourceName: "Bloomberg",
    date: "2026-05-09", crossLinks: ["lon-s1"],
  },

  // Neurotech
  {
    id: "neu-s1", trendId: "neurotech",
    title: "Muse EEG headband: meditation goes biometric",
    summary: "Muse's EEG headband has 500K active users. Meditation and stress measurement is becoming data-driven — opening neurocosmetics and stress-responsive product categories.",
    source: "news", sourceName: "MIT Tech Review",
    date: "2026-04-25", crossLinks: ["wear-s1", "lon-s3"],
  },
  {
    id: "neu-s2", trendId: "neurotech",
    title: "Neurocosmetics: mood-adaptive skincare",
    summary: "Brands are formulating products that target the nervous system — adaptogens, ashwagandha, and EEG-validated ingredients for 'skin stress response'.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-05-19", crossLinks: ["bio-s5"],
  },
  {
    id: "neu-s3", trendId: "neurotech",
    title: "Neuralink: consumer BCI timeline becoming real",
    summary: "Neuralink's human trials show reading/writing capability. Consumer applications are 5+ years away but the cultural conversation is now — brands should understand implications.",
    source: "news", sourceName: "Wired",
    date: "2026-03-15", crossLinks: ["wear-s2"],
  },
  {
    id: "neu-s4", trendId: "neurotech",
    title: "Reddit: r/nootropics and beauty cross-pollinating",
    summary: "Cognitive enhancement community discussions increasingly bleed into skincare and beauty — 'skin stack' terminology borrowed from supplement culture.",
    source: "reddit", sourceName: "r/nootropics",
    date: "2026-05-27", crossLinks: ["bio-s5"],
  },
  {
    id: "neu-s5", trendId: "neurotech",
    title: "Calm and Headspace: wellness as daily ritual",
    summary: "Calm (150M users) and Headspace are normalising daily neurowellness routines. Brands that connect to this ritual have a powerful behaviour anchor.",
    source: "news", sourceName: "Fast Company",
    date: "2026-04-19", crossLinks: ["lon-s3"],
  },

  // Spatial Computing
  {
    id: "spc-s1", trendId: "spatial-computing",
    title: "Apple Vision Pro: 2M units sold",
    summary: "Vision Pro hit 2M units in 18 months — slower than iPhone but faster than iPad. Spatial app ecosystem is growing. Fashion brands building experiences now get first-mover advantage.",
    source: "news", sourceName: "Bloomberg",
    date: "2026-05-21", crossLinks: ["did-s2", "arc-s2"],
  },
  {
    id: "spc-s2", trendId: "spatial-computing",
    title: "Net-a-Porter spatial flagship",
    summary: "Net-a-Porter's Vision Pro app lets users browse a life-size virtual boutique. Conversion rate is 3x their standard app — presence and scale matter in spatial.",
    source: "news", sourceName: "Vogue Business",
    date: "2026-05-16", crossLinks: ["arc-s1", "arc-s5"],
  },
  {
    id: "spc-s3", trendId: "spatial-computing",
    title: "Avatar persistence: same self across worlds",
    summary: "Cross-platform avatar standards (Open Metaverse ID, Ready Player Me) are enabling a persistent digital self. Your digital identity follows you across games, apps, workplaces.",
    source: "hackernews", sourceName: "Hacker News",
    date: "2026-06-01", crossLinks: ["did-s4"],
  },
  {
    id: "spc-s4", trendId: "spatial-computing",
    title: "YouTube creators building in spatial",
    summary: "A new creator category is emerging: spatial experience designers. YouTube tutorials on visionOS development are up 400% YoY.",
    source: "youtube", sourceName: "YouTube",
    date: "2026-05-27", crossLinks: [],
  },
  {
    id: "spc-s5", trendId: "spatial-computing",
    title: "Reddit: spatial fatigue vs spatial promise",
    summary: "r/VisionPro shows split community: power users building workflows vs mainstream users returning devices. The use case gap is real and brand experiences need to solve it.",
    source: "reddit", sourceName: "r/VisionPro",
    date: "2026-06-09", crossLinks: [],
  },

  // Longevity
  {
    id: "lon-s1", trendId: "longevity",
    title: "Bryan Johnson Blueprint: $2M/year protocol goes mainstream",
    summary: "Bryan Johnson's extreme longevity protocol has spawned a mass-market version. Supplement brands, beauty lines and wearable companies are all 'longevity' branding.",
    source: "news", sourceName: "Wired",
    date: "2026-04-12", crossLinks: ["bio-s2", "wear-s1", "wear-s5"],
  },
  {
    id: "lon-s2", trendId: "longevity",
    title: "Senolytics entering beauty formulation",
    summary: "Senolytic compounds (quercetin, fisetin) are entering premium skincare. Backed by peer-reviewed research — not just marketing language.",
    source: "arxiv", sourceName: "arXiv",
    date: "2026-05-04", crossLinks: ["bio-s1", "wear-s3"],
  },
  {
    id: "lon-s3", trendId: "longevity",
    title: "Longevity clinics: $10B industry by 2028",
    summary: "Longevity clinics offering NAD+ drips, epigenetic testing, and personalised protocols are opening in every major city. A new luxury health category.",
    source: "news", sourceName: "Bloomberg",
    date: "2026-05-22", crossLinks: ["bio-s5", "neu-s1", "neu-s5"],
  },
  {
    id: "lon-s4", trendId: "longevity",
    title: "Reddit r/longevity: 400K members",
    summary: "r/longevity has 400K members discussing supplements, protocols, and research. It's consumer-driven longevity science — demanding, literate, and brand-skeptical.",
    source: "reddit", sourceName: "r/longevity",
    date: "2026-06-06", crossLinks: [],
  },
  {
    id: "lon-s5", trendId: "longevity",
    title: "YouTube: longevity creators outperform fitness",
    summary: "Andrew Huberman, Peter Attia, and Rhonda Patrick have collectively surpassed traditional fitness creators in views. Longevity content is the new wellness genre.",
    source: "youtube", sourceName: "YouTube",
    date: "2026-05-13", crossLinks: [],
  },
];

// Compute positions for all signal nodes orbiting their parent trend
export function computeLayout(): {
  trends: (Trend & { radius: number })[];
  signalPositions: Map<string, { x: number; y: number }>;
} {
  const MIN_RADIUS = 55;
  const MAX_RADIUS = 110;
  const ORBIT_PADDING = 200;
  const SIGNAL_W = 190;
  const SIGNAL_H = 64;

  const signalPositions = new Map<string, { x: number; y: number }>();
  const trends = TRENDS.map((t) => {
    const radius = MIN_RADIUS + (t.relevanceScore / 100) * (MAX_RADIUS - MIN_RADIUS);
    const signals = SIGNALS.filter((s) => s.trendId === t.id);
    const orbitRadius = radius + ORBIT_PADDING;
    signals.forEach((sig, i) => {
      const angle = (2 * Math.PI * i) / signals.length - Math.PI / 2;
      const x = t.position.x + orbitRadius * Math.cos(angle) - SIGNAL_W / 2;
      const y = t.position.y + orbitRadius * Math.sin(angle) - SIGNAL_H / 2;
      signalPositions.set(sig.id, { x, y });
    });
    return { ...t, radius };
  });

  return { trends, signalPositions };
}

export function getSourceIcon(source: Signal["source"]): string {
  return {
    reddit: "🔴",
    news: "📰",
    youtube: "▶️",
    arxiv: "🔬",
    hackernews: "🟠",
    manual: "✦",
  }[source ?? "manual"] ?? "✦";
}
