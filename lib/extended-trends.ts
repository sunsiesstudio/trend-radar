import { Trend, Signal } from "@/types";

// Colors per topic — used for chips in the UI and for new trend nodes
export const TOPIC_COLORS: Record<string, string> = {
  fashion:        "#FF8BB4",
  beauty:         "#B6D693",
  lifestyle:      "#8C93C7",
  gaming:         "#78C9A8",
  wellness:       "#A7D47C",
  "food-tech":    "#FD8326",
  "mental-health":"#C4A0CE",
  sustainability: "#53A373",
  tech:           "#FFD65C",
  health:         "#FFB04A",
};

export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  fashion:        "Fashion is where tech shows up on your body first. AI is already doing the moodboard in an afternoon. AR is making the fitting room optional. And your avatar outfit now matters as much as your real one.",
  beauty:         "Beauty is where biotech gets genuinely interesting. Microbiome science, fermented actives, exosome serums: the lab is the new beauty counter. The brands that understand biology are winning.",
  lifestyle:      "Lifestyle is where tech disappears into habit. Wearables, spatial interfaces, digital identity: all becoming invisible infrastructure for how people actually live. Most people don't notice until it's already normal.",
  gaming:         "Gaming is a live test for how attention and scarcity work. Drop mechanics, NPC aesthetics, virtual status objects: a whole generation learning new rules for desire. The rest of retail is paying attention.",
  wellness:       "Wellness has fully industrialised. Cold exposure, cortisol management, biometric feedback: all product categories now. The body as an optimisation project is a massive market and it is only getting bigger.",
  "food-tech":    "Functional food is becoming a lifestyle prop. Adaptogens, nootropics, personalised microbiome plans: part of the visible, curated self now. What you carry says as much as what you wear.",
  "mental-health":"Mental health language has crossed into mainstream product design. Dopamine loops, therapeutic aesthetics, nervous system regulation: product briefs now, not just clinical concepts.",
  sustainability: "Sustainability is table stakes, not a USP anymore. The frontier is material provenance, digital product passports, and circular models that actually close the loop. The EU is forcing the pace.",
  tech:           "Tech is the thread underneath every trend on this board. The question is never whether it is involved. It is which tech becomes invisible fastest, disappearing into behaviour and culture.",
  health:         "Consumer health is dissolving the boundary between medical and lifestyle. At-home diagnostics, biometric wearables, longevity clinics: information that used to sit behind a doctor's appointment, now in your hands.",
};

// Normalise user input to a canonical topic key
const TOPIC_ALIASES: Record<string, string> = {
  "food tech":      "food-tech",
  "foodtech":       "food-tech",
  "food technology":"food-tech",
  "mental health":  "mental-health",
  "mentalhealth":   "mental-health",
  "mind":           "mental-health",
  "video games":    "gaming",
  "esports":        "gaming",
  "games":          "gaming",
  "game":           "gaming",
  "health tech":    "health",
  "healthtech":     "health",
  "biotech":        "wellness",
  "well-being":     "wellness",
  "wellbeing":      "wellness",
  "eco":            "sustainability",
  "environment":    "sustainability",
  "green":          "sustainability",
  "climate":        "sustainability",
  "technology":     "tech",
  "ai":             "tech",
};

export function normaliseTopicKey(input: string): string {
  const clean = input.toLowerCase().trim().replace(/\s+/g, " ");
  return TOPIC_ALIASES[clean] ?? clean;
}

// Curated trends for additional topics beyond the default three.
// Positions are in the same format as TREND_POSITIONS (top-left of bounding box).
const EXTENDED_TRENDS: Trend[] = [
  // ── GAMING ────────────────────────────────────────────────────────────────
  {
    id: "gaming-npc-aesthetics",
    name: "NPC Aesthetics",
    description: "Video game NPC aesthetics have crossed from ironic meme into genuine fashion direction. That blank affect, the uniform dressing, the repetition, brands are actually running with it now.",
    color: "#78C9A8",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 71,
    redditQuery: "NPC aesthetic fashion streetwear",
    newsQuery: "NPC aesthetic fashion trend",
    position: { x: 368, y: 1968 },
    whyRelevant: "When a gaming aesthetic becomes a fashion direction it signals that gaming culture has enough mainstream reach to influence taste, not just consume product. Brands that understand this early can shape the reference frame rather than react to it.",
    trajectory: "NPC aesthetics will peak as irony and cross into earnest adoption within 12 months, the same path that 'normcore' and 'gorpcore' took. The brands that own it will be those that commit before it fully arrives.",
    nextSteps: [
      "Audit your campaign photography for NPC visual cues — flat affect, uniform dressing, repetition — and test small-scale executions",
      "Map which gaming communities are already styling themselves this way to identify early adopters worth engaging",
    ],
    macroContext: "Video game characters have become cultural reference points for an entire generation raised inside game worlds. The NPC specifically — the non-player character, scripted, unchanging — has become a meme for automation anxiety, which fashion absorbed and then aestheticised.",
  },
  {
    id: "gaming-drop-economy",
    name: "The Drop Economy",
    description: "Gaming rewired how a generation thinks about scarcity and timing. Loot boxes, seasonal drops, battle pass exclusives, all of it trained people to feel urgency in a very specific way, and fashion is borrowing those exact same mechanics.",
    color: "#FFD65C",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 65,
    redditQuery: "gaming limited drop fashion streetwear scarcity",
    newsQuery: "gaming drop model fashion retail strategy",
    position: { x: 948, y: 1968 },
    whyRelevant: "A generation conditioned by battle passes, seasonal rotations, and FOMO-engineered item scarcity in games is bringing those expectations to physical retail. The brands that structure releases around this psychology will outperform on engagement and conversion.",
    trajectory: "Physical retail will continue borrowing gaming drop mechanics — waitlists, countdown timers, gamified loyalty — until the model is table stakes. The next frontier is cross-platform items that exist simultaneously in a game world and as a physical object.",
    nextSteps: [
      "Map your current product release cadence against gaming seasonal models — are you leaving urgency psychology untapped?",
      "Run one limited digital-physical drop with a gaming audience to test conversion mechanics before committing to a programme",
    ],
    macroContext: "The drop economy in gaming was engineered to maximise engagement metrics, not product value. When fashion adopted limited drops, it inherited both the mechanics and the psychological conditioning — a consumer primed to refresh, queue, and feel scarcity as excitement rather than frustration.",
  },

  // ── WELLNESS ──────────────────────────────────────────────────────────────
  {
    id: "wellness-cold-ritual",
    name: "The Cold Ritual",
    description: "Ice baths, cold plunge, and breathwork have crossed from elite athlete recovery into mainstream lifestyle ritual, spawning a hardware and hospitality category.",
    color: "#A7D47C",
    topics: ["wellness", "lifestyle", "health"],
    relevanceScore: 68,
    redditQuery: "cold plunge ice bath wellness routine lifestyle",
    newsQuery: "cold exposure wellness trend consumer",
    position: { x: 1528, y: 1968 },
    whyRelevant: "Cold exposure has become a lifestyle signal — something people display as much as practice. That combination of genuine efficacy and high social visibility creates a hardware and experience category worth mapping.",
    trajectory: "The cold ritual moves from boutique wellness into hotel amenity, workplace wellbeing, and eventually home design as a standard fixture. The aesthetic of cold exposure — stark, minimal, functional — will influence product and interior design language broadly.",
    nextSteps: [
      "Map the cold ritual's brand adjacencies — what products are people displaying alongside their plunge routines?",
      "Consider how your category intersects with the physiology-as-identity narrative cold exposure represents",
    ],
    macroContext: "Extreme physiological inputs have always been ritualised at the elite level — from sweat lodges to cryotherapy suites. The democratisation happened when the science became accessible, the hardware became affordable, and the social proof multiplied through visible daily habit content on TikTok and Instagram.",
  },
  {
    id: "wellness-cortisol",
    name: "Cortisol Culture",
    description: "Stress management is moving from self-help into product design: brands building entire lines around the science of cortisol reduction, from supplements to workwear.",
    color: "#FF8BB4",
    topics: ["wellness", "beauty", "lifestyle"],
    relevanceScore: 62,
    redditQuery: "cortisol stress management product skincare wellness",
    newsQuery: "cortisol reduction beauty wellness product trend",
    position: { x: -32, y: 2568 },
    whyRelevant: "When a biological marker becomes a product brief, it signals that a health concept has crossed into consumer mainstream. Cortisol is doing that now — it's being used to sell everything from skincare to mattresses to office chairs.",
    trajectory: "Cortisol will become a marketing term the way 'collagen' and 'antioxidant' did — used across categories, sometimes accurately, sometimes not. Brands that build genuine science into their cortisol claims early will own the authority position before the space becomes noisy.",
    nextSteps: [
      "Audit whether your product benefits can be expressed in cortisol/stress-reduction language without overclaiming",
      "Map the cortisol economy's adjacent categories to find unexpected partnership or product opportunity",
    ],
    macroContext: "Cortisol as a consumer concept is downstream of a broader cultural anxiety about chronic stress, which epidemiological data validates — burnout rates, sleep disorder diagnoses, and anxiety medication prescriptions are all at historic highs in working-age populations. Products that acknowledge this reality are meeting a genuine need.",
  },

  // ── FOOD-TECH ─────────────────────────────────────────────────────────────
  {
    id: "foodtech-functional",
    name: "Functional Food as Accessory",
    description: "Adaptogenic drinks, nootropic snacks, and precision nutrition products are becoming visible lifestyle props, displayed and carried like signifiers of an optimised life.",
    color: "#FD8326",
    topics: ["food-tech", "wellness", "lifestyle"],
    relevanceScore: 59,
    redditQuery: "adaptogenic drinks nootropic functional food lifestyle",
    newsQuery: "functional beverage lifestyle brand trend",
    position: { x: 548, y: 2568 },
    whyRelevant: "When food becomes a signifier rather than just sustenance, it enters fashion logic — scarcity, visible display, brand affiliation. Functional food brands that understand this are building lifestyle companies, not nutrition companies.",
    trajectory: "Functional food will follow the same premiumisation arc as coffee — moving from health-store niche to everyday premium, with the leading brands becoming lifestyle identifiers. The aesthetic sophistication of packaging will be as important as the formulation.",
    nextSteps: [
      "Map how your target consumer displays food and beverage choices — Instagram, stovetop, office desk — and what those choices signal",
      "Consider whether your brand architecture can extend into functional food adjacencies without losing positioning",
    ],
    macroContext: "The Erewhon economy is the clearest signal: a grocery store in Los Angeles has become a celebrity destination and brand collaboration partner because it curates functional food as aesthetic lifestyle objects. When a supermarket becomes a status symbol, the category has permanently shifted.",
  },
  {
    id: "foodtech-precision",
    name: "Precision Nutrition",
    description: "DNA- and microbiome-based personalised nutrition is crossing from clinical into consumer, with testing kits and AI-generated meal plans reaching early-majority adoption.",
    color: "#B6D693",
    topics: ["food-tech", "wellness", "health"],
    relevanceScore: 64,
    redditQuery: "personalized nutrition DNA microbiome diet app",
    newsQuery: "precision nutrition consumer personalised diet technology",
    position: { x: 1128, y: 2568 },
    whyRelevant: "Personalisation is the most powerful word in consumer marketing right now, and precision nutrition delivers it at a biological level. The brands that understand this will build loyalty that generic nutrition companies cannot replicate.",
    trajectory: "Genomic sequencing costs dropped 90% in five years. Within 24 months, DNA-based nutrition guidance will be available at mass market price points. The question for brands is whether to build proprietary data or plug into existing platforms.",
    nextSteps: [
      "Evaluate whether your product or service category has a personalisation story that precision nutrition data could tell",
      "Map the leading platforms (ZOE, Viome, Nutrigenomix) and assess partnership versus competitive positioning",
    ],
    macroContext: "The convergence of affordable genomics, consumer microbiome testing, and AI-powered dietary modelling has created a category that is simultaneously more scientific than previous nutrition fads and more accessible. It's the first time that genuinely personalised health advice has been within reach of a mainstream consumer.",
  },

  // ── MENTAL-HEALTH ─────────────────────────────────────────────────────────
  {
    id: "mentalhealth-dopamine",
    name: "Dopamine Design",
    description: "Product designers and brand strategists are explicitly borrowing the neuroscience of reward and pleasure, designing for dopamine responses rather than functional utility.",
    color: "#C4A0CE",
    topics: ["mental-health", "lifestyle", "beauty"],
    relevanceScore: 73,
    redditQuery: "dopamine design product UX reward psychology consumer",
    newsQuery: "dopamine design retail experience neuroscience brand",
    position: { x: 1708, y: 2568 },
    whyRelevant: "Dopamine design is neuroscience applied to commercial psychology. It's already everywhere — from the satisfying click of a premium lid to the colour sequencing in a luxury unboxing. Making it explicit as a design brief is a competitive edge.",
    trajectory: "Dopamine design moves from UX/digital (where it originated in games and social media) into physical retail and product design as a standard brief element. Brands that do not design for reward loops will feel flat next to those that do.",
    nextSteps: [
      "Audit your customer journey for dopamine moments — where does the experience deliver unexpected reward?",
      "Commission one product or packaging design specifically briefed around dopamine response mechanics",
    ],
    macroContext: "The neuroscience of reward has been applied systematically to digital products for over a decade — every social media platform, every game, every app has been optimised for dopamine-driven engagement. Physical consumer brands are late to this, which means the gains available to early movers are disproportionate.",
  },
  {
    id: "mentalhealth-therapeutic",
    name: "Therapeutic Aesthetics",
    description: "The visual and material language of therapy, think softness, safety cues, earth tones, and a rejection of stimulation, is becoming a mainstream aesthetic in fashion and brand identity.",
    color: "#FFB04A",
    topics: ["mental-health", "lifestyle", "beauty"],
    relevanceScore: 67,
    redditQuery: "therapeutic aesthetic calm design wellness brand visual",
    newsQuery: "therapeutic aesthetics brand design trend calming",
    position: { x: 168, y: 3168 },
    whyRelevant: "Therapeutic aesthetics is a cultural response to digital overstimulation — a collective nervous system expressing a need for less. Brands that design with this in mind are not just trend-following; they are meeting a genuine physiological need.",
    trajectory: "Therapeutic aesthetics will peak as a conscious trend and then become baseline expectation — the same way 'clean beauty' moved from positioning to category standard. The brands that own the therapeutic visual language now will define what 'calm' looks like in their category.",
    nextSteps: [
      "Audit your visual identity against therapeutic design principles: does it create arousal or reduce it?",
      "Test a 'low-stimulation' version of your digital touchpoints (packaging, website, social) with your audience",
    ],
    macroContext: "The convergence of documented mental health crises across demographics, widespread awareness of how digital design weaponises attention, and a post-pandemic reassessment of what 'a good environment' means has created the conditions for therapeutic aesthetics to move from niche wellness positioning to mainstream brand strategy.",
  },
];

export const TOPIC_LIBRARY: Record<string, Trend[]> = {
  gaming:         EXTENDED_TRENDS.filter(t => t.topics?.includes("gaming")),
  wellness:       EXTENDED_TRENDS.filter(t => t.topics?.includes("wellness")),
  "food-tech":    EXTENDED_TRENDS.filter(t => t.topics?.includes("food-tech")),
  "mental-health":EXTENDED_TRENDS.filter(t => t.topics?.includes("mental-health")),
};

export const EXTENDED_SIGNALS: Signal[] = [
  // gaming-npc-aesthetics
  { id: "gnpc-s1", trendId: "gaming-npc-aesthetics", title: "Miu Miu AW24 collection references NPC stillness", summary: "Fashion houses are borrowing the deliberate flatness of video game character design as a counterpoint to the maximalism of the past decade.", source: "news", sourceName: "Vogue", date: "2026-02-10", crossLinks: [] },
  { id: "gnpc-s2", trendId: "gaming-npc-aesthetics", title: "r/streetwear: NPC mode is the new core aesthetic", summary: "The NPC aesthetic — blank affect, uniform dressing, identical repetition — has crossed from ironic TikTok content into genuine subcultural style positioning.", source: "reddit", sourceName: "r/streetwear", date: "2026-03-15", crossLinks: [] },
  { id: "gnpc-s3", trendId: "gaming-npc-aesthetics", title: "SSENSE editorial: 'dressing like you spawned'", summary: "Independent fashion media is legitimising gaming-derived aesthetics with editorial frames, signalling movement from fringe to fashion mainstream.", source: "news", sourceName: "SSENSE", date: "2026-04-01", crossLinks: [] },

  // gaming-drop-economy
  { id: "gdrop-s1", trendId: "gaming-drop-economy", title: "Nike SNKRS waitlist psychology crosses into luxury", summary: "Limited digital drops in gaming have trained a generation to expect scarcity theatre; fashion brands are copying the mechanics wholesale.", source: "news", sourceName: "Business of Fashion", date: "2026-01-20", crossLinks: [] },
  { id: "gdrop-s2", trendId: "gaming-drop-economy", title: "Loot box litigation fuelling regulation that could touch blind box fashion drops", summary: "Legal challenges to randomised-reward mechanics in gaming are creating regulatory precedents that will eventually touch physical fashion's mystery drop formats.", source: "news", sourceName: "Wired", date: "2026-02-28", crossLinks: [] },

  // wellness-cold-ritual
  { id: "wcold-s1", trendId: "wellness-cold-ritual", title: "Plunge pool installations in luxury hotel fitness suites double in 2024", summary: "Cold exposure has moved from athlete recovery niche to amenity expectation, signalling mainstream aspirational adoption.", source: "news", sourceName: "Financial Times", date: "2026-01-05", crossLinks: [] },
  { id: "wcold-s2", trendId: "wellness-cold-ritual", title: "Cold plunge hardware enters premium home design — Plunge Pro sells out 3x in 2025", summary: "The cold plunge market is developing the same design-object logic as premium coffee equipment, indicating a shift from functional to identity-expressive.", source: "news", sourceName: "TechCrunch", date: "2026-03-10", crossLinks: [] },

  // wellness-cortisol
  { id: "wcort-s1", trendId: "wellness-cortisol", title: "Glossier launches stress-aware skincare sub-line citing cortisol science", summary: "Major beauty brands are explicitly building cortisol management into product briefs, treating chronic stress as a skin-level phenomenon requiring topical intervention.", source: "news", sourceName: "WWD", date: "2026-02-14", crossLinks: [] },
  { id: "wcort-s2", trendId: "wellness-cortisol", title: "Office design pivoting to low-arousal environments after burnout wave", summary: "Workplace design is borrowing therapeutic neuroscience, creating demand for materials, textiles, and objects engineered to reduce physiological stress responses.", source: "news", sourceName: "Dezeen", date: "2026-04-05", crossLinks: [] },

  // foodtech-functional
  { id: "ffunc-s1", trendId: "foodtech-functional", title: "Erewhon collab culture signals food-as-fashion-prop era", summary: "The ritualistic display of functional beverages in urban environments mirrors luxury accessory logic, transforming nutrition into visible social signalling.", source: "news", sourceName: "NY Magazine", date: "2026-01-30", crossLinks: [] },
  { id: "ffunc-s2", trendId: "foodtech-functional", title: "Liquid IV and functional brands enter fashion week gifting suites", summary: "The boundary between supplement brand and fashion lifestyle brand is dissolving, opening cross-category brand strategy opportunities.", source: "news", sourceName: "Hypebeast", date: "2026-03-02", crossLinks: [] },

  // foodtech-precision
  { id: "fprec-s1", trendId: "foodtech-precision", title: "ZOE hits 500k subscribers for microbiome-based nutrition plans", summary: "Consumer adoption of personalised nutrition intelligence is moving beyond early adopters into lifestyle mainstream.", source: "news", sourceName: "BBC Tech", date: "2026-02-22", crossLinks: [] },
  { id: "fprec-s2", trendId: "foodtech-precision", title: "Genomic sequencing costs drop 90% in five years — nutrition implications", summary: "The democratisation of genomic data will make DNA-based nutrition planning accessible at mass market price points within 24 months.", source: "news", sourceName: "The Economist", date: "2026-01-18", crossLinks: [] },

  // mentalhealth-dopamine
  { id: "mdopa-s1", trendId: "mentalhealth-dopamine", title: "Muji redesigns checkout experience around dopamine release timing", summary: "Retail design is explicitly hiring neuroscientists to optimise purchase-moment reward experiences rather than just aesthetic presentation.", source: "news", sourceName: "Dezeen", date: "2026-03-20", crossLinks: [] },
  { id: "mdopa-s2", trendId: "mentalhealth-dopamine", title: "Gaming UX mechanics become standard retail design brief", summary: "The mechanics that make mobile games compulsive are being consciously imported into fashion retail environments and e-commerce flows.", source: "news", sourceName: "Wired", date: "2026-04-10", crossLinks: [] },

  // mentalhealth-therapeutic
  { id: "mther-s1", trendId: "mentalhealth-therapeutic", title: "Aesop interiors programme prioritises 'nervous system safety'", summary: "Luxury retail is adopting trauma-informed design language to differentiate flagship environments from mass-market stimulation overload.", source: "news", sourceName: "Wallpaper*", date: "2026-02-08", crossLinks: [] },
  { id: "mther-s2", trendId: "mentalhealth-therapeutic", title: "Earth tones dominate SS25 across 7 major houses — a trend or a signal?", summary: "The aesthetic convergence around muted, grounding colour palettes across fashion is read as a collective nervous system response to digital overstimulation.", source: "news", sourceName: "Business of Fashion", date: "2026-01-12", crossLinks: [] },
];
