import { Trend, Signal } from "@/types";

export const TOPIC_COLORS: Record<string, string> = {
  fashion:           "#FF8BB4",
  beauty:            "#B6D693",
  lifestyle:         "#8C93C7",
  gaming:            "#78C9A8",
  wellness:          "#A7D47C",
  "food-tech":       "#FD8326",
  "mental-health":   "#C4A0CE",
  sustainability:    "#53A373",
  tech:              "#FFD65C",
  health:            "#FFB04A",
  "interior-design": "#C4A0CE",
  travel:            "#78C9A8",
  fitness:           "#A7D47C",
  music:             "#FF8BB4",
  art:               "#8C93C7",
  luxury:            "#FFD65C",
  food:              "#FD8326",
  skincare:          "#B6D693",
  sport:             "#78C9A8",
};

export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  fashion:           "Fashion is where tech shows up on your body first. AI is already doing the moodboard in an afternoon. AR is making the fitting room optional. And your avatar outfit now matters as much as your real one.",
  beauty:            "Beauty is where biotech gets genuinely interesting. Microbiome science, fermented actives, exosome serums: the lab is the new beauty counter. The brands that understand biology are winning.",
  lifestyle:         "Lifestyle is where tech disappears into habit. Wearables, spatial interfaces, digital identity: all becoming invisible infrastructure for how people actually live.",
  gaming:            "Gaming is a live test for how attention and scarcity work. Drop mechanics, NPC aesthetics, virtual status objects: a whole generation learning new rules for desire.",
  wellness:          "Wellness has fully industrialised. Cold exposure, cortisol management, biometric feedback: all product categories now.",
  "food-tech":       "Functional food is becoming a lifestyle prop. Adaptogens, nootropics, personalised microbiome plans: part of the visible, curated self now.",
  "mental-health":   "Mental health language has crossed into mainstream product design. Dopamine loops, therapeutic aesthetics, nervous system regulation: product briefs now, not just clinical concepts.",
  sustainability:    "Sustainability is table stakes, not a USP anymore. The frontier is material provenance, digital product passports, and circular models that actually close the loop.",
  tech:              "Tech is the thread underneath every trend on this board. The question is never whether it is involved — it's which tech becomes invisible fastest.",
  health:            "Consumer health is dissolving the boundary between medical and lifestyle. At-home diagnostics, biometric wearables, longevity clinics: information that used to sit behind a doctor's appointment, now in your hands.",
  "interior-design": "Interior design is where spatial computing and material science are colliding. AI is doing the moodboard in hours, AR is replacing the showroom, and smart materials are turning the home into a living system.",
  travel:            "Travel is where AI personalisation, immersive tech, and sustainability pressure are all landing at once. The itinerary is becoming intelligent. The destination is becoming augmented.",
  fitness:           "Fitness is being quantified at the biological level. Continuous glucose monitors, HRV tracking, AI programming: the body as a data system is the dominant consumer health metaphor right now.",
  music:             "Music is the first creative category where AI generation reached genuine consumer adoption. Suno, Udio, and spatial audio are restructuring how music is made, heard, and monetised.",
  art:               "Art is where AI legitimacy battles are happening in real time. Christie's, MoMA, and major galleries are all taking positions. The phygital art object is becoming a new category entirely.",
  luxury:            "Luxury is where tech is being used to deepen exclusivity, not democratise it. Blockchain provenance, AI personalisation, and spatial experiences are all tools for stratification, not access.",
  food:              "Food is where biotech, AI, and sustainability are all landing simultaneously. Cultivated protein, AI-matched flavour, and personalised nutrition are reshaping what eating means.",
  skincare:          "Skincare is where biotech is most commercially advanced. Microbiome science, exosomes, AI-matched formulations: the gap between pharmaceutical and cosmetic is closing fast.",
  sport:             "Sport is where wearable biometrics, AI coaching, and immersive viewing are colliding. The boundary between professional training and consumer self-optimisation is dissolving.",
  fitness:           "Fitness is being quantified at the biological level. CGM, HRV, sleep staging: the body as a data system is the dominant metaphor in consumer health right now.",
};

const TOPIC_ALIASES: Record<string, string> = {
  // food
  "food tech":        "food-tech",
  "foodtech":         "food-tech",
  "food technology":  "food-tech",
  // mental health
  "mental health":    "mental-health",
  "mentalhealth":     "mental-health",
  "mind":             "mental-health",
  "mindfulness":      "mental-health",
  // gaming
  "video games":      "gaming",
  "esports":          "gaming",
  "games":            "gaming",
  "game":             "gaming",
  // health
  "health tech":      "health",
  "healthtech":       "health",
  "biotech":          "wellness",
  "well-being":       "wellness",
  "wellbeing":        "wellness",
  // sustainability
  "eco":              "sustainability",
  "environment":      "sustainability",
  "green":            "sustainability",
  "climate":          "sustainability",
  // tech
  "technology":       "tech",
  "ai":               "tech",
  // interior design
  "interior design":  "interior-design",
  "interiors":        "interior-design",
  "home design":      "interior-design",
  "home decor":       "interior-design",
  "decoration":       "interior-design",
  "decor":            "interior-design",
  "home":             "interior-design",
  "architecture":     "interior-design",
  "design":           "interior-design",
  // travel
  "travelling":       "travel",
  "tourism":          "travel",
  "hospitality":      "travel",
  "hotels":           "travel",
  // fitness / sport
  "sports":           "fitness",
  "sport":            "fitness",
  "exercise":         "fitness",
  "gym":              "fitness",
  "workout":          "fitness",
  "running":          "fitness",
  "training":         "fitness",
  "athletics":        "fitness",
  // music
  "audio":            "music",
  "sound":            "music",
  // art
  "arts":             "art",
  "creative":         "art",
  "creativity":       "art",
  // skincare
  "skin":             "skincare",
  "skin care":        "skincare",
  "dermatology":      "skincare",
  // luxury
  "high end":         "luxury",
  "haute couture":    "luxury",
  "premium":          "luxury",
  // food (general)
  "cooking":          "food",
  "culinary":         "food",
  "cuisine":          "food",
  "gastronomy":       "food",
};

export function normaliseTopicKey(input: string): string {
  const clean = input.toLowerCase().trim().replace(/\s+/g, " ");
  const aliased = TOPIC_ALIASES[clean] ?? clean;
  // Always hyphenate so keys match what the API route stores in trend.topics
  return aliased.replace(/\s+/g, "-");
}

// ─── Library ──────────────────────────────────────────────────────────────────

const EXTENDED_TRENDS: Trend[] = [

  // ── GAMING ──────────────────────────────────────────────────────────────────
  {
    id: "gaming-npc-aesthetics",
    name: "NPC Aesthetics",
    description: "Video game NPC aesthetics have crossed from ironic meme into genuine fashion direction. That blank affect, the uniform dressing, the repetition — brands are actually running with it now.",
    color: "#78C9A8",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 71,
    redditQuery: "NPC aesthetic fashion streetwear",
    newsQuery: "NPC aesthetic fashion trend",
    position: { x: 368, y: 1968 },
    whyRelevant: "When a gaming aesthetic becomes a fashion direction it signals that gaming culture has enough mainstream reach to influence taste, not just consume product.",
    trajectory: "NPC aesthetics will peak as irony and cross into earnest adoption within 12 months — the same path normcore and gorpcore took.",
    nextSteps: [],
  },
  {
    id: "gaming-drop-economy",
    name: "The Drop Economy",
    description: "Gaming rewired how a generation thinks about scarcity and timing. Loot boxes, seasonal drops, battle pass exclusives: all of it trained people to feel urgency in a very specific way, and fashion is borrowing those same mechanics.",
    color: "#FFD65C",
    topics: ["gaming", "fashion", "lifestyle"],
    relevanceScore: 65,
    redditQuery: "gaming limited drop fashion streetwear scarcity",
    newsQuery: "gaming drop model fashion retail strategy",
    position: { x: 948, y: 1968 },
    whyRelevant: "A generation conditioned by battle passes and FOMO-engineered scarcity in games is bringing those expectations to physical retail.",
    trajectory: "Physical retail will continue borrowing gaming drop mechanics — waitlists, countdown timers, gamified loyalty — until the model is table stakes.",
    nextSteps: [],
  },

  // ── WELLNESS ────────────────────────────────────────────────────────────────
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
    whyRelevant: "Cold exposure has become a lifestyle signal — something people display as much as practice.",
    trajectory: "The cold ritual moves from boutique wellness into hotel amenity, workplace wellbeing, and eventually home design as a standard fixture.",
    nextSteps: [],
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
    whyRelevant: "When a biological marker becomes a product brief, it signals that a health concept has crossed into consumer mainstream.",
    trajectory: "Cortisol will become a marketing term the way 'collagen' did — used across categories. Brands that build genuine science in early own the authority position.",
    nextSteps: [],
  },

  // ── FOOD-TECH ───────────────────────────────────────────────────────────────
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
    whyRelevant: "When food becomes a signifier rather than just sustenance, it enters fashion logic — scarcity, visible display, brand affiliation.",
    trajectory: "Functional food will follow the same premiumisation arc as coffee — moving from health-store niche to everyday premium.",
    nextSteps: [],
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
    whyRelevant: "Personalisation is the most powerful word in consumer marketing right now, and precision nutrition delivers it at a biological level.",
    trajectory: "Genomic sequencing costs dropped 90% in five years. Within 24 months, DNA-based nutrition guidance will be available at mass market price points.",
    nextSteps: [],
  },

  // ── MENTAL-HEALTH ───────────────────────────────────────────────────────────
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
    whyRelevant: "Dopamine design is neuroscience applied to commercial psychology. Making it explicit as a design brief is a competitive edge.",
    trajectory: "Dopamine design moves from UX/digital into physical retail and product design as a standard brief element.",
    nextSteps: [],
  },
  {
    id: "mentalhealth-therapeutic",
    name: "Therapeutic Aesthetics",
    description: "The visual and material language of therapy — softness, safety cues, earth tones, rejection of stimulation — is becoming a mainstream aesthetic in fashion and brand identity.",
    color: "#FFB04A",
    topics: ["mental-health", "lifestyle", "beauty"],
    relevanceScore: 67,
    redditQuery: "therapeutic aesthetic calm design wellness brand visual",
    newsQuery: "therapeutic aesthetics brand design trend calming",
    position: { x: 168, y: 3168 },
    whyRelevant: "Therapeutic aesthetics is a cultural response to digital overstimulation — a collective nervous system expressing a need for less.",
    trajectory: "Therapeutic aesthetics will peak as a conscious trend and then become baseline expectation — the same way 'clean beauty' moved from positioning to category standard.",
    nextSteps: [],
  },

  // ── INTERIOR DESIGN ─────────────────────────────────────────────────────────
  {
    id: "interiordesign-ai-spatial",
    name: "AI Spatial Design",
    description: "AI tools are collapsing the distance between brief and visualisation. Architects and interior designers use generative models to produce moodboards, renders, and spatial variations in hours rather than weeks. The process is accelerating; the skill set is changing.",
    color: "#8C93C7",
    topics: ["interior-design", "design", "tech"],
    relevanceScore: 74,
    redditQuery: "AI interior design architecture tools generative midjourney",
    newsQuery: "AI interior design tools spatial computing architecture",
    position: { x: 548, y: 3768 },
    whyRelevant: "Design is being unbundled from its production bottlenecks by AI. What used to require weeks of rendering time is now accessible to anyone with a prompt. Competition shifts from production quality to creative vision.",
    trajectory: "AI design tools will be standard in every studio within 24 months — not replacing designers but redefining what 'design work' actually is. Winners will be those who understand both the tool and the taste.",
    nextSteps: [],
  },
  {
    id: "interiordesign-ar-preview",
    name: "AR Interior Preview",
    description: "Augmented reality is making the 'place it before you buy it' experience standard across furniture and home categories. IKEA Place started it; now every major furniture brand has an AR layer, and spatial computing is pushing it into full room simulation.",
    color: "#FFB04A",
    topics: ["interior-design", "tech", "lifestyle"],
    relevanceScore: 67,
    redditQuery: "AR furniture interior design spatial computing room preview",
    newsQuery: "AR interior design furniture retail spatial commerce",
    position: { x: 1128, y: 3768 },
    whyRelevant: "Purchase hesitation in home categories is almost entirely driven by fit uncertainty. AR removes that barrier at the point of consideration. Brands that deploy it see return rates drop and conversion rise.",
    trajectory: "Apple Vision Pro and cheaper AR headsets will push spatial commerce in home design from novelty to expected default. Brands without it will feel like e-commerce without product photography.",
    nextSteps: [],
  },
  {
    id: "interiordesign-smart-materials",
    name: "Smart & Biophilic Materials",
    description: "Material science and biotech are producing surfaces that actively respond to environments: self-cleaning textiles, mycelium insulation, living walls with integrated sensors. The home is becoming a biological and technological system.",
    color: "#53A373",
    topics: ["interior-design", "sustainability", "tech"],
    relevanceScore: 61,
    redditQuery: "smart materials biophilic design living walls sustainable interiors",
    newsQuery: "smart materials interior design biotech sustainable architecture",
    position: { x: 1708, y: 3768 },
    whyRelevant: "The intersection of material science and interior design is producing products that change the performance of spaces at a fundamental level. These are infrastructure innovations with aesthetic implications.",
    trajectory: "Smart and biophilic materials move from high-end commercial into residential premium within 3 years, driven by cost decreases and EU regulatory pressure on building materials.",
    nextSteps: [],
  },

  // ── TRAVEL ──────────────────────────────────────────────────────────────────
  {
    id: "travel-ai-itinerary",
    name: "AI Travel Intelligence",
    description: "AI trip planners are replacing the travel agent and the listicle simultaneously. Real-time personalisation across flights, stays, and experiences is becoming the expectation — not the premium tier.",
    color: "#78C9A8",
    topics: ["travel", "tech", "lifestyle"],
    relevanceScore: 69,
    redditQuery: "AI travel planning itinerary app personalised",
    newsQuery: "AI travel planner personalised itinerary technology",
    position: { x: 168, y: 4368 },
    whyRelevant: "The friction cost of trip planning is collapsing. Brands that own the AI planning layer own the consideration moment — and that's where intent converts to booking.",
    trajectory: "Within 18 months AI travel planning will be table stakes. The differentiation moves to data quality, personalisation depth, and cross-category integration (loyalty, dining, experiences).",
    nextSteps: [],
  },
  {
    id: "travel-immersive-tourism",
    name: "Augmented Tourism",
    description: "AR overlays on real destinations, digital twin heritage sites, and AI-guided historical narratives are turning physical travel into a mixed-reality experience. Museums are the early movers; cities are following.",
    color: "#FFD65C",
    topics: ["travel", "tech", "art"],
    relevanceScore: 63,
    redditQuery: "AR tourism augmented reality travel destination heritage",
    newsQuery: "augmented reality tourism heritage sites digital experience",
    position: { x: 748, y: 4368 },
    whyRelevant: "Immersive tech is extending the value of physical destinations beyond what the eye can see, deepening engagement and increasing dwell time. Destinations that invest in AR layers become harder to replicate and easier to return to.",
    trajectory: "AR tourism moves from experimental museum projects into mainstream city tourism within 3 years, led by destinations with strong historical IP and high Chinese and Korean tourist flows (who have highest AR adoption).",
    nextSteps: [],
  },

  // ── FITNESS ─────────────────────────────────────────────────────────────────
  {
    id: "fitness-biometric-training",
    name: "Biometric-Led Training",
    description: "Continuous glucose monitors, HRV tracking, and sleep staging are turning training from feel-based to data-driven. AI coaching that reads your physiology in real time is moving from pro athletes to serious amateurs.",
    color: "#A7D47C",
    topics: ["fitness", "health", "tech"],
    relevanceScore: 76,
    redditQuery: "CGM HRV training biometric fitness wearable data",
    newsQuery: "biometric training wearables AI coaching fitness technology",
    position: { x: 1328, y: 4368 },
    whyRelevant: "The physiological feedback loop that used to require a team of sports scientists is now on your wrist. Brands that help consumers act on that data — rather than just display it — will win the next fitness decade.",
    trajectory: "CGM for non-diabetics moves into mainstream fitness within 24 months. The question is whether the insight layer (what to do with the data) or the hardware layer (the sensor) captures more value.",
    nextSteps: [],
  },
  {
    id: "fitness-social-performance",
    name: "Social Fitness Tech",
    description: "Strava, Whoop, and their successors are making fitness data a social currency. Community, competition, and shared suffering are the real product — the hardware is just the entry point.",
    color: "#FFB04A",
    topics: ["fitness", "lifestyle", "health"],
    relevanceScore: 64,
    redditQuery: "Strava Whoop fitness social community performance data sharing",
    newsQuery: "social fitness technology community platform wearable",
    position: { x: -32, y: 4968 },
    whyRelevant: "Fitness data has become identity expression. The platform that owns the social layer owns the retention loop — and retention is where fitness brands make their real margin.",
    trajectory: "Social fitness tech consolidates around 3-4 major platforms. The brands that build native integrations into Strava and Whoop ecosystems will have distribution advantages that are hard to replicate.",
    nextSteps: [],
  },

  // ── MUSIC ───────────────────────────────────────────────────────────────────
  {
    id: "music-ai-creation",
    name: "AI Music Generation",
    description: "Suno, Udio, and a dozen serious competitors are making original music generation accessible to anyone with a text prompt. The implications for music licensing, sync, and the definition of authorship are not yet resolved.",
    color: "#FF8BB4",
    topics: ["music", "tech", "art"],
    relevanceScore: 78,
    redditQuery: "AI music generation Suno Udio artificial intelligence",
    newsQuery: "AI music generation tools copyright artists",
    position: { x: 548, y: 4968 },
    whyRelevant: "AI music generation is the fastest-moving creative AI category after image generation. The sync licensing and background music markets will be fundamentally restructured within 24 months.",
    trajectory: "AI music will become the default for low-stakes use cases (brand video, UGC, game soundtrack) within 2 years, freeing human music for high-value cultural moments. The fight is over what counts as 'high value'.",
    nextSteps: [],
  },
  {
    id: "music-spatial-audio",
    name: "Spatial Audio Experiences",
    description: "Dolby Atmos, binaural audio, and Apple Spatial Audio are making three-dimensional sound a consumer expectation. Live music, wellness audio, and gaming are all being rebuilt for the spatial layer.",
    color: "#8C93C7",
    topics: ["music", "wellness", "tech"],
    relevanceScore: 62,
    redditQuery: "spatial audio Dolby Atmos binaural wellness music immersive",
    newsQuery: "spatial audio consumer wellness music technology",
    position: { x: 1128, y: 4968 },
    whyRelevant: "Spatial audio is the first meaningful upgrade in listening experience since stereo. It's also finding unexpected applications in wellness, focus, and sleep — categories with high willingness to pay.",
    trajectory: "As spatial audio headphones become standard at sub-$200, spatial mixing becomes the baseline expectation for new music, and the wellness audio category (sleep sounds, focus music) doubles in size.",
    nextSteps: [],
  },

  // ── ART ─────────────────────────────────────────────────────────────────────
  {
    id: "art-ai-legitimacy",
    name: "AI Art Legitimacy",
    description: "Christie's sold an AI artwork for $432,500. MoMA has acquired its first AI-generated pieces. The institutional art world is taking positions, and those positions are creating new market structures in real time.",
    color: "#FFD65C",
    topics: ["art", "tech"],
    relevanceScore: 72,
    redditQuery: "AI art Christie's museum institutional legitimacy artist",
    newsQuery: "AI art institutional galleries Christie's MoMA",
    position: { x: 1708, y: 4968 },
    whyRelevant: "When institutions buy, markets form. The AI art legitimacy debate is now a market structure question — who controls provenance, authentication, and value attribution in an age of infinite generation.",
    trajectory: "AI art will split into two markets: high-value institutional pieces with explicit AI authorship and human curation, and a commoditised tier for commercial use. The middle market will be squeezed hardest.",
    nextSteps: [],
  },
  {
    id: "art-phygital-objects",
    name: "Phygital Art Objects",
    description: "Blockchain-linked physical prints, AR layers over gallery works, and NFT-backed limited editions are creating a new category: art objects that exist simultaneously in physical and digital space.",
    color: "#C4A0CE",
    topics: ["art", "tech", "luxury"],
    relevanceScore: 61,
    redditQuery: "phygital art NFT physical print blockchain AR gallery",
    newsQuery: "phygital art blockchain print edition gallery",
    position: { x: 168, y: 5568 },
    whyRelevant: "The phygital art object solves the scarcity problem of digital art and the friction problem of physical art. It's a new product category, not just a format, and the collectors who understand it earliest build the best positions.",
    trajectory: "Phygital art moves from crypto-native collectors into mainstream luxury art buyers within 3 years, driven by brands (Louis Vuitton, Nike, Gucci) who are already investing in the format.",
    nextSteps: [],
  },

  // ── SKINCARE ────────────────────────────────────────────────────────────────
  {
    id: "skincare-biotech-actives",
    name: "Biotech Skincare Actives",
    description: "Exosome serums, fermented actives, and lab-grown collagen are crossing from clinical dermatology into consumer skincare. The biotech lab is the new beauty counter.",
    color: "#B6D693",
    topics: ["skincare", "beauty", "health"],
    relevanceScore: 73,
    redditQuery: "exosome serum biotech skincare lab grown collagen actives",
    newsQuery: "biotech skincare actives exosomes fermented beauty",
    position: { x: 748, y: 5568 },
    whyRelevant: "Biotech actives are to skincare what organic farming was to food — a genuine performance difference with a story that justifies premium pricing. The brands that own biotech provenance will own the next decade of prestige skincare.",
    trajectory: "Exosome skincare, currently priced as ultra-premium, will reach accessible luxury price points within 3 years as fermentation and biotech manufacturing scales. The race is for formulation IP.",
    nextSteps: [],
  },
  {
    id: "skincare-ai-personalisation",
    name: "AI Skin Diagnostics",
    description: "Camera-based skin analysis, AI-matched formulations, and subscription personalisation are turning skincare from a category browse into a precision recommendation engine.",
    color: "#FF8BB4",
    topics: ["skincare", "beauty", "tech"],
    relevanceScore: 67,
    redditQuery: "AI skincare diagnostics personalised formulation skin analysis app",
    newsQuery: "AI skin diagnostics personalised skincare technology",
    position: { x: 1328, y: 5568 },
    whyRelevant: "Personalisation in skincare reduces churn and increases basket size simultaneously. The brands that own the diagnostic layer own the relationship — which is worth more than any single product.",
    trajectory: "AI skin diagnostics will move from premium brand differentiator to mass-market standard feature within 24 months, driven by smartphone camera improvement and falling AI inference costs.",
    nextSteps: [],
  },

  // ── LUXURY ──────────────────────────────────────────────────────────────────
  {
    id: "luxury-blockchain-provenance",
    name: "Digital Product Passports",
    description: "LVMH's Aura blockchain, Richemont's product passports, and EU Digital Product Passport regulation are turning authenticity from a marketing claim into a verifiable data layer.",
    color: "#FFD65C",
    topics: ["luxury", "sustainability", "tech"],
    relevanceScore: 71,
    redditQuery: "blockchain luxury authentication digital passport LVMH",
    newsQuery: "digital product passport luxury blockchain authentication EU",
    position: { x: 1708, y: 5568 },
    whyRelevant: "Provenance is the core value proposition of luxury. Digital product passports make provenance machine-verifiable, unlocking resale value, anti-counterfeiting, and circular business models simultaneously.",
    trajectory: "EU Digital Product Passport regulation (2027) will make blockchain provenance mandatory for luxury goods sold in Europe. The brands that build infrastructure now will define the standard for everyone else.",
    nextSteps: [],
  },
  {
    id: "luxury-ai-personalisation",
    name: "Hyper-Personalised Luxury",
    description: "AI is enabling one-to-one personalisation at scale — from bespoke product configurations to personal shopper AI that remembers every past purchase and preference across the full luxury portfolio.",
    color: "#C4A0CE",
    topics: ["luxury", "fashion", "tech"],
    relevanceScore: 65,
    redditQuery: "AI luxury personalisation bespoke customer experience high end",
    newsQuery: "AI personalisation luxury fashion customer experience",
    position: { x: 168, y: 6168 },
    whyRelevant: "Luxury was always about feeling uniquely seen. AI makes that feeling scalable. The brands that deploy AI-powered personalisation without losing the human warmth of the luxury service experience will win the next decade.",
    trajectory: "AI personal shoppers for luxury will be standard at the top 20 luxury groups within 18 months. The differentiation will be in training data quality and human-AI handoff design.",
    nextSteps: [],
  },

  // ── FOOD (general) ──────────────────────────────────────────────────────────
  {
    id: "food-cultivated-protein",
    name: "Cultivated Protein",
    description: "Lab-grown meat, precision fermentation, and mycoprotein are no longer future scenarios — they're on shelves in Singapore, approved in the US, and arriving in Europe. The protein question is being answered by biotech.",
    color: "#FD8326",
    topics: ["food", "sustainability", "health"],
    relevanceScore: 69,
    redditQuery: "cultivated meat lab grown protein fermentation consumer food",
    newsQuery: "cultivated meat precision fermentation consumer food market",
    position: { x: 748, y: 6168 },
    whyRelevant: "Cultivated protein is a structural shift in the food system, not a diet trend. The brands that position within this category now — whether as producers, retailers, or ingredient suppliers — are making category-defining bets.",
    trajectory: "Price parity with conventional meat for cultivated protein is 3-5 years away. The consumer behaviour change will follow price, not persuasion. The early period is about supply chain and regulatory position.",
    nextSteps: [],
  },
  {
    id: "food-ai-flavour",
    name: "AI Flavour Intelligence",
    description: "AI systems trained on molecular gastronomy data, global recipe databases, and flavour compound interactions are being used to develop new products, predict trend flavours, and match consumers to taste profiles.",
    color: "#B6D693",
    topics: ["food", "tech"],
    relevanceScore: 61,
    redditQuery: "AI food development flavour prediction recipe consumer",
    newsQuery: "AI food flavour development technology consumer",
    position: { x: 1328, y: 6168 },
    whyRelevant: "AI flavour development is reducing new product development cycles from 18 months to 3 months. The first brands to systematically use AI for NPD will have a compound advantage in speed and iteration.",
    trajectory: "AI-assisted flavour development will be standard in top-50 FMCG companies within 3 years. The competitive question is whether the AI advantage goes to manufacturers or to the platforms that sit above them.",
    nextSteps: [],
  },
];

// ─── Topic Library ────────────────────────────────────────────────────────────

export const TOPIC_LIBRARY: Record<string, Trend[]> = {
  gaming:           EXTENDED_TRENDS.filter(t => t.topics?.includes("gaming")),
  wellness:         EXTENDED_TRENDS.filter(t => t.topics?.includes("wellness")),
  "food-tech":      EXTENDED_TRENDS.filter(t => t.topics?.includes("food-tech")),
  "mental-health":  EXTENDED_TRENDS.filter(t => t.topics?.includes("mental-health")),
  "interior-design":EXTENDED_TRENDS.filter(t => t.topics?.includes("interior-design")),
  travel:           EXTENDED_TRENDS.filter(t => t.topics?.includes("travel")),
  fitness:          EXTENDED_TRENDS.filter(t => t.topics?.includes("fitness")),
  music:            EXTENDED_TRENDS.filter(t => t.topics?.includes("music")),
  art:              EXTENDED_TRENDS.filter(t => t.topics?.includes("art")),
  skincare:         EXTENDED_TRENDS.filter(t => t.topics?.includes("skincare")),
  luxury:           EXTENDED_TRENDS.filter(t => t.topics?.includes("luxury")),
  food:             EXTENDED_TRENDS.filter(t => t.topics?.includes("food")),
};

// ─── Extended Signals ─────────────────────────────────────────────────────────

export const EXTENDED_SIGNALS: Signal[] = [
  // gaming-npc-aesthetics
  { id: "gnpc-s1", trendId: "gaming-npc-aesthetics", title: "Miu Miu AW24 collection references NPC stillness", summary: "Fashion houses are borrowing the deliberate flatness of video game character design as a counterpoint to the maximalism of the past decade.", source: "news", sourceName: "Vogue", date: "2026-02-10", crossLinks: [] },
  { id: "gnpc-s2", trendId: "gaming-npc-aesthetics", title: "r/streetwear: NPC mode is the new core aesthetic", summary: "The NPC aesthetic has crossed from ironic TikTok content into genuine subcultural style positioning.", source: "reddit", sourceName: "r/streetwear", date: "2026-03-15", crossLinks: [] },
  { id: "gnpc-s3", trendId: "gaming-npc-aesthetics", title: "SSENSE editorial: 'dressing like you spawned'", summary: "Independent fashion media is legitimising gaming-derived aesthetics with editorial frames, signalling movement from fringe to fashion mainstream.", source: "news", sourceName: "SSENSE", date: "2026-04-01", crossLinks: [] },

  // gaming-drop-economy
  { id: "gdrop-s1", trendId: "gaming-drop-economy", title: "Nike SNKRS waitlist psychology crosses into luxury", summary: "Limited digital drops in gaming have trained a generation to expect scarcity theatre; fashion brands are copying the mechanics wholesale.", source: "news", sourceName: "Business of Fashion", date: "2026-01-20", crossLinks: [] },
  { id: "gdrop-s2", trendId: "gaming-drop-economy", title: "Loot box litigation fuelling regulation that could touch blind box fashion drops", summary: "Legal challenges to randomised-reward mechanics in gaming are creating regulatory precedents that will eventually touch physical fashion's mystery drop formats.", source: "news", sourceName: "Wired", date: "2026-02-28", crossLinks: [] },
  { id: "gdrop-s3", trendId: "gaming-drop-economy", title: "Fortnite x Balenciaga drives $40M in 72-hour digital-physical sales", summary: "Cross-platform drops combining in-game digital items with physical clothing are setting new records for fashion's gaming crossover moment.", source: "news", sourceName: "Hypebeast", date: "2026-03-10", crossLinks: [] },

  // wellness-cold-ritual
  { id: "wcold-s1", trendId: "wellness-cold-ritual", title: "Plunge pool installations in luxury hotel fitness suites double in 2025", summary: "Cold exposure has moved from athlete recovery niche to amenity expectation, signalling mainstream aspirational adoption.", source: "news", sourceName: "Financial Times", date: "2026-01-05", crossLinks: [] },
  { id: "wcold-s2", trendId: "wellness-cold-ritual", title: "Cold plunge hardware enters premium home design — Plunge Pro sells out 3x", summary: "The cold plunge market is developing the same design-object logic as premium coffee equipment.", source: "news", sourceName: "TechCrunch", date: "2026-03-10", crossLinks: [] },
  { id: "wcold-s3", trendId: "wellness-cold-ritual", title: "r/coldplunge hits 500k members as mainstream adoption accelerates", summary: "Community growth signals the cold exposure ritual has fully crossed from fringe biohacking into mainstream wellness identity.", source: "reddit", sourceName: "r/coldplunge", date: "2026-04-01", crossLinks: [] },

  // wellness-cortisol
  { id: "wcort-s1", trendId: "wellness-cortisol", title: "Glossier launches stress-aware skincare sub-line citing cortisol science", summary: "Major beauty brands are explicitly building cortisol management into product briefs, treating chronic stress as a skin-level phenomenon.", source: "news", sourceName: "WWD", date: "2026-02-14", crossLinks: [] },
  { id: "wcort-s2", trendId: "wellness-cortisol", title: "Office design pivoting to low-arousal environments after burnout wave", summary: "Workplace design is borrowing therapeutic neuroscience, creating demand for materials and objects engineered to reduce physiological stress responses.", source: "news", sourceName: "Dezeen", date: "2026-04-05", crossLinks: [] },
  { id: "wcort-s3", trendId: "wellness-cortisol", title: "Adaptogens cross $8B market as cortisol anxiety mainstreams", summary: "The adaptogen supplement category is growing 30% YoY as cortisol reduction becomes an explicit consumer purchase motivation.", source: "news", sourceName: "Mintel", date: "2026-03-20", crossLinks: [] },

  // foodtech-functional
  { id: "ffunc-s1", trendId: "foodtech-functional", title: "Erewhon collab culture signals food-as-fashion-prop era", summary: "The ritualistic display of functional beverages in urban environments mirrors luxury accessory logic, transforming nutrition into visible social signalling.", source: "news", sourceName: "NY Magazine", date: "2026-01-30", crossLinks: [] },
  { id: "ffunc-s2", trendId: "foodtech-functional", title: "Liquid IV and functional brands enter fashion week gifting suites", summary: "The boundary between supplement brand and fashion lifestyle brand is dissolving, opening cross-category brand strategy opportunities.", source: "news", sourceName: "Hypebeast", date: "2026-03-02", crossLinks: [] },
  { id: "ffunc-s3", trendId: "foodtech-functional", title: "r/nootropics: functional drink carry is the new status signal at the gym", summary: "Community observation confirms functional beverages have crossed from nutrition choice into visible identity expression and social signalling.", source: "reddit", sourceName: "r/nootropics", date: "2026-04-10", crossLinks: [] },

  // foodtech-precision
  { id: "fprec-s1", trendId: "foodtech-precision", title: "ZOE hits 500k subscribers for microbiome-based nutrition plans", summary: "Consumer adoption of personalised nutrition intelligence is moving beyond early adopters into lifestyle mainstream.", source: "news", sourceName: "BBC Tech", date: "2026-02-22", crossLinks: [] },
  { id: "fprec-s2", trendId: "foodtech-precision", title: "Genomic sequencing costs drop 90% in five years — nutrition implications", summary: "The democratisation of genomic data will make DNA-based nutrition planning accessible at mass market price points within 24 months.", source: "news", sourceName: "The Economist", date: "2026-01-18", crossLinks: [] },
  { id: "fprec-s3", trendId: "foodtech-precision", title: "Apple Health integrates third-party CGM data for personalised food recommendations", summary: "Platform integration of continuous glucose data with food logging creates the first truly closed-loop personalised nutrition system at consumer scale.", source: "news", sourceName: "TechCrunch", date: "2026-03-25", crossLinks: [] },

  // mentalhealth-dopamine
  { id: "mdopa-s1", trendId: "mentalhealth-dopamine", title: "Muji redesigns checkout experience around dopamine release timing", summary: "Retail design is explicitly hiring neuroscientists to optimise purchase-moment reward experiences rather than just aesthetic presentation.", source: "news", sourceName: "Dezeen", date: "2026-03-20", crossLinks: [] },
  { id: "mdopa-s2", trendId: "mentalhealth-dopamine", title: "Gaming UX mechanics become standard retail design brief", summary: "The mechanics that make mobile games compulsive are being consciously imported into fashion retail environments and e-commerce flows.", source: "news", sourceName: "Wired", date: "2026-04-10", crossLinks: [] },
  { id: "mdopa-s3", trendId: "mentalhealth-dopamine", title: "r/psychology: dopamine menu is replacing doom scrolling as default habit", summary: "Consumer-level awareness of dopamine management is shifting from content consumption to curated experience design, creating new product opportunities.", source: "reddit", sourceName: "r/psychology", date: "2026-02-28", crossLinks: [] },

  // mentalhealth-therapeutic
  { id: "mther-s1", trendId: "mentalhealth-therapeutic", title: "Aesop interiors programme prioritises 'nervous system safety'", summary: "Luxury retail is adopting trauma-informed design language to differentiate flagship environments from mass-market stimulation overload.", source: "news", sourceName: "Wallpaper*", date: "2026-02-08", crossLinks: [] },
  { id: "mther-s2", trendId: "mentalhealth-therapeutic", title: "Earth tones dominate SS25 across 7 major houses — a trend or a signal?", summary: "The aesthetic convergence around muted, grounding colour palettes across fashion is read as a collective nervous system response to digital overstimulation.", source: "news", sourceName: "Business of Fashion", date: "2026-01-12", crossLinks: [] },
  { id: "mther-s3", trendId: "mentalhealth-therapeutic", title: "Loewe wins Wallpaper award for 'most calming retail environment'", summary: "Luxury brands are competing on therapeutic environment design as a differentiator, creating new design brief categories for interior designers.", source: "news", sourceName: "Wallpaper*", date: "2026-03-30", crossLinks: [] },

  // interiordesign-ai-spatial
  { id: "intai-s1", trendId: "interiordesign-ai-spatial", title: "Midjourney becomes standard interior design brief tool in major studios", summary: "Leading architecture and interior design firms report using AI image generation as a standard phase of the brief and pitch process, cutting visualisation costs by 60-80%.", source: "news", sourceName: "Dezeen", date: "2026-02-20", crossLinks: [] },
  { id: "intai-s2", trendId: "interiordesign-ai-spatial", title: "Morpholio Board adds AI trend prediction for interior stylists", summary: "Professional design tools are integrating predictive AI that analyses global design trends and suggests direction — moving from reference tool to creative co-pilot.", source: "news", sourceName: "Wallpaper*", date: "2026-03-14", crossLinks: [] },
  { id: "intai-s3", trendId: "interiordesign-ai-spatial", title: "r/interiordesign: AI renders are indistinguishable from real photography", summary: "Community discussion reveals AI-generated interior photography is now passing as real in client presentations, raising questions about authenticity and creative credit.", source: "reddit", sourceName: "r/interiordesign", date: "2026-04-02", crossLinks: [] },

  // interiordesign-ar-preview
  { id: "intar-s1", trendId: "interiordesign-ar-preview", title: "IKEA Place AR app reaches 100M downloads — spatial commerce normalised", summary: "AR furniture preview has moved from novelty to expected feature, with consumer research showing 3x increase in conversion rates for brands with spatial try-before-you-buy.", source: "news", sourceName: "TechCrunch", date: "2026-01-25", crossLinks: [] },
  { id: "intar-s2", trendId: "interiordesign-ar-preview", title: "Apple Vision Pro spatial showroom pilot converts luxury furniture buyers", summary: "High-ASP furniture brands are piloting full spatial showrooms in Vision Pro, where buyers walk through configured rooms before purchase.", source: "news", sourceName: "Dezeen", date: "2026-03-08", crossLinks: [] },
  { id: "intar-s3", trendId: "interiordesign-ar-preview", title: "r/HomeDecorating: I designed my entire living room in AR before buying anything", summary: "Consumer behaviour shift evident in design communities — buyers are making complete room decisions in AR before purchasing anything physically.", source: "reddit", sourceName: "r/HomeDecorating", date: "2026-04-15", crossLinks: [] },

  // interiordesign-smart-materials
  { id: "intsm-s1", trendId: "interiordesign-smart-materials", title: "Ecovative mycelium building panels approved for residential use in EU", summary: "Bio-based construction materials are moving from prototype to regulatory-approved product, opening the mass residential market.", source: "news", sourceName: "Dezeen", date: "2026-02-05", crossLinks: [] },
  { id: "intsm-s2", trendId: "interiordesign-smart-materials", title: "Living wall systems with integrated air quality sensors enter mainstream retail", summary: "Biophilic technology is adding data layers to plant-based interior systems, connecting aesthetics to measurable wellbeing outcomes.", source: "news", sourceName: "Wallpaper*", date: "2026-03-22", crossLinks: [] },
  { id: "intsm-s3", trendId: "interiordesign-smart-materials", title: "Self-cleaning surface coatings launched for residential kitchen applications", summary: "Nano-coating technology developed for medical environments is crossing into premium residential materials.", source: "news", sourceName: "Wired", date: "2026-01-30", crossLinks: [] },

  // travel-ai-itinerary
  { id: "travai-s1", trendId: "travel-ai-itinerary", title: "Google Travel AI planner reaches 50M monthly active users", summary: "AI-powered trip planning has crossed from early adopter curiosity into mainstream travel consideration behaviour, changing how intent converts to booking.", source: "news", sourceName: "TechCrunch", date: "2026-02-18", crossLinks: [] },
  { id: "travai-s2", trendId: "travel-ai-itinerary", title: "Booking.com AI assistant cuts average trip planning time from 7 hours to 40 minutes", summary: "The friction reduction in travel planning is compressing consideration timelines and increasing impulse booking rates significantly.", source: "news", sourceName: "Financial Times", date: "2026-03-05", crossLinks: [] },
  { id: "travai-s3", trendId: "travel-ai-itinerary", title: "r/travel: I used AI to plan my entire Southeast Asia trip — here's what it got right and wrong", summary: "Community testing of AI travel planning reveals high accuracy for logistics but persistent gaps in local cultural nuance — creating a hybrid human-AI planning model.", source: "reddit", sourceName: "r/travel", date: "2026-04-08", crossLinks: [] },

  // travel-immersive-tourism
  { id: "travimm-s1", trendId: "travel-immersive-tourism", title: "Vatican AR experience sells out 3 months in advance", summary: "Augmented reality overlays on heritage sites are generating premium pricing and advance booking demand that physical sites alone cannot command.", source: "news", sourceName: "Condé Nast Traveler", date: "2026-01-22", crossLinks: [] },
  { id: "travimm-s2", trendId: "travel-immersive-tourism", title: "Dubai Tourism Authority deploys citywide AR layer for visitors", summary: "City-level AR tourism infrastructure is moving from pilot projects to official tourism authority investment, signalling mainstream institutional adoption.", source: "news", sourceName: "Wired", date: "2026-03-15", crossLinks: [] },
  { id: "travimm-s3", trendId: "travel-immersive-tourism", title: "r/travel: AR at the Colosseum changed how I experienced history", summary: "First-person accounts of AR heritage tourism are driving aspiration and booking intent among travel communities — a social proof loop for destination investment.", source: "reddit", sourceName: "r/travel", date: "2026-02-28", crossLinks: [] },

  // fitness-biometric-training
  { id: "fitbio-s1", trendId: "fitness-biometric-training", title: "Supersapiens CGM for athletes goes mass market at $99/month", summary: "Continuous glucose monitoring for non-diabetic athletes has crossed the price-access threshold into serious amateur market, expanding biometric training to millions.", source: "news", sourceName: "TechCrunch", date: "2026-02-12", crossLinks: [] },
  { id: "fitbio-s2", trendId: "fitness-biometric-training", title: "Whoop 5.0 adds HRV-based training load AI recommendations", summary: "Wearable platforms are closing the loop from data collection to actionable coaching, removing the interpretation burden from the consumer.", source: "news", sourceName: "Wired", date: "2026-03-18", crossLinks: [] },
  { id: "fitbio-s3", trendId: "fitness-biometric-training", title: "r/running: my AI coach adjusted my marathon plan based on my HRV — ran a 20min PB", summary: "Community performance results from AI biometric coaching are driving word-of-mouth adoption at a pace no paid marketing could achieve.", source: "reddit", sourceName: "r/running", date: "2026-04-05", crossLinks: [] },

  // fitness-social-performance
  { id: "fitsoc-s1", trendId: "fitness-social-performance", title: "Strava hits 150M users — fitness data as primary social identity for Gen Z", summary: "The scale of fitness data sharing signals a permanent shift: athletic identity is now expressed through data platforms as much as through physical appearance.", source: "news", sourceName: "Financial Times", date: "2026-01-30", crossLinks: [] },
  { id: "fitsoc-s2", trendId: "fitness-social-performance", title: "Nike Run Club AI coach achieves 85% monthly retention vs 34% industry average", summary: "AI-powered coaching with social accountability is achieving retention rates that prove the community layer is as important as the hardware.", source: "news", sourceName: "Business Insider", date: "2026-03-10", crossLinks: [] },
  { id: "fitsoc-s3", trendId: "fitness-social-performance", title: "r/Fitness: I stopped caring about the scale when I started caring about my Strava score", summary: "Metric substitution in fitness communities reveals that social data points (pace, distance, consistency) are replacing weight as the primary health signifier.", source: "reddit", sourceName: "r/Fitness", date: "2026-02-20", crossLinks: [] },

  // music-ai-creation
  { id: "musai-s1", trendId: "music-ai-creation", title: "Suno reaches 10M monthly active creators — AI music generation mainstreams", summary: "AI music generation has crossed into mainstream creative use, with non-musicians generating usable output and challenging the licensing market fundamentally.", source: "news", sourceName: "TechCrunch", date: "2026-02-08", crossLinks: [] },
  { id: "musai-s2", trendId: "music-ai-creation", title: "Universal Music Group launches AI music licensing framework for brand use", summary: "Major labels are moving to monetise AI-generated music rather than fight it, creating new licensing categories that legitimise the format.", source: "news", sourceName: "Billboard", date: "2026-03-22", crossLinks: [] },
  { id: "musai-s3", trendId: "music-ai-creation", title: "r/WeAreTheMusicMakers: AI tools are now my co-writers, not my competitors", summary: "Professional music community shifts from resistance to integration as AI music tools prove useful for production workflow rather than replacement.", source: "reddit", sourceName: "r/WeAreTheMusicMakers", date: "2026-04-10", crossLinks: [] },

  // music-spatial-audio
  { id: "mussp-s1", trendId: "music-spatial-audio", title: "Apple Music Spatial Audio streams double in 12 months as hardware adoption grows", summary: "Spatial audio adoption is following hardware distribution — as Dolby Atmos headphones become accessible, the consumption format normalises.", source: "news", sourceName: "Variety", date: "2026-01-28", crossLinks: [] },
  { id: "mussp-s2", trendId: "music-spatial-audio", title: "Sleep audio app Calm launches binaural science programme with neuroscientists", summary: "Wellness audio is investing in clinical-grade spatial audio research to differentiate its health claims and justify premium pricing.", source: "news", sourceName: "CNBC", date: "2026-03-14", crossLinks: [] },
  { id: "mussp-s3", trendId: "music-spatial-audio", title: "r/audiophile: spatial audio is the first meaningful headphone upgrade in a decade", summary: "Audio enthusiast community validates spatial audio as genuine technical leap, accelerating aspirational adoption beyond mainstream consumers.", source: "reddit", sourceName: "r/audiophile", date: "2026-02-15", crossLinks: [] },

  // art-ai-legitimacy
  { id: "artai-s1", trendId: "art-ai-legitimacy", title: "Christie's sells AI-generated work for $432,500 — institutional market forms", summary: "Auction house validation of AI art has created a formal market structure with provenance, authentication, and price discovery — the prerequisites for a lasting category.", source: "news", sourceName: "The Art Newspaper", date: "2026-02-05", crossLinks: [] },
  { id: "artai-s2", trendId: "art-ai-legitimacy", title: "MoMA acquires first AI-generated piece for permanent collection", summary: "Museum permanent collection acquisition is the highest form of institutional legitimacy — AI art now has a place in the Western canon.", source: "news", sourceName: "Artforum", date: "2026-03-20", crossLinks: [] },
  { id: "artai-s3", trendId: "art-ai-legitimacy", title: "r/Art: the AI legitimacy debate has moved from 'is it art' to 'what makes it valuable'", summary: "Community discourse evolution signals that the philosophical debate has been superseded by market reality — the focus now is on value attribution, not ontology.", source: "reddit", sourceName: "r/Art", date: "2026-04-12", crossLinks: [] },

  // art-phygital-objects
  { id: "artphy-s1", trendId: "art-phygital-objects", title: "Damien Hirst's phygital edition sells 10,000 pieces in 6 hours", summary: "Celebrity artist adoption of phygital format has created mainstream awareness and proved demand for art objects that exist in both physical and digital space.", source: "news", sourceName: "The Art Newspaper", date: "2026-01-15", crossLinks: [] },
  { id: "artphy-s2", trendId: "art-phygital-objects", title: "Louis Vuitton x Yayoi Kusama phygital pieces trade at 3x retail on secondary market", summary: "Luxury brand + established artist phygital collaborations are creating secondary market premiums that validate the format's collectible credentials.", source: "news", sourceName: "Hypebeast", date: "2026-03-02", crossLinks: [] },
  { id: "artphy-s3", trendId: "art-phygital-objects", title: "r/NFT: phygital is the only format where both crypto-native and traditional collectors overlap", summary: "Collector community observation identifies phygital art as the bridge format between two previously separate markets — a structural opportunity for the art world.", source: "reddit", sourceName: "r/NFT", date: "2026-02-22", crossLinks: [] },

  // skincare-biotech-actives
  { id: "skbio-s1", trendId: "skincare-biotech-actives", title: "Exosome skincare raises $200M in VC funding as clinical results validate consumer claims", summary: "Investment capital is flowing into biotech skincare at scale, signalling that the category has crossed from speculative to evidence-backed in investor perception.", source: "news", sourceName: "WWD", date: "2026-02-18", crossLinks: [] },
  { id: "skbio-s2", trendId: "skincare-biotech-actives", title: "Fermentation-derived actives enter mass market through Unilever acquisition", summary: "When a Unilever-scale company acquires a biotech skincare brand, the category has officially crossed from prestige niche to mass market trajectory.", source: "news", sourceName: "Beauty Business", date: "2026-03-25", crossLinks: [] },
  { id: "skbio-s3", trendId: "skincare-biotech-actives", title: "r/SkincareAddiction: biotech actives have made my routine actually work — lab-backed or bust", summary: "Consumer community shift toward demanding clinical evidence for skincare actives is creating a floor quality standard that biotech companies are best positioned to meet.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-04-08", crossLinks: [] },

  // skincare-ai-personalisation
  { id: "skai-s1", trendId: "skincare-ai-personalisation", title: "L'Oréal's AI skin diagnostics deployed in 50,000 retail locations", summary: "At-scale deployment of AI skin analysis at point of sale transforms the skincare purchase from browse to prescription, increasing basket size and reducing returns.", source: "news", sourceName: "Forbes", date: "2026-01-25", crossLinks: [] },
  { id: "skai-s2", trendId: "skincare-ai-personalisation", title: "Prose hair care AI model drives 40% lower churn than standard subscription", summary: "AI personalisation in beauty proves its retention value — the data-matched formulation creates switching costs that generic products cannot replicate.", source: "news", sourceName: "Business of Fashion", date: "2026-03-12", crossLinks: [] },
  { id: "skai-s3", trendId: "skincare-ai-personalisation", title: "r/SkincareAddiction: AI-matched routine cleared my skin after 3 years of trial and error", summary: "Personal success stories from AI-recommended skincare routines are the most effective word-of-mouth driver in the category — impossible to manufacture without genuine efficacy.", source: "reddit", sourceName: "r/SkincareAddiction", date: "2026-02-28", crossLinks: [] },

  // luxury-blockchain-provenance
  { id: "luxblk-s1", trendId: "luxury-blockchain-provenance", title: "LVMH Aura blockchain tracks 50M luxury products — authenticity at scale", summary: "The largest luxury group has operationalised blockchain provenance at scale, creating competitive pressure for all premium brands to follow.", source: "news", sourceName: "Business of Fashion", date: "2026-02-10", crossLinks: [] },
  { id: "luxblk-s2", trendId: "luxury-blockchain-provenance", title: "EU Digital Product Passport framework confirmed — luxury compliance timeline set", summary: "Regulatory confirmation of the EU Digital Product Passport requirement creates a mandatory digital provenance infrastructure for all luxury goods sold in Europe by 2027.", source: "news", sourceName: "Vogue Business", date: "2026-03-18", crossLinks: [] },
  { id: "luxblk-s3", trendId: "luxury-blockchain-provenance", title: "r/Watches: blockchain authentication is killing the grey market for Rolex and Patek", summary: "The watch resale market sees blockchain provenance reducing counterfeit volume by 60% — proving the commercial case for authentication technology.", source: "reddit", sourceName: "r/Watches", date: "2026-04-02", crossLinks: [] },

  // luxury-ai-personalisation
  { id: "luxai-s1", trendId: "luxury-ai-personalisation", title: "Net-a-Porter AI personal stylist achieves 4x conversion rate vs. standard browse", summary: "AI personal shopping in luxury e-commerce converts at dramatically higher rates than catalogue browsing, proving the commercial case for personalisation investment.", source: "news", sourceName: "Business of Fashion", date: "2026-01-20", crossLinks: [] },
  { id: "luxai-s2", trendId: "luxury-ai-personalisation", title: "Chanel launches invite-only AI concierge for ultra-high-net-worth clients", summary: "Ultra-luxury brands are using AI to deepen exclusivity rather than democratise — the AI layer makes the personalised experience scalable without diluting the brand.", source: "news", sourceName: "Vogue", date: "2026-03-28", crossLinks: [] },
  { id: "luxai-s3", trendId: "luxury-ai-personalisation", title: "r/femalefashionadvice: the luxury AI stylist remembered my size change after my pregnancy — I was shocked", summary: "Consumer emotional response to AI memory and continuity in luxury service reveals that empathetic personalisation is the real luxury differentiator.", source: "reddit", sourceName: "r/femalefashionadvice", date: "2026-02-14", crossLinks: [] },

  // food-cultivated-protein
  { id: "foodcp-s1", trendId: "food-cultivated-protein", title: "GOOD Meat receives EU approval — cultivated chicken enters European restaurants", summary: "EU regulatory approval for cultivated meat removes the last major Western market barrier, triggering the restaurant and retail rollout phase.", source: "news", sourceName: "The Guardian", date: "2026-02-22", crossLinks: [] },
  { id: "foodcp-s2", trendId: "food-cultivated-protein", title: "Impossible Foods precision fermentation costs reach $8/kg — price parity approaching", summary: "Fermentation-derived protein is approaching conventional protein price parity at a pace that suggests mass market tipping point within 36 months.", source: "news", sourceName: "MIT Technology Review", date: "2026-03-15", crossLinks: [] },
  { id: "foodcp-s3", trendId: "food-cultivated-protein", title: "r/food: I ate cultivated chicken at a Michelin restaurant — couldn't tell the difference", summary: "Consumer taste validation from credible early adopters (fine dining context) is the word-of-mouth signal that precedes mainstream acceptance of new food technologies.", source: "reddit", sourceName: "r/food", date: "2026-04-05", crossLinks: [] },

  // food-ai-flavour
  { id: "foodfl-s1", trendId: "food-ai-flavour", title: "Givaudan AI flavour system cuts NPD cycle from 18 months to 3 months", summary: "The world's largest flavour company has operationalised AI in product development, compressing timelines that will force the entire industry to follow.", source: "news", sourceName: "Food Navigator", date: "2026-01-28", crossLinks: [] },
  { id: "foodfl-s2", trendId: "food-ai-flavour", title: "Mondelēz AI predicts next viral snack flavour 18 months before it trends", summary: "Predictive AI trained on social media and sales data is enabling FMCG brands to arrive at emerging flavour trends before consumer awareness peaks.", source: "news", sourceName: "Forbes", date: "2026-03-08", crossLinks: [] },
  { id: "foodfl-s3", trendId: "food-ai-flavour", title: "r/snacking: this AI-matched flavour combination should not work but it absolutely does", summary: "Consumer discovery of AI-developed flavour combinations is generating organic trial and social sharing that traditional NPD methods rarely achieve.", source: "reddit", sourceName: "r/snacking", date: "2026-02-18", crossLinks: [] },
];
